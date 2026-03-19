"use client";

import styles from "./InsightPanel.module.css";
import type { RiskResult } from "@/lib/types";

interface InsightPanelProps {
  results?: RiskResult[];
  selectedStateId?: string | null;
}

const RISK_LABELS: Record<string, string> = {
  critical: "🔴 Critical",
  high:     "🟠 High",
  medium:   "🟡 Medium",
  low:      "🟢 Low",
};

/**
 * InsightPanel — Right panel showing real-time analytics and policy prescriptions.
 * Displays the top 3 most vulnerable states and dynamically generated action text.
 */
export default function InsightPanel({ results, selectedStateId }: InsightPanelProps) {
  const topRisk = results?.slice(0, 3) ?? [];

  const selectedState = results?.find((r) => r.stateId === selectedStateId);

  return (
    <div className={styles.container}>
      {/* Section: Top Vulnerability Hotspots */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.icon}>📡</span>
          <h2 className={styles.sectionTitle}>Vulnerability Hotspots</h2>
        </div>
        <div className={styles.hotspots}>
          {topRisk.length > 0 ? (
            topRisk.map((r, i) => (
              <div key={r.stateId} className={`${styles.hotspotCard} ${styles[r.riskBand]}`}>
                <div className={styles.hotspotRank}>#{i + 1}</div>
                <div className={styles.hotspotInfo}>
                  <div className={styles.hotspotName}>{r.stateName}</div>
                  <div className={styles.hotspotBand}>{RISK_LABELS[r.riskBand] ?? r.riskBand}</div>
                </div>
                <div className={styles.hotspotScore}>
                  <div className={styles.scoreValue}>{r.projectedResilienceIndex.toFixed(0)}</div>
                  <div className={`${styles.scoreDelta} ${r.delta < 0 ? styles.negative : styles.positive}`}>
                    {r.delta > 0 ? "+" : ""}{r.delta.toFixed(1)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.empty}>Adjust the sliders to see vulnerability projections.</p>
          )}
        </div>
      </div>

      {/* Section: Policy Prescription */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.icon}>💡</span>
          <h2 className={styles.sectionTitle}>Policy Prescription</h2>
        </div>
        <div className={styles.prescriptions}>
          {topRisk.length > 0 ? (
            topRisk
              .filter((r) => r.riskBand === "critical" || r.riskBand === "high")
              .map((r) => (
                <div key={r.stateId} className={styles.prescriptionCard}>
                  <strong>{r.stateName}</strong> requires immediate attention. The projected
                  Resilience Index of{" "}
                  <span className={styles.highlight}>
                    {r.projectedResilienceIndex.toFixed(1)}
                  </span>{" "}
                  indicates elevated mental health risk linked to economic strain. Consider
                  targeted B40 income support or employment retraining programmes.
                </div>
              ))
          ) : topRisk.length > 0 ? (
            <p className={styles.prescriptionCard}>
              All states are within acceptable resilience thresholds under current projections.
            </p>
          ) : null}

          {topRisk.filter((r) => r.riskBand === "critical" || r.riskBand === "high").length === 0 && results && (
            <p className={styles.empty} style={{ color: "var(--color-risk-low)" }}>
              ✓ No critical zones under current projection.
            </p>
          )}
        </div>
      </div>

      {/* Section: Selected State Detail */}
      {selectedState && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.icon}>🔍</span>
            <h2 className={styles.sectionTitle}>{selectedState.stateName}</h2>
          </div>
          <div className={styles.detailCard}>
            <div className={styles.detailRow}>
              <span>Baseline Index</span>
              <span>{selectedState.baselineIndex.toFixed(1)}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Projected Index</span>
              <span>{selectedState.projectedResilienceIndex.toFixed(1)}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Impact</span>
              <span className={selectedState.delta < 0 ? styles.negative : styles.positive}>
                {selectedState.delta > 0 ? "+" : ""}{selectedState.delta.toFixed(1)} pts
              </span>
            </div>
            <div className={styles.detailRow}>
              <span>Risk Level</span>
              <span>{RISK_LABELS[selectedState.riskBand]}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
