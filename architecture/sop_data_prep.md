# SOP: Data Preparation & Risk Scoring

## Goal
To transform raw multi-state CSV datasets from OpenDOSM into a consolidated "Crisis Payload" for the Next.js dashboard.

## Inputs
- `data/lfs_district.csv`: Monthly unemployment rates by district.
- `data/death_district_sex.csv`: Annual deaths by district and sex.
- `data/cpi_2d_state.csv`: Consumer Price Index by state (inflation proxy).
- Manual "Source of Truth" (from official 2024 report): 2023 suicide stats.

## Process Logic
1. **Normalization**: Standardize all state and district names to official ISO-3166-2:MY (e.g., "Pulau Pinang" not "Penang").
2. **Temporal Alignment**: Filter all datasets to the most recent overlapping year (2022/2023).
3. **Calculation**: Compute the `risk_score` using the formula:
   `Risk = (Suicides / Max_Suicides) * 70 + (Unemployment_Rate / Max_U_Rate) * 30`
4. **Validation**: Ensure no null values exist for the 16 primary states/territories.

## Edge Cases
- **Missing Data**: If a state is missing unemployment data for 2023, fallback to the 2022 mean or the national average.
- **W.P. Data**: Consolidate Kuala Lumpur, Putrajaya, and Labuan if granular district data is unavailable in specific datasets.

## Output
- `data/master_crisis_data.csv`: A flattened CSV with state names, suicide counts, unemployment rates, and final risk scores.
