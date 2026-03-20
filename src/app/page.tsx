"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import MapView from "@/components/MapView/MapView";
import InsightPanel from "@/components/InsightPanel/InsightPanel";
import SourcesModal from "@/components/SourcesModal/SourcesModal";
import LogoBar from "@/components/LogoBar/LogoBar";
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
  const baseStatesRef = useRef<StateData[]>([]);

  useEffect(() => {
    loadMasterData()
      .then((data) => {
        baseStatesRef.current = data.states;
        setResults(calculateRisk(data.states, DEFAULT_DELTAS));
      })
      .catch((err) => console.error("Failed to load master data:", err));
  }, []);

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
        <LogoBar />
        <button
          id="sources-btn"
          className={styles.sourcesBtn}
          onClick={() => setSourcesOpen(true)}
        >
          📊 Sources
        </button>
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
