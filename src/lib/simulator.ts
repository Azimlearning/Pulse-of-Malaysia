import type { StateData, SimulatorDeltas, RiskResult, RiskBand } from "./types";

/**
 * WEIGHTS for the Resilience Index adjustment formula.
 * Each delta unit (1 percentage point) changes the index by this many points.
 *
 * These are calibrated heuristic weights, not regression coefficients.
 * They should be updated in architecture/simulator-logic.md when refined.
 *
 * Positive delta = improvement (higher resilience index).
 * Negative delta = worsening (lower resilience index).
 */
const WEIGHTS = {
  /** Unemployment worsening (positive delta = more unemployment = negative impact) */
  unemployment: -8.5,
  /** Inflation worsening (positive delta = higher prices = negative impact) */
  inflation: -5.0,
  /** Income support coverage increase (positive delta = more coverage = positive impact) */
  incomeSupport: +4.0,
} as const;

/**
 * Maps a resilience index score (0–100) to a risk band.
 * Lower resilience index = higher risk.
 */
function indexToRiskBand(index: number): RiskBand {
  if (index >= 70) return "low";
  if (index >= 50) return "medium";
  if (index >= 30) return "high";
  return "critical";
}

/**
 * Pure function: calculates projected risk results for all states based on
 * baseline data and user-controlled simulator deltas.
 *
 * This function has ZERO side effects. Do not add API calls or state mutations here.
 *
 * @param baselineStates - Array of states from master.json
 * @param deltas - The user's slider inputs
 * @returns Array of RiskResult, one per state, sorted by projected risk (highest risk first)
 */
export function calculateRisk(
  baselineStates: StateData[],
  deltas: SimulatorDeltas
): RiskResult[] {
  return baselineStates
    .map((state): RiskResult => {
      const adjustment =
        deltas.unemploymentDelta * WEIGHTS.unemployment +
        deltas.inflationDelta * WEIGHTS.inflation +
        deltas.incomeSupportDelta * WEIGHTS.incomeSupport;

      const projected = Math.max(0, Math.min(100, state.baseline.resilience_index + adjustment));
      const delta = projected - state.baseline.resilience_index;

      return {
        stateId: state.id,
        stateName: state.name,
        baselineIndex: state.baseline.resilience_index,
        projectedResilienceIndex: projected,
        riskBand: indexToRiskBand(projected),
        delta,
      };
    })
    .sort((a, b) => a.projectedResilienceIndex - b.projectedResilienceIndex); // highest risk first
}
