"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import MapView from "@/components/MapView/MapView";
import InsightPanel from "@/components/InsightPanel/InsightPanel";
import SourcesModal from "@/components/SourcesModal/SourcesModal";
import { loadMasterData } from "@/lib/data";
import { calculateRisk } from "@/lib/simulator";
import type { SimulatorDeltas, RiskResult, StateData } from "@/lib/types";
import styles from "./page.module.css";

const DEFAULT_DELTAS: SimulatorDeltas = {
  unemploymentDelta: 0,
  inflationDelta: 0,
  incomeSupportDelta: 0,
};

export default function HomePage() {
  const [deltas, setDeltas] = useState<SimulatorDeltas>(DEFAULT_DELTAS);
  const [results, setResults] = useState<RiskResult[] | undefined>(undefined);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  // Cache the base state data so we don't re-fetch on every delta change
  const baseStatesRef = useRef<StateData[]>([]);

  // Load master data once on mount
  useEffect(() => {
    loadMasterData()
      .then((data) => {
        baseStatesRef.current = data.states;
        setResults(calculateRisk(data.states, DEFAULT_DELTAS));
      })
      .catch((err) => console.error("Failed to load master data:", err));
  }, []);

  // Re-run simulator whenever deltas change (instant — no re-fetch needed)
  useEffect(() => {
    if (baseStatesRef.current.length === 0) return;
    setResults(calculateRisk(baseStatesRef.current, deltas));
  }, [deltas]);

  const handleDeltaChange = useCallback(
    (key: keyof SimulatorDeltas, value: number) =>
      setDeltas((prev) => ({ ...prev, [key]: value })),
    []
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoBar}>
          {/* SDG badge row */}
          <div className={styles.sdgBadges}>
            <span className={styles.sdgBadge} style={{ background: "#4c9a2a" }}>SDG 3</span>
            <span className={styles.sdgBadge} style={{ background: "#a21942" }}>SDG 8</span>
          </div>
          <span className={styles.headerTitle}>Resilience Radar · UKM Data Challenge 5.0</span>
          <button
            id="sources-btn"
            className={styles.sourcesBtn}
            onClick={() => setSourcesOpen(true)}
          >
            📊 View Sources
          </button>
        </div>
      </header>

      <main className={styles.layout}>
        <aside className={styles.sidebar}>
          <Sidebar deltas={deltas} onDeltaChange={handleDeltaChange} />
        </aside>

        <section className={styles.mapSection}>
          <MapView
            results={results}
            selectedStateId={selectedStateId}
            onStateSelect={setSelectedStateId}
          />
        </section>

        <aside className={styles.insightPanel}>
          <InsightPanel results={results} selectedStateId={selectedStateId} />
        </aside>
      </main>

      <SourcesModal isOpen={sourcesOpen} onClose={() => setSourcesOpen(false)} />
    </>
  );
}
