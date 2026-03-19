# SOP: What-If Policy Simulator Logic — Resilience Radar

> **Purpose**: This document defines the exact calculation logic for `src/lib/simulator.ts`.
> The simulator is the core "wow factor" of the dashboard. If the formula changes, update
> this SOP **before** touching `simulator.ts`.

---

## 1. Goal

The What-If Simulator lets users (policymakers, judges) drag sliders to adjust key economic
variables and instantly see how the **Resilience Index** would change across all 16 Malaysian
states. The map heatmap re-renders in real-time to reflect the projected outcomes.

---

## 2. Inputs

### 2a. From `master.json` (loaded at page init)

Each state's `baseline` object:

```ts
interface StateBaseline {
  unemployment_rate:    number; // %
  cpi_index:            number; // index value
  death_rate_per_100k:  number; // per 100,000
  resilience_index:     number; // [0–100]
}
```

### 2b. From the User (slider deltas — `<Sidebar>` component)

```ts
interface SimulatorDeltas {
  unemployment_delta:    number; // +/- percentage points (e.g. -1.5 = reduce by 1.5pp)
  cpi_delta:             number; // +/- index points (e.g. +5 = CPI increases by 5)
  income_support_delta:  number; // +/- percentage points of B40 coverage
}
```

**Slider ranges** (enforced in UI):

| Slider | Min | Max | Step | Unit |
|--------|-----|-----|------|------|
| Unemployment Delta | -5.0 | +5.0 | 0.1 | pp |
| CPI Delta | -20 | +20 | 1 | index pts |
| Income Support Delta | -20 | +20 | 1 | pp of coverage |

---

## 3. The `calculateRisk()` Function

**Signature** (TypeScript):

```ts
function calculateRisk(
  states:  StateData[],
  deltas:  SimulatorDeltas
): RiskResult[]
```

**Algorithm** (per state):

```
1. projected_unemployment = baseline.unemployment_rate + unemployment_delta
   → Clamp to [0, 25]   (unemployment cannot be negative or exceed 25%)

2. projected_cpi = baseline.cpi_index + cpi_delta
   → Clamp to [80, 200]  (CPI floor at 80, cap at 200)

3. income_support_modifier = income_support_delta * INCOME_SUPPORT_WEIGHT
   → This represents the protective effect of B40 welfare on resilience.

4. projected_resilience_index =
       baseline.resilience_index
     - (unemployment_delta  * W_UNEMPLOYMENT)
     - (cpi_delta           * W_CPI)
     + (income_support_delta * W_INCOME_SUPPORT)
   → Clamp to [0, 100]

5. delta = projected_resilience_index - baseline.resilience_index

6. risk_band = assign_band(projected_resilience_index)
```

---

## 4. Weights & Constants

These weights are calibrated to reflect Malaysian SDG 3 & 8 research priorities:

```ts
const W_UNEMPLOYMENT   = 2.0;  // Each +1pp unemployment → -2 resilience pts
const W_CPI            = 0.3;  // Each +1 CPI point      → -0.3 resilience pts
const W_INCOME_SUPPORT = 1.5;  // Each +1pp B40 coverage → +1.5 resilience pts
```

> **Note**: These weights are intentionally conservative to avoid dramatic swings from small
> slider movements. Adjust only with evidence from Malaysian welfare economics literature.

---

## 5. Risk Band Assignment

```ts
function assign_band(index: number): RiskBand {
  if (index >= 70) return "low";
  if (index >= 50) return "medium";
  if (index >= 30) return "high";
  return "critical";
}
```

---

## 6. Output

```ts
interface RiskResult {
  stateId:                   string;
  projectedResilienceIndex:  number;   // [0–100]
  riskBand:                  RiskBand; // "low" | "medium" | "high" | "critical"
  delta:                     number;   // change from baseline (negative = worse)
}
```

The function returns `RiskResult[]` — one entry per state, in the same order as the input.

---

## 7. Map Color Mapping

The `<MapView>` component maps `riskBand` to fill colors:

| Risk Band | Hex Color | Meaning |
|-----------|-----------|---------|
| `low` | `#4C9F38` (SDG 3 Green) | Resilient — low intervention urgency |
| `medium` | `#F59E0B` (Amber) | Moderate risk — monitor closely |
| `high` | `#EF4444` (Red) | High risk — immediate policy attention |
| `critical` | `#7C3AED` (Purple) | Crisis zone — emergency intervention |

Color transitions must animate over **300ms** using `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 8. Performance Contract

- `calculateRisk()` must complete in **< 1ms** for 16 states.
- It is a **pure function** — no side effects, no API calls, no async.
- It must be callable on every slider `onChange` event (60fps budget).
- Do NOT add `useEffect`, `fetch`, or any async logic to `simulator.ts`.

---

## 9. InsightPanel Logic

After `calculateRisk()` runs, `<InsightPanel>` derives:

1. **Top 3 Most Impacted States**: Sort `RiskResult[]` by `delta` ascending (most worsened first).
2. **Policy Prescription Text**: Auto-generate a sentence per top state:
   > *"Kelantan's resilience is projected to drop by 8.2 points. Consider targeted B40 income support to offset unemployment pressure."*

Template:
```
"[State]'s resilience is projected to [drop/rise] by [|delta|] points.
[If drop]: Consider [primary lever based on largest contributing weight].
[If rise]: Policy change is projected to benefit this region."
```

The primary lever is the variable with the highest absolute weighted contribution to the delta.

---

## 10. Edge Cases

| Scenario | Resolution |
|----------|-----------|
| All sliders at zero | Return `RiskResult[]` identical to baseline — no change. |
| Projected index clamps to 0 | Still valid — display `critical` band with a UI warning tooltip. |
| Projected index clamps to 100 | Display `low` band — no tooltip needed. |
| State with unusually high baseline CPI | Formula handles this via relative delta, not absolute value. |
| User moves slider extremely fast | Debounce slider `onChange` by **16ms** (one frame). Calculator still runs synchronously. |

---

## 11. What NOT to Do

- ❌ Do not call any external API from `simulator.ts` — it must be a pure function.
- ❌ Do not modify weights without updating this SOP and justifying with data citations.
- ❌ Do not make `calculateRisk()` async — this breaks the real-time UX contract.
- ❌ Do not skip clamping — unclamped values will break the map color scale.
