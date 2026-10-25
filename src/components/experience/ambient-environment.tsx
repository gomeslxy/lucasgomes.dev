"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, type CSSProperties } from "react";
import { experienceConfig } from "@/lib/experience-config";
import styles from "./ambient-environment.module.css";

// Deterministic placement keeps server rendering and hydration identical.
const MOTES = Array.from({ length: experienceConfig.atmosphere.particleCount }, (_, index) => ({
  side: index % 2 ? "right" : "left",
  edge: 1.2 + (index * 7 % 6),
  top: 14 + (index * 17 % 76),
  duration: 16 + index % 5 * 3,
  delay: -(index * 2.7),
  drift: index % 2 ? -7 : 7,
}));

/** A peripheral atmosphere: small composited layers, with no pointer tracking. */
export function AmbientEnvironment() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const latticeY = useTransform(() => -Math.tanh(scrollY.get() / 1500) * 22);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const visibility = () => { element.dataset.paused = String(document.hidden); };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const lightSection = document.getElementById("trajetoria");
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.light = String(!!entry?.isIntersecting);
    }, { threshold: 0 });
    if (lightSection) observer.observe(lightSection);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  return (
    <div ref={ref} className={styles.environment} data-ambient-environment aria-hidden="true" style={{ "--ambient-cycle": `${experienceConfig.atmosphere.cycleSeconds}s`, "--ambient-strength": experienceConfig.atmosphere.glowOpacity } as CSSProperties}>
      <span className={`${styles.halo} ${styles.haloLeft}`} />
      <span className={`${styles.halo} ${styles.haloRight}`} />
      <motion.div className={styles.lattice} style={reduced ? undefined : { y: latticeY }}><span /></motion.div>
      <div className={styles.motes}>
        {MOTES.map((mote, index) => <i key={index} className={styles.mote} data-mote-index={index} data-mobile-hidden={index >= experienceConfig.atmosphere.mobileParticleCount || undefined} style={{ [mote.side]: `${mote.edge}%`, top: `${mote.top}%`, "--mote-duration": `${mote.duration}s`, "--mote-delay": `${mote.delay}s`, "--mote-drift": `${mote.drift}px` } as CSSProperties} />)}
      </div>
      <span className={`${styles.rail} ${styles.railLeft}`} />
      <span className={`${styles.rail} ${styles.railRight}`} />
    </div>
  );
}
