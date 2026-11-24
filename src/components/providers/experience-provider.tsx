"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ExperienceIntro } from "@/components/experience/experience-intro";

/**
 * Motion follows the OS reduced-motion preference. Heavier pointer effects
 * (tilt, magnetic, cursor preview, Lenis) still gate themselves through
 * `useEnhancedMotion`, so touch devices only receive cheap transform
 * transitions such as the bottom sheet.
 */
export function ExperienceProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ExperienceIntro>{children}</ExperienceIntro>
    </MotionConfig>
  );
}
