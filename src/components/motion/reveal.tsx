"use client";

import { motion, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { revealPose, type RevealPattern } from "@/lib/motion-curves";
import { useSceneProgress } from "./scroll-director";
import styles from "./reveal.module.css";

type RevealProps = {
  children: ReactNode;
  pattern: RevealPattern;
  as?: "div" | "span";
  className?: string;
  innerClassName?: string;
  /** Fraction of the scroll range, not a wall-clock delay. */
  delay?: number;
};

const RANGES = {
  heading: { start: 1, end: .72 },
  meta: { start: .97, end: .74 },
  body: { start: .94, end: .56 },
  depth: { start: .98, end: .56 },
  row: { start: .96, end: .62 },
} as const;

/** A stationary measuring anchor and a small independent animated content layer. */
export function Reveal({ children, pattern, as = "div", className = "", innerClassName = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { progress, enhanced } = useSceneProgress(ref, RANGES[pattern]);
  const transform = useTransform(progress, value => revealPose(value, pattern, delay).transform);
  const opacity = useTransform(progress, value => revealPose(value, pattern, delay).opacity);
  const Tag = as;
  const Inner = as === "span" ? motion.span : motion.div;
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement> & React.Ref<HTMLSpanElement>} className={`${styles.anchor} ${className}`} data-reveal={pattern}>
      <Inner className={`${styles.content} ${innerClassName}`} style={enhanced ? { transform, opacity } : undefined}>
        {children}
      </Inner>
    </Tag>
  );
}
