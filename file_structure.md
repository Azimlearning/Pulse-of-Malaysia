# File Structure Guide — Resilience Radar

> This document is the single source of truth for the project's file hierarchy. Any structural changes must be reflected here before they are implemented.

---

## Root Directory

```
resilience-radar/
├── .agent/                  # AI agent skills and configuration
├── .env                     # Local secrets (never committed)
├── .env.local               # Local overrides (never committed)
├── .gitignore
├── .tmp/                    # Ephemeral processing workspace (never committed)
├── README.md
├── ai_rules.md              # AI behavioral constraints (Project Constitution)
├── architecture.md          # High-level system architecture
├── architecture/            # Layer 1: Technical SOPs
│   ├── data-pipeline.md     # SOP: Python data ingestion & cleaning
│   ├── simulator-logic.md   # SOP: What-If risk calculation formulas
│   └── design-tokens.md     # SOP: CSS design system
├── data/                    # Raw input data CSVs (source of truth, never modified)
│   ├── cpi_2d_state.csv     # OpenDOSM — CPI by state
│   ├── death_state.csv      # MOH — Death by state
│   ├── death_district_sex.csv
│   ├── lfs_district.csv     # OpenDOSM — Labour Force Survey
│   └── master_crisis_data.csv  # Legacy pre-merged data
├── docs/                    # Project documentation (design docs, plans)
│   └── plans/
├── file_structure.md        # THIS FILE
├── next.config.ts
├── package.json
├── plan.md                  # Actionable phase-by-phase implementation plan
├── prd.md                   # Product Requirements Document
├── public/
│   └── data/
│       └── master.json      # ⭐ The static data payload (output of tools/)
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css      # Design system: all CSS custom properties & base styles
│   │   ├── layout.tsx       # Root layout (fonts, metadata)
│   │   └── page.tsx         # Main page: composes Sidebar + MapView + InsightPanel
│   ├── components/
│   │   ├── InsightPanel/    # Right panel: hotspot list & policy prescriptions
│   │   │   ├── InsightPanel.tsx
│   │   │   └── InsightPanel.module.css
│   │   ├── MapView/         # Center: SVG heatmap of Malaysia
│   │   │   ├── MapView.tsx
│   │   │   └── MapView.module.css
│   │   └── Sidebar/         # Left: "Control Room" sliders
│   │       ├── Sidebar.tsx
│   │       └── Sidebar.module.css
│   └── lib/
│       ├── data.ts          # Loads and parses public/data/master.json
│       ├── simulator.ts     # Pure function: calculateRisk(base, deltas) => RiskResult[]
│       └── types.ts         # Shared TypeScript interfaces (StateData, RiskResult, etc.)
├── tools/                   # Layer 3: Python data processing scripts
│   ├── prep_master_data.py  # Merges raw CSVs → .tmp/merged.csv
│   ├── calculate_risk_score.py  # Applies Resilience Index → public/data/master.json
│   ├── verify_data.py       # Validates output JSON schema
│   └── initial_eda.py       # (legacy) Exploratory data analysis
└── tsconfig.json
```

---

## Rules for This Structure

1. **Never put logic in `src/components/`.** Components are purely presentational.
2. **Every component lives in its own folder** with a matching `.module.css` file.
3. **`public/data/master.json` is sacred.** Do not edit it manually. Only `tools/` scripts write to it.
4. **`data/` is read-only.** Raw source CSVs are never modified. Scripts only read from here.
5. **`architecture/` SOPs are living documents.** Update them when logic changes.
