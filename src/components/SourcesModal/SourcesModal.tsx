"use client";

import { useState } from "react";
import styles from "./SourcesModal.module.css";

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SOURCES = [
  {
    id: "lfs_district",
    title: "Labour Force Survey by District",
    org: "OpenDOSM",
    desc: "Quarterly unemployment rates by state and district. Used for baseline unemployment_rate per state (2022 annual average).",
    url: "https://open.dosm.gov.my/labour-market-review",
  },
  {
    id: "cpi_2d_state",
    title: "CPI by State (2-Digit Division)",
    org: "OpenDOSM",
    desc: "Consumer Price Index by state at the 2-digit COICOP division level, base year 2010 = 100. Used for baseline CPI stress measurement.",
    url: "https://open.dosm.gov.my/consumer-prices",
  },
  {
    id: "death_w_coa",
    title: "Deaths by Cause — 2024 Annual Statistics Report",
    org: "OpenDOSM / MOH",
    desc: "2023 suicide case counts (ICD-10 X60–X84: Intentional self-harm) sourced from the OpenDOSM 2024 Annual Statistics Report, Table 3.2.",
    url: "https://open.dosm.gov.my/publications/death",
  },
  {
    id: "dosm_population_2023",
    title: "Mid-Year Population Estimates 2023",
    org: "DOSM",
    desc: "Official state-level mid-year population estimates used to compute suicide rate per 100,000 population.",
    url: "https://open.dosm.gov.my/population",
  },
];

const FORMULA = "RI = 100 − (norm_suicide × 40) − (norm_unemployment × 35) − (norm_CPI × 25)";

export default function SourcesModal({ isOpen, onClose }: SourcesModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Data Sources">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Data Sources & Methodology</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.formulaBox}>
          <p className={styles.formulaLabel}>Resilience Index Formula</p>
          <code className={styles.formula}>{FORMULA}</code>
          <p className={styles.formulaNote}>
            norm_x = (x − min) / (max − min) across all 16 states.
            Higher RI = more resilient. Weights: SDG 3 (suicide) 40%, SDG 8 (unemployment 35%, CPI 25%).
          </p>
        </div>

        <div className={styles.sources}>
          {SOURCES.map((s) => (
            <div key={s.id} className={styles.sourceCard}>
              <div className={styles.sourceMeta}>
                <span className={styles.sourceId}>{s.id}</span>
                <span className={styles.sourceOrg}>{s.org}</span>
              </div>
              <h3 className={styles.sourceTitle}>{s.title}</h3>
              <p className={styles.sourceDesc}>{s.desc}</p>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                View source →
              </a>
            </div>
          ))}
        </div>

        <footer className={styles.footer}>
          All data is from official Malaysian government sources. No primary data collection performed.
          Compliant with UKM Data Challenge 5.0 dataset requirements.
        </footer>
      </div>
    </div>
  );
}
