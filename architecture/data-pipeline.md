# SOP: Data Pipeline — Resilience Radar

> **Purpose**: This document is the single source of truth for how raw official datasets are
> transformed into the static `public/data/master.json` payload consumed by the dashboard.
> If the pipeline logic changes, update this SOP **before** touching the code.

---

## 1. Goals

- Merge multiple official Malaysian datasets (OpenDOSM, KKMNow) into one consolidated JSON file.
- Compute a **baseline Resilience Index** for each of Malaysia's 16 states/territories.
- Ensure the output is deterministic, reproducible, and schema-validated before commit.

---

## 2. Inputs

| File | Source | Description |
|------|--------|-------------|
| `data/lfs_district.csv` | OpenDOSM — Labour Force Survey | Monthly unemployment rate by district |
| `data/cpi_2d_state.csv` | OpenDOSM — CPI (2-digit division, by state) | Inflation / cost-of-living proxy |
| `data/death_state.csv` | OpenDOSM — Deaths by state | Total deaths including suicide-attributable |
| `data/death_district_sex.csv` | OpenDOSM — Deaths by district & sex | Used to estimate suicide counts by region |

> **Rule**: Only use datasets sourced from **OpenDOSM** (`open.dosm.gov.my`) or **KKMNow** (`data.moh.gov.my`). No Kaggle, no Wikipedia, no synthetic data.

---

## 3. Scripts & Execution Order

Run the pipeline in this **exact sequence**:

```bash
# Step 1: Merge and clean raw CSVs
python tools/prep_master_data.py

# Step 2: Compute Resilience Index for all 16 states
python tools/calculate_risk_score.py

# Step 3: Validate output schema
python tools/verify_data.py
```

All intermediate files are saved to `.tmp/` and are gitignored. Only `public/data/master.json` is committed.

---

## 4. Transformation Logic

### Step 1 — `prep_master_data.py`

**Goal**: Produce a clean, state-level merged table.

1. **Load** each CSV with Pandas.
2. **Normalize state names** to ISO 3166-2:MY long-form English:
   - `"Pulau Pinang"` ✅ — `"Penang"` ❌
   - `"W.P. Kuala Lumpur"`, `"W.P. Putrajaya"`, `"W.P. Labuan"` treated as separate entries.
3. **Temporal alignment**: Filter all datasets to the **most recent overlapping year** (target: 2023; fallback: 2022).
4. **Aggregate** district-level data to state level using `groupby("state").mean()` for rates.
5. **Output**: `.tmp/merged_states.csv` — one row per state, columns: `state`, `unemployment_rate`, `cpi_index`, `death_count`.

### Step 2 — `calculate_risk_score.py`

**Goal**: Apply the Resilience Index formula.

**Formula**:
```
Resilience Index = 100 - (
    (normalized_unemployment * 0.40) +
    (normalized_cpi_stress   * 0.30) +
    (normalized_death_rate   * 0.30)
) * 100
```

Where each variable is min-max normalized across all 16 states:
```
normalized_X = (X - min(X)) / (max(X) - min(X))
```

**Risk Band thresholds** (based on Resilience Index score):

| Band | Score Range |
|------|------------|
| `low` | 70 – 100 |
| `medium` | 50 – 69 |
| `high` | 30 – 49 |
| `critical` | 0 – 29 |

**Output**: `.tmp/scored_states.json`

### Step 3 — `verify_data.py`

**Goal**: Assert the output matches the required schema before it is placed in `public/`.

Checks:
- Exactly 16 state entries.
- No `null` / `NaN` values in required fields.
- All `risk_band` values are one of: `low | medium | high | critical`.
- `resilience_index` is within `[0, 100]`.
- `data_sources` array is non-empty.

On failure: raises `AssertionError` with a descriptive message. Do **not** silence errors.

---

## 5. Output Schema

**`public/data/master.json`**

```json
{
  "generated_at": "2026-03-19",
  "states": [
    {
      "id": "selangor",
      "name": "Selangor",
      "baseline": {
        "unemployment_rate": 3.2,
        "cpi_index": 128.4,
        "death_rate_per_100k": 4.1,
        "resilience_index": 62.3
      },
      "risk_band": "medium",
      "data_sources": ["lfs_district", "cpi_2d_state", "death_state"]
    }
  ]
}
```

**Field Definitions**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Slug (lowercase, hyphenated) — matches SVG map path IDs |
| `name` | `string` | Official ISO 3166-2:MY long-form name |
| `baseline.unemployment_rate` | `number` | Annual average %, from LFS |
| `baseline.cpi_index` | `number` | CPI index value (base year 2010 = 100) |
| `baseline.death_rate_per_100k` | `number` | Death rate per 100,000 population |
| `baseline.resilience_index` | `number` | Composite score [0–100]; higher = more resilient |
| `risk_band` | `string` | Enum: `low \| medium \| high \| critical` |
| `data_sources` | `string[]` | Dataset IDs used — required for data transparency |

---

## 6. Edge Cases

| Scenario | Resolution |
|----------|-----------|
| State missing 2023 unemployment data | Fall back to 2022 mean; if absent, use national average. Log a warning. |
| W.P. territories with no district-level data | Aggregate `W.P. Kuala Lumpur` + `W.P. Putrajaya` into one entry. `W.P. Labuan` kept separate. |
| CPI data missing for a state | Interpolate from neighboring states or use national CPI. |
| Negative or >100 resilience index after normalization | Clamp to `[0, 100]` and log a warning — indicates an outlier state. |
| Duplicate rows in source CSV | Deduplicate by keeping the most recent entry per `(state, year)`. |

---

## 7. What NOT to Do

- ❌ Do not hardcode state-level numbers — always derive from source CSVs.
- ❌ Do not commit `.tmp/` files.
- ❌ Do not change the output schema without also updating `src/lib/types.ts` and this SOP.
- ❌ Do not use any dataset not listed in Section 2.
