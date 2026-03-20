/**
 * logos.config.ts
 * ================
 * Single source of truth for all mandatory competition logos.
 *
 * 🔴 To activate a logo:
 *   1. Place the image at the path in `src` (relative to /public)
 *   2. Change `available: false` → `available: true`
 *
 * Required logos per UKM Data Challenge 5.0 rules:
 *   - UKM logo
 *   - UKM Watan logo
 *   - Statistics Club / Data Challenge 5.0 logo
 *   - SDG 3 (Good Health and Well-Being)
 *   - SDG 8 (Decent Work and Economic Growth)
 */

export interface LogoConfig {
  id: string;
  src: string;
  alt: string;
  shortLabel: string;
  width: number;
  height: number;
  available: boolean;
}

export const LOGOS: LogoConfig[] = [
  {
    id: "ukm",
    src: "/logos/ukm.png",
    alt: "Universiti Kebangsaan Malaysia (UKM)",
    shortLabel: "UKM",
    width: 36,
    height: 36,
    available: false, // 🔴 REPLACE: drop public/logos/ukm.png
  },
  {
    id: "ukm-watan",
    src: "/logos/ukm-watan.png",
    alt: "UKM Watan",
    shortLabel: "Watan",
    width: 36,
    height: 36,
    available: false, // 🔴 REPLACE: drop public/logos/ukm-watan.png
  },
  {
    id: "data-challenge",
    src: "/logos/data-challenge.png",
    alt: "Data Challenge 5.0",
    shortLabel: "DC5.0",
    width: 80,
    height: 36,
    available: false, // 🔴 REPLACE: drop public/logos/data-challenge.png
  },
  {
    id: "sdg3",
    src: "/logos/sdg3.png",
    alt: "SDG 3: Good Health and Well-Being",
    shortLabel: "SDG 3",
    width: 36,
    height: 36,
    available: false, // 🔴 REPLACE: drop public/logos/sdg3.png
  },
  {
    id: "sdg8",
    src: "/logos/sdg8.png",
    alt: "SDG 8: Decent Work and Economic Growth",
    shortLabel: "SDG 8",
    width: 36,
    height: 36,
    available: false, // 🔴 REPLACE: drop public/logos/sdg8.png
  },
];
