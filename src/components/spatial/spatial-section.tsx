"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useEnhancedMotion } from "@/lib/use-animation-policy";
import styles from "./spatial-section.module.css";

type SpatialSectionProps = {
  children: ReactNode;
  index: string;
  label: string;
  fold?: boolean;
  light?: boolean;
};

/** Short approach through perspective; no pinning or extra scrolling distance. */
export function SpatialSection({ children, index, label, fold = true, light = false }: SpatialSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enhanced = useEnhancedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 12%"] });
  const rotateX = useTransform(scrollYProgress, [0, .6, 1], [8, 2, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const opacity = useTransform(() => .72 + scrollYProgress.get() * .28);
  const seamRotate = useTransform(scrollYProgress, [0, .75, 1], [-64, -14, 0]);
  const seamScale = useTransform(scrollYProgress, [0, 1], [.86, 1]);
  const seamOpacity = useTransform(() => Math.max(0, Math.sin(scrollYProgress.get() * Math.PI) * .8));

  return (
    <div ref={ref} className={styles.section} data-spatial-section={index} data-fold={fold && enhanced ? true : undefined} data-light={light || undefined}>
      <div className={styles.seam} aria-hidden="true">
        <motion.div className={styles.foldPlane} style={enhanced ? { rotateX: seamRotate, scaleX: seamScale, opacity: seamOpacity } : { opacity: 0 }}>
          <span>{index} / {label}</span><i /><span>CONTINUE ↓</span>
        </motion.div>
      </div>
      <motion.div
        className={styles.content}
        style={enhanced && fold ? { rotateX, y, opacity } : undefined}
        transformTemplate={(latest, generated) => {
          const neutral = Number.parseFloat(String(latest.rotateX ?? 0)) === 0 && Number.parseFloat(String(latest.y ?? 0)) === 0;
          return neutral ? "none" : generated;
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
