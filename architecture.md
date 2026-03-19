# System Architecture — Resilience Radar

## 1. Overview
Resilience Radar is a **statically served** Next.js application. There is no backend database. All data is pre-processed offline by Python scripts and output as a single JSON payload that is committed to the repository and served directly by Vercel.

The architecture follows the **A.N.T.** (Architecture, Navigation, Tools) 3-layer pattern.

---

## 2. Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS / CSS Modules (NO Tailwind) |
| Charts | Recharts |
| Map | D3-geo (SVG-based Malaysia state map) |
| Data Processing | Python 3, Pandas |
| Hosting | Vercel |

---

## 3. A.N.T. 3-Layer Architecture

### Layer 1: Architecture (`architecture/`)
Technical SOPs written in Markdown. Define goals, inputs, tool logic, and edge cases. If logic changes, update the SOP before updating the code.
- `architecture/data-pipeline.md` — SOP for Python data ingestion and cleaning.
- `architecture/simulator-logic.md` — SOP for the What-If risk calculation formulas.
- `architecture/design-tokens.md` — CSS design system: colors, fonts, spacing.

### Layer 2: Navigation (App Shell — `src/app/`)
The Next.js App Router is the reasoning layer. It orchestrates data loading and routes state between components.
- `src/app/page.tsx` — Root layout, composes `<Sidebar>`, `<MapView>`, `<InsightPanel>`.
- `src/lib/simulator.ts` — Pure TypeScript function: `calculateRisk(base, deltas) => RiskResult[]`. **No side effects.**
- `src/lib/data.ts` — Utility to load and parse the static JSON payload on page load.

### Layer 3: Tools (`tools/`)
Deterministic Python scripts. Atomic and testable.
- `tools/prep_master_data.py` — Merges raw CSVs into `public/data/master.json`.
- `tools/calculate_risk_score.py` — Applies the Resilience Index formula to the merged data.
- `tools/verify_data.py` — Validates the output JSON against the expected schema.

---

## 4. Data Flow

```
[Raw CSVs in data/]
       ↓ (tools/prep_master_data.py)
[.tmp/ intermediate files]
       ↓ (tools/calculate_risk_score.py)
[public/data/master.json]  ← Static JSON payload committed to repo
       ↓ (src/lib/data.ts, loaded at runtime in browser)
[React State]
       ↓ (user interaction: sliders in <Sidebar>)
[src/lib/simulator.ts: calculateRisk()]
       ↓
[Updated RiskResult[] → <MapView> re-renders heatmap colors]
```

---

## 5. JSON Data Schema

**`public/data/master.json`** — Output of the Python pipeline.

```json
{
  "generated_at": "2026-03-xx",
  "states": [
    {
      "id": "selangor",
      "name": "Selangor",
      "baseline": {
        "unemployment_rate": 3.2,
        "cpi_index": 128.4,
        "suicide_rate_per_100k": 4.1,
        "resilience_index": 62.3
      },
      "risk_band": "medium",
      "data_sources": ["lfs_district", "cpi_2d_state", "death_state"]
    }
  ]
}
```

**`RiskResult[]`** — Output of `simulator.ts`:

```ts
interface RiskResult {
  stateId: string;
  projectedResilienceIndex: number;
  riskBand: "low" | "medium" | "high" | "critical";
  delta: number; // change from baseline
}
```
