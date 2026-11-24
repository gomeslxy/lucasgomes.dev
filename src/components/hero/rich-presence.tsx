import { ArrowUpRight } from "lucide-react";
import { AnchorLink } from "@/components/ui/anchor-link";
import { heroProfile } from "@/lib/hero-profile";
import styles from "./rich-presence.module.css";

/** Direct, clickable proof index replacing decorative status widget. */
export function RichPresence() {
  return (
    <section className={styles.proofs} aria-label="Destaques">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Destaques</span>
        <span className={styles.count}>0{heroProfile.proofs.length}</span>
      </div>
      <ul className={styles.list}>
        {heroProfile.proofs.map((item) => (
          <li key={item.id}>
            <AnchorLink href={item.href} className={styles.item}>
              <div className={styles.itemMain}>
                <div className={styles.itemTop}>
                  <span className={styles.itemTitle}>{item.label}</span>
                  <span
                    className={styles.itemTag}
                    data-live={item.tag === "Em produção" || undefined}
                  >
                    {item.tag}
                  </span>
                </div>
                <p className={styles.itemDetail}>{item.detail}</p>
              </div>
              <ArrowUpRight className={styles.itemArrow} size={14} aria-hidden="true" />
            </AnchorLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
