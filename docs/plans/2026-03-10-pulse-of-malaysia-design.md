# Design Document: Pulse of Malaysia

**Date:** 2026-03-10
**Project:** Pulse of Malaysia - Suicide Prevention & Economic Vulnerability Dashboard
**Status:** Draft / Pending Review

## 1. Overview
The **Pulse of Malaysia** is a data-driven web application designed for Malaysia's Data Challenge 5.0. It aims to address the rising mental health crisis (SDG 3) by correlating it with systemic economic stressors (SDG 8). The application identifies geographic "blind spots" where high economic vulnerability meets low mental health resource availability.

## 2. Problem Statement
Economic instability (unemployment, inflation) is a known trigger for suicide. However, mental health infrastructure is often concentrated in high-income urban centers, leaving vulnerable populations in high-stress regions without adequate support. 

## 3. Targeted SDGs
- **SDG 3: Good Health and Well-being:** Improving mental health outcomes through data-backed resource allocation.
- **SDG 8: Decent Work and Economic Growth:** Understanding how economic hardship impacts social resilience.

## 4. Proposed Solution
A custom web application that:
1.  **Visualizes Crisis Hotspots:** An interactive map of Malaysia showing the "Intervention Gap" (High Stress + Low Access).
2.  **Analyzes Historical Trends:** Correlating OpenDOSM economic data with MOH health data.
3.  **Predicts Risk:** A machine learning model that forecasts state-level mental health risk based on current economic trends (CPI, Unemployment).
4.  **Prescribes Action:** A "Policy Simulator" for government and NGOs to test the impact of adding new resources to specific districts.

## 5. Technical Architecture
- **Frontend:** Next.js (React) for a high-performance, SEO-friendly interactive dashboard.
- **Visualization:** Recharts or D3.js for custom maps and interactive data storytelling.
- **Predictive Engine:** A Python/R based model (XGBoost or Random Forest) integrated into the app via serverless functions or a pre-calculated JSON engine.
- **Deployment:** Vercel (publicly accessible web link).

## 6. Data Sources (Official Malaysia/ASEAN only)
- **OpenDOSM:** CPI, Unemployment, Household Income, Population.
- **MOH / KKMNow:** Suicide statistics, psychiatric ward locations, healthcare professional ratios.
- **PERKESO:** Job loss and labor market data.

## 7. Success Criteria & Impact
- High usability and visual quality (Infographic & Interactive Dashboard).
- Practical tool for MOH and NGOs to prioritize interventions.
- Adherence to all competition rules (Logos, SDGs, Language).
