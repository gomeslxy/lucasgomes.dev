"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import { useEffect } from "react";
import { useEnhancedMotion } from "@/lib/use-animation-policy";
import { registerScrollLockRuntime } from "@/lib/use-scroll-lock";

/** Drives Lenis from Motion's frame loop: one RAF for scroll + animations. */
function LenisFrameDriver() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const unregister = registerScrollLockRuntime(lenis);
    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    const visibility = () => {
      cancelFrame(update);
      if (document.hidden) {
        // Discard unfinished inertia rather than replaying it after tab restore.
        if (!lenis.isStopped && !lenis.isLocked) lenis.scrollTo(lenis.scroll, { immediate: true });
      } else frame.update(update, true);
    };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelFrame(update);
      unregister();
      document.removeEventListener("visibilitychange", visibility);
    };
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
