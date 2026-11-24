"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Minimal, non-intrusive scroll progress indicator.
 * Displays only the sleek crimson hairline at the very top of the viewport.
 * Avoids any floating text or bottom ticks that collide with page typography.
 */
export function ScrollChrome() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { damping: 30, stiffness: 200, mass: 0.4 });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]">
      <motion.div className="h-full w-full origin-left bg-crimson" style={{ scaleX }} />
    </div>
  );
}
