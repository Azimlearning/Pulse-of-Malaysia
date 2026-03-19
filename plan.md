# Actionable Plan — Resilience Radar

**Submission Deadline**: March 29, 2026 (Phase 1)

---

## Phase 1: Project Foundation ✅
- [x] Brainstorming: Defined core concept (What-If Policy Simulator).
- [x] Design review and approval.
- [x] Refresh all core docs (`prd.md`, `architecture.md`, `ai_rules.md`, `file_structure.md`).
- [x] Scaffold clean `src/` directory with placeholder components.
- [x] Create `enforcing-project-constraints` AI skill.
- [ ] Write Architecture SOPs (`architecture/data-pipeline.md`, `architecture/simulator-logic.md`, `architecture/design-tokens.md`).

---

## Phase 2: Data Pipeline ✅
- [x] Audit raw CSVs in `data/` — identify all usable columns.
- [x] Write `tools/calculate_risk_score.py` to compute baseline Resilience Index for all 16 states.
- [x] Write `tools/verify_data.py` to validate `public/data/master.json` schema.
- [x] Run full pipeline and commit the `master.json` output.

---

## Phase 3: What-If Simulator & Map ✅
- [x] Implement `src/lib/types.ts` — shared TypeScript interfaces.
- [x] Implement `src/lib/data.ts` — loads `master.json`.
- [x] Implement `src/lib/simulator.ts` — `calculateRisk()` pure function with the Resilience Index formula.
- [x] Build the Malaysia SVG map in `MapView.tsx` with D3-geo state paths.
- [x] Wire simulator output to map heatmap colors (with animated transitions).
- [x] Build `Sidebar.tsx` with interactive sliders for unemployment, CPI, income support.
- [x] Build `InsightPanel.tsx` — ranks top 3 impact states, generates policy prescription text.

---

## Phase 4: Premium UI Polish ✅
- [x] Apply design tokens from `globals.css` across all components.
- [x] Add micro-animations (slider → map color transition, panel update fade-in).
- [x] Add data source citations (dataset IDs visible per chart).
- [x] Add "Sources" modal accessible from header.
- [ ] Implement mandatory logos: UKM, UKM Watan, Data Challenge 5.0, SDG 3, SDG 8.
- [ ] Responsive check (desktop-first, but functional on tablet).

---

## Phase 5: Deliverables Prep
- [ ] Deploy to Vercel, test public URL.
- [ ] Record dashboard demo video (max 3 min) as backup.
- [ ] Design Infographic Poster (A3).
- [ ] Create Project Summary Slides (max 25 slides).
- [ ] Record full team Presentation Video (max 10 min, all members appear).
- [ ] Final consistency check: poster, slides, video, dashboard all aligned.
