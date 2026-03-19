"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { geoMercator, geoPath } from "d3-geo";
import styles from "./MapView.module.css";
import type { RiskResult } from "@/lib/types";

// Map TopoJSON feature IDs → our state IDs in master.json
const TOPOJSON_TO_ID: Record<string, string> = {
  "Johor":           "johor",
  "Kedah":           "kedah",
  "Kelantan":        "kelantan",
  "Melaka":          "melaka",
  "Negeri Sembilan": "negeri_sembilan",
  "Pahang":          "pahang",
  "Perak":           "perak",
  "Perlis":          "perlis",
  "Penang":          "pulau_pinang",
  "Sabah":           "sabah",
  "Sarawak":         "sarawak",
  "Selangor":        "selangor",
  "Terengganu":      "terengganu",
  "Kuala Lumpur":    "wp_kuala_lumpur",
  "Labuan":          "wp_labuan",
  "Putrajaya":       "wp_putrajaya",
};

const RISK_COLORS: Record<string, string> = {
  low:      "#22d3a0",
  medium:   "#f59e0b",
  high:     "#f97316",
  critical: "#ef4444",
  unknown:  "#2a3654",
};

interface TooltipState {
  x: number;
  y: number;
  name: string;
  ri: string;
  band: string;
}

interface MapViewProps {
  results?: RiskResult[];
  selectedStateId?: string | null;
  onStateSelect?: (stateId: string) => void;
}

export default function MapView({ results, selectedStateId, onStateSelect }: MapViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geoData, setGeoData] = useState<any>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Build lookup map: stateId → RiskResult
  const resultMap = new Map(results?.map((r) => [r.stateId, r]) ?? []);

  // Fetch TopoJSON → convert to GeoJSON once
  useEffect(() => {
    fetch("/data/malaysia-states.topojson")
      .then((r) => r.json())
      .then(async (topo) => {
        // Dynamic import to avoid SSR issues
        const { feature } = await import("topojson-client");
        const geojson = feature(topo, topo.objects.states);
        setGeoData(geojson);
      })
      .catch((e) => console.error("Failed to load Malaysia map:", e));
  }, []);

  const drawMap = useCallback(() => {
    if (!geoData || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const svg = svgRef.current;

    // Clear previous render
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const projection = geoMercator().fitSize([width, height], geoData);
    const pathGen = geoPath().projection(projection);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(g);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geoData.features.forEach((feat: any) => {
      const topoName = feat.id as string;
      const stateId = TOPOJSON_TO_ID[topoName] ?? topoName;
      const result = resultMap.get(stateId);
      const band = result?.riskBand ?? "unknown";
      const ri = result?.projectedResilienceIndex ?? 0;
      const isSelected = selectedStateId === stateId;

      const dAttr = pathGen(feat);
      if (!dAttr) return;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", dAttr);
      path.setAttribute("fill", RISK_COLORS[band]);
      path.setAttribute("stroke", isSelected ? "#63caff" : "#1a2540");
      path.setAttribute("stroke-width", isSelected ? "2.5" : "0.8");
      path.style.cursor = "pointer";
      path.style.opacity = isSelected ? "1" : "0.78";
      path.style.transition = "fill 0.4s ease, opacity 0.15s ease, stroke 0.2s ease";
      if (isSelected) {
        path.style.filter = `drop-shadow(0 0 8px ${RISK_COLORS[band]})`;
      }

      path.addEventListener("mouseenter", (e) => {
        path.style.opacity = "1";
        const mouseEvt = e as MouseEvent;
        const svgRect = svg.getBoundingClientRect();
        setTooltip({
          x: mouseEvt.clientX - svgRect.left,
          y: mouseEvt.clientY - svgRect.top,
          name: result?.stateName ?? topoName,
          ri: ri.toFixed(1),
          band,
        });
      });
      path.addEventListener("mousemove", (e) => {
        const mouseEvt = e as MouseEvent;
        const svgRect = svg.getBoundingClientRect();
        setTooltip((prev) =>
          prev ? { ...prev, x: mouseEvt.clientX - svgRect.left, y: mouseEvt.clientY - svgRect.top } : null
        );
      });
      path.addEventListener("mouseleave", () => {
        path.style.opacity = isSelected ? "1" : "0.78";
        setTooltip(null);
      });
      path.addEventListener("click", () => onStateSelect?.(stateId));

      g.appendChild(path);
    });
  }, [geoData, results, selectedStateId]);

  // Redraw on data/selection change
  useEffect(() => { drawMap(); }, [drawMap]);

  // Redraw on window resize
  useEffect(() => {
    const observer = new ResizeObserver(() => drawMap());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [drawMap]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.header}>
        <h2 className={styles.title}>Resilience Radar</h2>
        <p className={styles.subtitle}>Malaysia Mental Health Vulnerability Map · Click a state to inspect</p>
      </div>

      <div className={styles.mapWrapper}>
        {!geoData && (
          <div className={styles.loading}>
            <div className={styles.pulse} />
            <p>Loading Malaysia map...</p>
          </div>
        )}
        <svg ref={svgRef} className={styles.svg} />

        {tooltip && (
          <div
            className={styles.tooltip}
            style={{ left: tooltip.x + 14, top: tooltip.y - 56 }}
          >
            <strong>{tooltip.name}</strong>
            <span>Resilience Index: {tooltip.ri} · {tooltip.band.charAt(0).toUpperCase() + tooltip.band.slice(1)} Risk</span>
          </div>
        )}
      </div>

      <div className={styles.legend}>
        {(["low", "medium", "high", "critical"] as const).map((band) => (
          <div key={band} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: RISK_COLORS[band] }} />
            <span>{band.charAt(0).toUpperCase() + band.slice(1)} Risk</span>
          </div>
        ))}
      </div>
    </div>
  );
}
