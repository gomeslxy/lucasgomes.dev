"use client";

import { useLenis } from "lenis/react";
import { useEffect } from "react";

/** Locks page scroll for dialogs, including Lenis wheel interception. */
export function useScrollLock(active: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    lenis?.stop();

    return () => {
      root.style.overflow = previous;
      lenis?.start();
    };
  }, [active, lenis]);
}
