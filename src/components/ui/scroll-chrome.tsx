"use client";

import { motion, useScroll } from "motion/react";
import { useEnhancedMotion } from "@/lib/use-animation-policy";

/**
 * Minimal, non-intrusive scroll progress indicator.
 * Displays only the sleek crimson hairline at the very top of the viewport.
 * Avoids any floating text or bottom ticks that collide with page typography.
 */
function ProgressLine() {
  const { scrollYProgress } = useScroll();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]">
      <motion.div className="h-full w-full origin-left bg-crimson" style={{ scaleX: scrollYProgress }} />
    </div>
  );
}

export function ScrollChrome() {
  const enhanced = useEnhancedMotion();
  return enhanced ? <ProgressLine /> : null;
}
