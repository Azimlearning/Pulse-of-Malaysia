# AI Rules & Project Constitution - Pulse of Malaysia

## 1. Compliance (Must Follow)
- **Data Source Verification**: All data must be sourced from official Malaysian platforms (OpenDOSM, KKMNow). If data is not available, do not hallucinate; use "N/A" or "Estimate based on [Source]".
- **SDG Alignment**: Every feature must map back to SDG 3 or SDG 8.
- **Branding**: Strictly use UKM and SDG logos on all user-facing pages. No personal branding.
- **Security**: Never expose API keys or secrets. Use `.env`.

## 2. Behavioral Rules
- **No Manual processing**: Always write a script in `tools/` for data cleaning or analysis.
- **Error Handling**: Follow the self-annealing protocol: 1. Trace error, 2. Fix script in `tools/`, 3. Test, 4. Update SOP in `architecture/`.
- **Transparency**: Every visualization must cite its specific DOSM dataset ID (e.g., `lfs_district`).

## 3. "Do Not" Rules
- **No Kaggle/GitHub Data**: Only use government APIs or CSV downloads.
- **No Over-Engineering**: The dashboard should be premium but lean. Prioritize data clarity over complex animations.
- **No Manual State Edits**: Any data adjustments must be documented in a Python script within `tools/`.
