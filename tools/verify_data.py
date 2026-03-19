"""
tools/verify_data.py
====================
Validates the schema and data quality of public/data/master.json.

Run from the project root:
    python tools/verify_data.py

Exits with code 0 if valid, code 1 if any check fails.
"""

import json
import os
import sys

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public", "data", "master.json"
)

REQUIRED_ROOT_KEYS = {"generated_at", "formula", "sources", "states"}
REQUIRED_STATE_KEYS = {"id", "name", "baseline", "risk_band", "data_sources"}
REQUIRED_BASELINE_KEYS = {"unemployment_rate", "cpi_index", "suicide_rate_per_100k", "resilience_index"}
VALID_RISK_BANDS = {"low", "medium", "high", "critical"}
EXPECTED_STATE_COUNT = 16
REQUIRED_DATA_SOURCES = {"lfs_district", "cpi_2d_state", "death_w_coa"}


def fail(msg: str) -> None:
    print(f"  ❌ FAIL: {msg}")
    sys.exit(1)


def ok(msg: str) -> None:
    print(f"  ✓ {msg}")


def verify() -> None:
    print("\n=== Verifying public/data/master.json ===\n")

    if not os.path.exists(OUTPUT_PATH):
        fail(f"master.json not found at {OUTPUT_PATH}. Run calculate_risk_score.py first.")

    with open(OUTPUT_PATH, encoding="utf-8") as f:
        data = json.load(f)

    # Root structure
    missing = REQUIRED_ROOT_KEYS - set(data.keys())
    if missing:
        fail(f"Missing root keys: {missing}")
    ok(f"Root keys present: {REQUIRED_ROOT_KEYS}")

    # State count
    states = data["states"]
    if len(states) != EXPECTED_STATE_COUNT:
        fail(f"Expected {EXPECTED_STATE_COUNT} states, got {len(states)}")
    ok(f"State count: {len(states)} states")

    # Per-state validation
    seen_ids: set[str] = set()
    for s in states:
        name = s.get("name", "<unknown>")

        # Required keys
        missing_keys = REQUIRED_STATE_KEYS - set(s.keys())
        if missing_keys:
            fail(f"State '{name}' missing keys: {missing_keys}")

        # No duplicate IDs
        sid = s["id"]
        if sid in seen_ids:
            fail(f"Duplicate state ID: {sid}")
        seen_ids.add(sid)

        # Baseline keys
        baseline = s["baseline"]
        missing_baseline = REQUIRED_BASELINE_KEYS - set(baseline.keys())
        if missing_baseline:
            fail(f"State '{name}' baseline missing keys: {missing_baseline}")

        # Resilience Index range
        ri: float = baseline["resilience_index"]
        if not (0 <= ri <= 100):
            fail(f"State '{name}' resilience_index {ri} out of range [0, 100]")

        # Risk band valid
        if s["risk_band"] not in VALID_RISK_BANDS:
            fail(f"State '{name}' has invalid risk_band: {s['risk_band']}")

        # Positive rates
        if baseline["unemployment_rate"] < 0:
            fail(f"State '{name}' has negative unemployment_rate")
        if baseline["suicide_rate_per_100k"] < 0:
            fail(f"State '{name}' has negative suicide_rate_per_100k")

        # Data sources present
        if not set(s["data_sources"]) & REQUIRED_DATA_SOURCES:
            fail(f"State '{name}' missing required data_sources")

    ok(f"All {len(states)} states passed schema + range checks")
    ok(f"No duplicate state IDs")

    print(f"\n✅ Validation passed — master.json is clean and ready.\n")


if __name__ == "__main__":
    verify()
