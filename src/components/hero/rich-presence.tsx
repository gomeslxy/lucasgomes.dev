"use client";

import { Cpu, Layers3, Terminal } from "lucide-react";
import { useId, useState } from "react";
import { heroProfile } from "@/lib/hero-profile";
import styles from "./rich-presence.module.css";

const activityIcons = { terminal: Terminal, layers: Layers3, cpu: Cpu };

/** Switchable, editorial rich presence. No polling, timers or playback claims. */
export function RichPresence() {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentId = useId();
  const activity = heroProfile.activities[activeIndex]!;
  const Icon = activityIcons[activity.icon];

  return (
    <section className={styles.presence} aria-label="Foco de desenvolvimento">
      <div className={styles.header}>
        <span className={styles.eyebrow}>
          <span className={styles.signal} aria-hidden="true"><i /><i /><i /></span>
          Atividade atual
        </span>
        <div className={styles.switcher} aria-label="Escolher atividade">
          {heroProfile.activities.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={index === activeIndex}
              aria-controls={contentId}
              className={styles.option}
              onClick={() => setActiveIndex(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div id={contentId} className={styles.content} aria-live="polite" aria-atomic="true">
        <div key={activity.id} className={styles.activity}>
          <span className={styles.icon} aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span>
          <div className={styles.copy}>
            <p className={styles.title}>{activity.title}</p>
            <p className={styles.detail}>{activity.detail}</p>
          </div>
          <span className={styles.focus} aria-hidden="true">↗</span>
        </div>
      </div>
    </section>
  );
}
