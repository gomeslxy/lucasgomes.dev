"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import { useEffect } from "react";
import { useEnhancedMotion } from "@/lib/use-animation-policy";

/** Drives Lenis from Motion's frame loop: one RAF for scroll + animations. */
function LenisFrameDriver() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.update(update, true);
    return () => cancelFrame(update);
  }, [lenis]);

  return null;
}

/**
 * Inertial scroll for desktop with a precise pointer and no reduced-motion
 * preference. Touch devices keep native scrolling (and native momentum).
 * Rendered as a sibling — never a wrapper — so the page never remounts
 * when the media policy resolves after hydration.
 */
export function SmoothScroll() {
  const enhanced = useEnhancedMotion();
  if (!enhanced) return null;

  return (
    <>
      <ReactLenis
        root
        options={{
          autoRaf: false,
          lerp: 0.11,
          smoothWheel: true,
          syncTouch: false,
          anchors: true,
          stopInertiaOnNavigate: true,
        }}
      />
      <LenisFrameDriver />
    </>
  );
}
