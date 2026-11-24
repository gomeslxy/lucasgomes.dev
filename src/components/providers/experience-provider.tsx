"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ExperienceIntro } from "@/components/experience/experience-intro";
import { ScrollDirectorProvider } from "@/components/motion/scroll-director";

/**
 * Motion follows the OS reduced-motion preference. Pointer tilt, WebGL backdrop,
 * and Lenis smooth scrolling are gated by `useEnhancedMotion` on desktop fine-pointer devices.
 */
export function ExperienceProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ScrollDirectorProvider><ExperienceIntro>{children}</ExperienceIntro></ScrollDirectorProvider>
    </MotionConfig>
  );
}
