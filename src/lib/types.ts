/**
 * Shared TypeScript types for Resilience Radar.
 * All data flowing through the app must conform to these interfaces.
 */

/** Risk classification band for a given state. */
export type RiskBand = "low" | "medium" | "high" | "critical" | "unknown";

/** Baseline data for a single Malaysian state from master.json */
export interface StateBaseline {
  unemployment_rate: number;     // %, e.g. 3.2 → 3.2%
  cpi_index: number;             // e.g. 128.4
  suicide_rate_per_100k: number; // e.g. 4.1
  resilience_index: number;      // 0–100 composite score (higher = more resilient)
}

/** A single state entry in public/data/master.json */
export interface StateData {
  id: string;           // snake_case state identifier, e.g. "selangor"
  name: string;         // Display name, e.g. "Selangor"
  baseline: StateBaseline;
  risk_band: RiskBand;
  data_sources: string[]; // e.g. ["lfs_district", "cpi_2d_state", "death_state"]
}

/** The root shape of public/data/master.json */
export interface MasterData {
  generated_at: string; // ISO date string
  states: StateData[];
}

/** Simulator input: how much to delta each variable from its baseline */
export interface SimulatorDeltas {
  unemploymentDelta: number; // percentage points, e.g. +1.5 means +1.5%
  inflationDelta: number;    // percentage points
  incomeSupportDelta: number; // percentage points (coverage increase)
}

/** Output of the calculateRisk() pure function */
export interface RiskResult {
  stateId: string;
  stateName: string;
  baselineIndex: number;
  projectedResilienceIndex: number;
  riskBand: RiskBand;
  delta: number;  // projectedResilienceIndex - baselineIndex
}
