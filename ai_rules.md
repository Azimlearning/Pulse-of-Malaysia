# AI Rules & Project Constitution — Resilience Radar

> This file governs all AI-assisted development on this project. Every feature, fix, and refactor must comply with these rules.

---

## 🟢 1. Non-Negotiable Compliance Rules

### Data & Sources
- **Only official Malaysian data.** Sources: OpenDOSM, KKMNow, MOH. No Kaggle, no GitHub datasets.
- **Always cite the dataset ID.** Every chart/visualization must reference its source (e.g., `lfs_district`, `cpi_2d_state`, `death_state`).
- **No primary data collection.** Do not fabricate, estimate, or extrapolate without labelling it clearly as "Projected."
- **No data in code.** All baseline numbers must come from `public/data/master.json`, never hardcoded in components.

### SDG Alignment
- **SDG 3 & SDG 8 only.** Every feature must map to one or both of these SDGs. If a proposed feature cannot be justified under these, reject it.

### Branding & Logos
- **Mandatory logos**: UKM, UKM Watan, Data Challenge 5.0, SDG 3, SDG 8.
- **Forbidden**: Personal university logos. No team or institution branding on the dashboard.

### Security
- Never expose API keys or secrets. Always use `.env` and `.env.local`.

---

## 🔵 2. Technical Rules

### Styling
- **Use Vanilla CSS / CSS Modules only.** No Tailwind CSS. No styled-components. No inline styles except for dynamic values (e.g., calculated heatmap colors).
- **All design tokens defined in `globals.css`.** Colors, fonts, spacing, and breakpoints as CSS custom properties (`--color-primary`, `--font-body`, etc.).
- **Dark mode is the default.** Light mode is a future consideration only.

### Code Architecture
- **No logic in components.** Business logic lives in `src/lib/`. Components are presentational only.
- **Simulator must be a pure function.** `calculateRisk()` in `src/lib/simulator.ts` must have zero side effects and be fully unit-testable.
- **No manual state edits.** Any changes to `public/data/master.json` must be made via a script in `tools/`, never manually.

### Data Processing
- **Python-first.** All data cleaning, merging, and transformation runs through `tools/`. Never process data in the browser.
- **`.tmp/` is ephemeral.** Nothing in `.tmp/` is committed to git. `public/data/master.json` is the only committed output.

---

## 🔴 3. "Absolute Do Not" Rules
- ❌ **Do not install Tailwind.** Not now, not ever on this project.
- ❌ **Do not hardcode state risk values.** Always derive from `master.json`.
- ❌ **Do not use `any` in TypeScript** except in edge cases and only with an explicit `// TODO: type this properly` comment.
- ❌ **Do not skip the data citation.** A visualization without a source label is incomplete.
- ❌ **Do not break the scoring rubric alignment.** The dashboard must be visually distinctive, interactive, and analytically deep (per the 25% dashboard scoring criteria).

---

## 4. Self-Healing Protocol
When an error occurs:
1. **Trace the stack.** Identify root cause.
2. **Fix in `tools/` or `src/lib/`.** Never patch in a component.
3. **Test atomically.** Run the affected script alone before full pipeline.
4. **Update the SOP.** Document the fix in `architecture/`.
