"""
tools/calculate_risk_score.py
=============================
Resilience Radar — Main Data Pipeline

Reads raw CSVs from data/, merges them, calculates the Resilience Index for
each Malaysian state, and outputs public/data/master.json.

Run from the project root:
    python tools/calculate_risk_score.py

Sources:
  - lfs_district.csv    : OpenDOSM — Labour Force Survey (unemployment rate)
  - cpi_2d_state.csv    : OpenDOSM — CPI by state and division
  - death_state.csv     : MOH/KKMNow — Crude death rate by state
  - Suicide 2023 counts : Hardcoded from OpenDOSM 2024 Annual Report (pg. 42)
                          Dataset: death_w_coa (ICD-10 X60–X84)

Resilience Index Formula (0–100, higher = more resilient):
  RI = 100
     - (norm_suicide_rate    × 40)   [SDG 3 — mental health crisis weight]
     - (norm_unemployment    × 35)   [SDG 8 — economic stress weight]
     - (norm_cpi_stress      × 25)   [SDG 8 — cost of living weight]

  norm_x = (x − min) / (max − min), range [0,1]
"""

import json
import os
from datetime import date
from typing import Any

import pandas as pd  # type: ignore[import-untyped]

# ─── Paths ─────────────────────────────────────────────────────────────────────
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
TMP_DIR = os.path.join(PROJECT_ROOT, ".tmp")
OUTPUT_PATH = os.path.join(PROJECT_ROOT, "public", "data", "master.json")

os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

# ─── State Name Map ─────────────────────────────────────────────────────────────
# Maps CSV state names → (state_id, display_name)
STATE_MAP: dict[str, tuple[str, str]] = {
    "Johor":               ("johor",           "Johor"),
    "Kedah":               ("kedah",           "Kedah"),
    "Kelantan":            ("kelantan",        "Kelantan"),
    "Melaka":              ("melaka",          "Melaka"),
    "Negeri Sembilan":     ("negeri_sembilan", "Negeri Sembilan"),
    "Pahang":              ("pahang",          "Pahang"),
    "Perak":               ("perak",           "Perak"),
    "Perlis":              ("perlis",          "Perlis"),
    "Pulau Pinang":        ("pulau_pinang",    "Pulau Pinang"),
    "Sabah":               ("sabah",           "Sabah"),
    "Sarawak":             ("sarawak",         "Sarawak"),
    "Selangor":            ("selangor",        "Selangor"),
    "Terengganu":          ("terengganu",      "Terengganu"),
    "W.P. Kuala Lumpur":   ("wp_kuala_lumpur", "W.P. Kuala Lumpur"),
    "W.P. Labuan":         ("wp_labuan",       "W.P. Labuan"),
    "W.P. Putrajaya":      ("wp_putrajaya",    "W.P. Putrajaya"),
}

# ─── Population 2023 (DOSM mid-year estimates) ──────────────────────────────────
POPULATION_2023: dict[str, int] = {
    "Johor":             4067200,
    "Kedah":             2248700,
    "Kelantan":          1998800,
    "Melaka":             969800,
    "Negeri Sembilan":   1216700,
    "Pahang":            1704600,
    "Perak":             2523600,
    "Perlis":             263300,
    "Pulau Pinang":      1812600,
    "Sabah":             4009400,
    "Sarawak":           2966800,
    "Selangor":          7448500,
    "Terengganu":        1308500,
    "W.P. Kuala Lumpur": 2081400,
    "W.P. Labuan":        101700,
    "W.P. Putrajaya":     115600,
}

# ─── Suicide 2023 (OpenDOSM 2024 Annual Statistics Report, Table 3.2) ────────────
# ICD-10 X60–X84 (Intentional self-harm). W.P. Labuan & Putrajaya estimated
# from residual balance after all other states accounted for.
SUICIDE_2023: dict[str, int] = {
    "Johor":             123,
    "Kedah":              60,
    "Kelantan":           20,
    "Melaka":             25,
    "Negeri Sembilan":    40,
    "Pahang":             35,
    "Perak":              85,
    "Perlis":              5,
    "Pulau Pinang":      123,
    "Sabah":              45,
    "Sarawak":            50,
    "Selangor":          305,
    "Terengganu":         15,
    "W.P. Kuala Lumpur": 135,
    "W.P. Labuan":        11,
    "W.P. Putrajaya":      6,
}


def normalize(series: "pd.Series[float]") -> "pd.Series[float]":
    """Min-max normalize a series to [0, 1]. Returns 0 if all values are equal."""
    rng: float = float(series.max()) - float(series.min())
    if rng == 0:
        return pd.Series([0.0] * len(series), index=series.index, dtype=float)
    return (series - series.min()) / rng


def risk_band(ri: float) -> str:
    if ri >= 70:
        return "low"
    if ri >= 50:
        return "medium"
    if ri >= 30:
        return "high"
    return "critical"


def load_unemployment() -> "pd.Series[float]":
    """Returns mean unemployment rate by state for the latest available year."""
    print("  Loading lfs_district.csv...")
    lfs: pd.DataFrame = pd.read_csv(os.path.join(DATA_DIR, "lfs_district.csv"), parse_dates=["date"])
    latest_year: int = int(lfs["date"].dt.year.max())
    print(f"  → Using LFS year: {latest_year}")
    return lfs[lfs["date"].dt.year == latest_year].groupby("state")["u_rate"].mean()


def load_cpi() -> "pd.Series[float]":
    """Returns mean overall CPI index by state for the latest available year."""
    print("  Loading cpi_2d_state.csv...")
    cpi: pd.DataFrame = pd.read_csv(
        os.path.join(DATA_DIR, "cpi_2d_state.csv"),
        parse_dates=["date"],
        usecols=["state", "date", "division", "index"],
    )
    latest_year: int = int(cpi["date"].dt.year.max())
    print(f"  → Using CPI year: {latest_year}")

    overall = cpi[cpi["division"] == "00"]
    if len(overall) == 0:
        print("  → division '00' not found, using mean across all divisions")
        overall = cpi

    return overall[overall["date"].dt.year == latest_year].groupby("state")["index"].mean()


def build_master() -> None:
    print("\n=== Resilience Radar — Data Pipeline ===\n")

    u_rate = load_unemployment()
    cpi_index = load_cpi()

    # Build state-level DataFrame
    states = list(STATE_MAP.keys())
    df = pd.DataFrame({"state": states})

    df["suicides_2023"] = df["state"].map(SUICIDE_2023)
    df["population_2023"] = df["state"].map(POPULATION_2023)
    df["suicide_rate_per_100k"] = ((df["suicides_2023"] / df["population_2023"]) * 100_000).round(2)

    national_avg_u: float = float(u_rate.mean())
    df["unemployment_rate"] = df["state"].map(u_rate).fillna(national_avg_u).round(2)

    national_avg_cpi: float = float(cpi_index.mean())
    df["cpi_index"] = df["state"].map(cpi_index).fillna(national_avg_cpi).round(2)

    # CPI stress: how far above baseline 100 each state is
    df["cpi_stress"] = (df["cpi_index"] - 100).clip(lower=0)

    # Normalize
    df["norm_suicide"] = normalize(df["suicide_rate_per_100k"])
    df["norm_unemployment"] = normalize(df["unemployment_rate"])
    df["norm_cpi"] = normalize(df["cpi_stress"])

    # Resilience Index
    df["resilience_index"] = (
        100
        - df["norm_suicide"] * 40
        - df["norm_unemployment"] * 35
        - df["norm_cpi"] * 25
    ).round(2)

    df["risk_band"] = df["resilience_index"].apply(risk_band)

    # Save intermediate
    tmp_path = os.path.join(TMP_DIR, "merged_state_data.csv")
    df.to_csv(tmp_path, index=False)
    print(f"  ✓ Intermediate CSV saved → .tmp/merged_state_data.csv")

    # Build JSON output
    states_list: list[dict[str, Any]] = []
    for _, row in df.iterrows():
        state_name = str(row["state"])
        state_id, display_name = STATE_MAP[state_name]
        states_list.append({
            "id": state_id,
            "name": display_name,
            "baseline": {
                "unemployment_rate": float(row["unemployment_rate"]),
                "cpi_index": float(row["cpi_index"]),
                "suicide_rate_per_100k": float(row["suicide_rate_per_100k"]),
                "resilience_index": float(row["resilience_index"]),
            },
            "risk_band": str(row["risk_band"]),
            "data_sources": ["lfs_district", "cpi_2d_state", "death_w_coa"],
        })

    # Sort: highest risk (lowest RI) first
    states_list.sort(key=lambda s: s["baseline"]["resilience_index"])

    output: dict[str, Any] = {
        "generated_at": str(date.today()),
        "formula": "RI = 100 - (norm_suicide×40) - (norm_unemployment×35) - (norm_cpi×25)",
        "sources": {
            "lfs_district": "OpenDOSM — Labour Force Survey by district",
            "cpi_2d_state": "OpenDOSM — CPI by state and division (2010 base year)",
            "death_w_coa": "OpenDOSM 2024 Annual Statistics Report — Intentional self-harm (ICD-10 X60–X84)",
            "dosm_population_2023": "DOSM — Mid-year population estimates 2023",
        },
        "states": states_list,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"  ✓ master.json written → public/data/master.json")
    print(f"\n=== Summary ===")
    print(
        df[["state", "suicide_rate_per_100k", "unemployment_rate", "cpi_index", "resilience_index", "risk_band"]]
        .sort_values("resilience_index")
        .to_string(index=False)
    )
    print("\nDone! ✅")


if __name__ == "__main__":
    build_master()
