# Project Requirements Document (PRD) — Resilience Radar

## 1. Vision & North Star
**North Star**: An interactive, data-driven platform that reveals the connection between economic stress and mental health in Malaysia, and empowers policymakers with a live "What-If" Policy Simulator to forecast the impact of their decisions.

**Project Name**: Resilience Radar (a.k.a. "Pulse of Malaysia")
**Tagline**: *Measure the nation's well-being. Simulate a better future.*

---

## 2. Target Audience
- Government policymakers (MOH, DOSM, EPU)
- Mental health NGOs and researchers
- UKM Data Challenge 5.0 judges

---

## 3. Core Features

### F1: Interactive Geospatial Heatmap (Required)
- A color-coded, SVG-based map of Malaysia's 16 states.
- Colors encode the **Resilience Index** (composite of suicide rate, unemployment, CPI stress).
- Clicking a state reveals a detailed breakdown panel.

### F2: What-If Policy Simulator (Wow Factor ⭐)
- A "Control Room" sidebar with sliders for key economic variables:
  - Unemployment Rate Delta (`+/-` %)
  - Inflation / CPI Delta (`+/-` %)
  - B40 Income Support Coverage Delta (`+/-` %)
- The simulator engine (`src/lib/simulator.ts`) recalculates risk scores in real-time.
- The heatmap updates dynamically — colors shift and animate as the user drags sliders.
- A "Policy Prescription" panel highlights the top 3 states most impacted by the user's changes.

### F3: Economic Vulnerability Index (EVI) breakdown
- A chart panel showing each state's contribution to the EVI.
- Sourced from: unemployment (`lfs_district`), CPI (`cpi_2d_state`).

### F4: Data Transparency Layer
- Every visualization must cite its specific DOSM dataset ID.
- A "Sources" modal accessible from the footer.

---

## 4. SDG Alignment
- **SDG 3**: Good Health and Well-being — predicting suicide risk, identifying vulnerable populations.
- **SDG 8**: Decent Work and Economic Growth — simulating unemployment and income impacts.

---

## 5. Success Metrics
- **Interactivity**: Judges can manipulate sliders and see the map change in < 100ms.
- **Accuracy**: All baseline data traceable to official DOSM/MOH datasets.
- **Impact**: Dashboard clearly identifies ≥ 3 high-priority intervention zones.
- **Aesthetics**: Premium dark-mode UI that immediately signals a professional product.

---

## 6. Constraints
- **Data Source**: Strictly official Malaysian data — OpenDOSM, KKMNow. No Kaggle.
- **Frontend**: Next.js (App Router) with Vanilla CSS / CSS Modules. **No Tailwind.**
- **Deployment**: Vercel (publicly accessible URL required for dashboard submission).
- **Timeline**: Phase 1 submission deadline: March 29, 2026.
- **Language**: All UI and materials in English.
