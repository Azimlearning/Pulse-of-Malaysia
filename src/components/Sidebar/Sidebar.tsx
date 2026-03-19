"use client";

import { useRef, useEffect } from "react";
import styles from "./Sidebar.module.css";
import type { SimulatorDeltas } from "@/lib/types";

interface SliderConfig {
  key: keyof SimulatorDeltas;
  label: string;
  min: number;
  max: number;
  step: number;
  source: string;
}

const SLIDERS: SliderConfig[] = [
  {
    key: "unemploymentDelta",
    label: "Unemployment Rate",
    min: -3,
    max: 3,
    step: 0.1,
    source: "lfs_district · OpenDOSM",
  },
  {
    key: "inflationDelta",
    label: "Inflation / CPI",
    min: -3,
    max: 3,
    step: 0.1,
    source: "cpi_2d_state · OpenDOSM",
  },
  {
    key: "incomeSupportDelta",
    label: "B40 Income Support",
    min: -5,
    max: 10,
    step: 0.5,
    source: "EPU Household Income Report",
  },
];

const DEFAULT_DELTAS: SimulatorDeltas = {
  unemploymentDelta: 0,
  inflationDelta: 0,
  incomeSupportDelta: 0,
};

interface SidebarProps {
  deltas: SimulatorDeltas;
  onDeltaChange: (key: keyof SimulatorDeltas, value: number) => void;
}

/** Returns the fill % for the slider track gradient */
function fillPct(value: number, min: number, max: number): string {
  return `${((value - min) / (max - min)) * 100}%`;
}

/** Returns a positive/neutral/negative class */
function valueClass(key: keyof SimulatorDeltas, value: number): string {
  if (key === "incomeSupportDelta") {
    return value >= 0 ? styles.valueGood : styles.valueBad;
  }
  return value > 0 ? styles.valueBad : value < 0 ? styles.valueGood : styles.valueNeutral;
}

function isAllDefault(deltas: SimulatorDeltas): boolean {
  return (
    deltas.unemploymentDelta === 0 &&
    deltas.inflationDelta === 0 &&
    deltas.incomeSupportDelta === 0
  );
}

export default function Sidebar({ deltas, onDeltaChange }: SidebarProps) {
  const sliderRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Sync CSS --val property for track gradient fill on each slider
  useEffect(() => {
    SLIDERS.forEach(({ key, min, max }) => {
      const el = sliderRefs.current[key];
      if (el) {
        el.style.setProperty("--val", fillPct(deltas[key], min, max));
      }
    });
  }, [deltas]);

  const handleReset = () => {
    SLIDERS.forEach(({ key }) => onDeltaChange(key, 0));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>LIVE SIMULATOR</div>
        <h1 className={styles.title}>What-If Policy Simulator</h1>
        <p className={styles.subtitle}>
          Adjust economic variables to project their impact on Malaysia&apos;s
          mental health resilience across all 16 states.
        </p>
      </div>

      <div className={styles.sliders}>
        {SLIDERS.map(({ key, label, min, max, step, source }) => {
          const value = deltas[key];
          const sign = value > 0 ? "+" : "";
          return (
            <div key={key} className={styles.sliderGroup}>
              <div className={styles.sliderLabel}>
                <span>{label}</span>
                <span className={valueClass(key, value)}>
                  {sign}{value.toFixed(key === "incomeSupportDelta" ? 1 : 1)}%
                </span>
              </div>
              <input
                ref={(el) => { sliderRefs.current[key] = el; }}
                type="range"
                id={`slider-${key}`}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onDeltaChange(key, parseFloat(e.target.value))}
                className={styles.slider}
                style={{ "--val": fillPct(value, min, max) } as React.CSSProperties}
              />
              <div className={styles.sliderScale}>
                <span>{min > 0 ? `+${min}` : min}%</span>
                <span>Baseline</span>
                <span>{max > 0 ? `+${max}` : max}%</span>
              </div>
              <p className={styles.sliderHint}>Source: {source}</p>
            </div>
          );
        })}
      </div>

      {/* Reset Button */}
      <button
        id="reset-simulator-btn"
        className={styles.resetBtn}
        onClick={handleReset}
        disabled={isAllDefault(deltas)}
      >
        ↺ Reset to Baseline
      </button>

      <footer className={styles.footer}>
        <p>Resilience Radar · UKM Data Challenge 5.0</p>
        <p>SDG 3 (Good Health) · SDG 8 (Decent Work)</p>
      </footer>
    </div>
  );
}
