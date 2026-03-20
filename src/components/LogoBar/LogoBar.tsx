/**
 * LogoBar.tsx
 * ============
 * Displays mandatory competition logos in the header.
 *
 * 🔴 PLACEHOLDER NOTICE:
 *   Replace the [REPLACE_*] slots below with the actual image files.
 *   Drop the images into: public/logos/
 *
 *   Required files:
 *     public/logos/ukm.png           — UKM university logo
 *     public/logos/ukm-watan.png     — UKM Watan logo
 *     public/logos/data-challenge.png — Data Challenge 5.0 logo
 *     public/logos/sdg3.png          — SDG 3 (Good Health) icon
 *     public/logos/sdg8.png          — SDG 8 (Decent Work) icon
 */

import styles from "./LogoBar.module.css";
import Image from "next/image";
import { LOGOS } from "./logos.config";

export default function LogoBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.group}>
        {LOGOS.map((logo) => (
          <div key={logo.id} className={styles.logoSlot} title={logo.alt}>
            {logo.available ? (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className={styles.logoImage}
              />
            ) : (
              <div
                className={styles.placeholder}
                style={{ width: logo.width, height: logo.height }}
                title={`[REPLACE: ${logo.src}]`}
              >
                <span className={styles.placeholderLabel}>{logo.shortLabel}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <span className={styles.centerText}>
        Resilience Radar · UKM Data Challenge 5.0
      </span>

      <div className={styles.group} />
    </div>
  );
}
