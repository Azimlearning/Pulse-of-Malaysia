# System Architecture - Pulse of Malaysia

## 1. Overview
The system follows the **A.N.T.** (Architecture, Navigation, Tools) 3-layer architecture for deterministic data processing and a Next.js frontend for visualization.

## 2. 3-Layer Logic (A.N.T)

### Layer 1: Architecture (`architecture/`)
- **SOPs**: Technical Standard Operating Procedures for data ingestion, cleaning, and model prediction.
- **Rules**: Validates input data schema (CSV formats) against the DOSM structure.

### Layer 2: Navigation
- **Reasoning Loop**: Decides which tool in `tools/` to call based on the data processing phase.
- **State Management**: Tracks which datasets have been processed and merged into the master file.

### Layer 3: Tools (`tools/`)
- `prep_master_data.py`: Merges raw CSVs into a dashboard-ready JSON/CSV payload.
- `calculate_risk_score.py`: Atomic script to apply the Resilience Index formula.
- `verify_data_integrity.py`: Automated tests to check for missing state values.

## 3. Data Flow
1. **Ingest**: Raw CSVs stored in `data/`.
2. **Process**: Tools in `tools/` clean and merge data into `.tmp/` (intermediates).
3. **Payload**: Final `master_crisis_data.csv` delivered to the Next.js app.
4. **Display**: Next.js (App Router) renders the "Pulse of Malaysia" UI.

## 4. Tech Stack
- **Languages**: Python (Data Science), TypeScript (Frontend).
- **Libraries**: Pandas, React, Tailwind CSS.
- **Environment**: `.env` for data API endpoints.
