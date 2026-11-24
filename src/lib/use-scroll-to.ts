"use client";

import { useLenis } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { EASE_EXPO_FN } from "@/lib/utils";
import { isPageScrollLocked } from "@/lib/use-scroll-lock";

/** Lenis-aware scroll helper; falls back to native scrolling on touch. */
export function useScrollTo() {
  const lenis = useLenis();
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => () => {
    if (pending.current) cancelFrame(pending.current);
    pending.current = null;
  }, [lenis]);

  return useCallback(
    (target: string | number) => {
      if (pending.current) cancelFrame(pending.current);
      let attempts = 0;
      const navigate = () => {
        // A menu click closes its dialog in the same React event. Let its
        // cleanup release the shared lock before asking Lenis to navigate.
        if (isPageScrollLocked() || lenis?.isStopped) {
          if (++attempts < 3) frame.read(navigate);
          else pending.current = null;
          return;
        }
        pending.current = null;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (lenis) {
          lenis.scrollTo(target, { immediate: reduced, duration: 0.9, easing: EASE_EXPO_FN });
          return;
        }
        const behavior = reduced ? "instant" : "smooth";
        if (typeof target === "number") window.scrollTo({ top: Math.max(0, target), behavior });
        else {
          const element = target.startsWith("#") ? document.getElementById(target.slice(1)) : document.querySelector(target);
          element?.scrollIntoView({ behavior, block: "start" });
        }
      };
      pending.current = navigate;
      frame.read(navigate);
    },
    [lenis],
  );
}
