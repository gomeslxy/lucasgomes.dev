"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";
import { EASE_EXPO_FN } from "@/lib/utils";

/** Lenis-aware scroll helper; falls back to native scrolling on touch. */
export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (target: string | number) => {
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4, easing: EASE_EXPO_FN });
        return;
      }

      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";

      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior });
      } else {
        document.querySelector(target)?.scrollIntoView({ behavior, block: "start" });
      }
    },
    [lenis],
  );
}
