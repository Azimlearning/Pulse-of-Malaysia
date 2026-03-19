# SOP: Design Tokens — Resilience Radar

> **Purpose**: This document is the single source of truth for all visual design decisions.
> Every color, font, spacing value, and animation duration used in the UI must come from
> this document. Do not hardcode values in component CSS — always use CSS custom properties.

---

## 1. Philosophy

The Resilience Radar design system follows three principles:

1. **SDG-Anchored Colors**: Every primary color maps to an SDG or institutional identity.
2. **Premium Dark-First**: The default mode is dark (`#0B0F19` background) — light mode is not required.
3. **Purposeful Motion**: Animations communicate data changes, not decoration.

---

## 2. Color Tokens

All tokens are defined as CSS custom properties in `src/app/globals.css`.

### 2a. Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-sdg3` | `#4C9F38` | SDG 3 "Good Health" — map low-risk zones, positive deltas |
| `--color-sdg3-hover` | `#3D852D` | Hover state for SDG 3 elements |
| `--color-sdg8` | `#A21942` | SDG 8 "Decent Work" — high-risk zones, negative deltas |
| `--color-sdg8-hover` | `#8B1538` | Hover state for SDG 8 elements |
| `--color-ukm-blue` | `#003399` | UKM institutional blue — headers, logo areas |
| `--color-ukm-red` | `#CC0000` | UKM institutional red — accents |
| `--color-ukm-yellow` | `#FFCC00` | UKM institutional yellow — highlights |

### 2b. Risk Band Colors (Map Heatmap)

These are the authoritative colors for the Malaysia SVG map fills:

| Token | Value | Risk Band | Meaning |
|-------|-------|-----------|---------|
| `--color-risk-low` | `#4C9F38` | `low` | Resilient state |
| `--color-risk-medium` | `#F59E0B` | `medium` | Moderate concern |
| `--color-risk-high` | `#EF4444` | `high` | High vulnerability |
| `--color-risk-critical` | `#7C3AED` | `critical` | Crisis intervention needed |

### 2c. Surface & Background

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0B0F19` | Page background (dark mode) |
| `--color-surface` | `rgba(17, 24, 39, 0.7)` | Card / panel glass surface |
| `--color-surface-border` | `rgba(255, 255, 255, 0.08)` | Subtle card borders |
| `--color-text-primary` | `#F9FAFB` | Primary text on dark bg |
| `--color-text-secondary` | `#9CA3AF` | Secondary / muted text |
| `--color-text-accent` | `#4C9F38` | Highlighted data values |

### 2d. Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-positive` | `#4C9F38` | Improvement indicators (delta positive) |
| `--color-negative` | `#EF4444` | Worsening indicators (delta negative) |
| `--color-neutral` | `#6B7280` | No-change state |
| `--color-warning` | `#F59E0B` | Caution / medium risk |

---

## 3. Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-heading` | `'Inter', sans-serif` | All headings (h1–h3) |
| `--font-body` | `'Roboto', sans-serif` | Body text, labels, data values |
| `--font-mono` | `'JetBrains Mono', monospace` | Data values, index scores, % figures |

### Font Scale

| Token | Value | HTML Element |
|-------|-------|-------------|
| `--text-h1` | `2.25rem` (36px) | Page title only — one per page |
| `--text-h2` | `1.875rem` (30px) | Section headers |
| `--text-h3` | `1.5rem` (24px) | Panel titles |
| `--text-base` | `1rem` (16px) | Body text |
| `--text-sm` | `0.875rem` (14px) | Labels, captions |
| `--text-xs` | `0.75rem` (12px) | Data source citations |

> **Import via Google Fonts** (in `src/app/layout.tsx`):
> `Inter:wght@400;600;700` and `Roboto:wght@400;500` and `JetBrains+Mono:wght@400`

---

## 4. Spacing & Layout Tokens

Based on a **4px base unit**. All spacing must be multiples of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | `4px` | Micro gaps (icon + label) |
| `--space-2` | `8px` | Tight internal padding |
| `--space-3` | `12px` | Button padding (vertical) |
| `--space-4` | `16px` | Standard component padding |
| `--space-6` | `24px` | Card padding |
| `--space-8` | `32px` | Section gaps |
| `--space-12` | `48px` | Large section breaks |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.5rem` (8px) | Buttons, chips, tags |
| `--radius-md` | `1rem` (16px) | Cards, panels |
| `--radius-lg` | `1.5rem` (24px) | Modal containers |
| `--radius-pill` | `9999px` | Badge pills |

---

## 5. Animation & Transition Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | `150ms` | Hover color changes |
| `--duration-normal` | `300ms` | Map color transitions, panel fade-in |
| `--duration-slow` | `500ms` | Page-level transitions |
| `--ease-premium` | `cubic-bezier(0.16, 1, 0.3, 1)` | All interactive animations |

### Required Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Map state fill color change | CSS `transition: fill` | `--duration-normal` | `--ease-premium` |
| Insight panel text update | Fade out → fade in | `--duration-fast` | `--ease-premium` |
| Slider thumb movement | `transition: left` (native) | Browser default | — |
| State card hover | `transform: translateY(-2px)` + shadow | `--duration-fast` | `--ease-premium` |
| Risk badge color change | `transition: background-color` | `--duration-normal` | `--ease-premium` |

---

## 6. Shadow & Glass Effects

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-soft` | `0 4px 20px -2px rgba(0,0,0,0.05)` | Subtle card lift |
| `--shadow-glow-sdg3` | `0 0 20px rgba(76,159,56, 0.2)` | SDG 3 element glow |
| `--shadow-glow-sdg8` | `0 0 20px rgba(162,25,66, 0.2)` | SDG 8 / critical element glow |
| `--blur-glass` | `12px` | Glassmorphism panels (`backdrop-filter`) |

**Glassmorphism pattern** (used on `<Sidebar>`, `<InsightPanel>`):
```css
.glass-panel {
  background: var(--color-surface);
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
}
```

---

## 7. How to Use Tokens in CSS Modules

**✅ Correct** — always reference a token:
```css
.card {
  background: var(--color-surface);
  padding: var(--space-6);
  border-radius: var(--radius-md);
  transition: transform var(--duration-fast) var(--ease-premium);
}
```

**❌ Wrong** — never hardcode a value:
```css
.card {
  background: rgba(17, 24, 39, 0.7); /* ❌ hardcoded */
  padding: 24px;                      /* ❌ hardcoded */
}
```

---

## 8. Logo Requirements (Hackathon Constraint)

All four logos **must appear** in the dashboard footer or header:

| Logo | Token Class | Minimum Display Size |
|------|------------|---------------------|
| UKM | `.logo-ukm` | 40px height |
| UKM Watan | `.logo-ukm-watan` | 40px height |
| Data Challenge 5.0 | `.logo-dc5` | 40px height |
| SDG 3 | `.logo-sdg3` | 32px height |
| SDG 8 | `.logo-sdg8` | 32px height |

> Place logo assets in `public/logos/`. Do not inline SVG logos as base64 strings.

---

## 9. What NOT to Do

- ❌ Do not use Tailwind utility classes — CSS Modules + tokens only.
- ❌ Do not add new colors outside of this document without updating `globals.css`.
- ❌ Do not use `animation: none` to disable transitions for performance — use `will-change: fill` on map paths instead.
- ❌ Do not use `!important` to override token values.
