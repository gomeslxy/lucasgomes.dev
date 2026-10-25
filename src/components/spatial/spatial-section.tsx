"use client";

import { motion, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useSceneProgress } from "@/components/motion/scroll-director";
import { quintic } from "@/lib/motion-curves";
import styles from "./spatial-section.module.css";

type SpatialSectionProps = {
  children: ReactNode;
  index: string;
  label: string;
  fold?: boolean;
  light?: boolean;
};

/** The seam moves independently. Content, sticky scenes and dialogs stay untransformed. */
export function SpatialSection({ children, index, label, fold = true, light = false }: SpatialSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { progress, enhanced } = useSceneProgress(ref, { start: 1.08, end: .12 });
  const transform = useTransform(progress, value => {
    const p = quintic(value);
    return `perspective(800px) translate3d(0, ${(1 - p) * 32}px, 0) rotateX(${fold ? (1 - p) * -26 : 0}deg) scaleX(${.94 + p * .06})`;
  });
  const opacity = useTransform(progress, value => Math.sin(Math.PI * value) * .8);
  const lineScale = useTransform(progress, value => .18 + quintic(value) * .82);

  return (
    <div ref={ref} className={styles.section} data-spatial-section={index} data-light={light || undefined}>
      <div className={styles.seam} aria-hidden="true">
        <motion.div className={styles.foldPlane} style={enhanced ? { transform, opacity } : { opacity: 0 }}>
          <span>{index} / {label}</span><i /><span>CONTINUE ↓</span>
        </motion.div>
        <motion.i className={styles.thread} style={enhanced ? { scaleX: lineScale } : undefined} />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
