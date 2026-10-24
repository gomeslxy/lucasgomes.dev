"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * High-performance, zero-layout-thrashing text fitter.
 * Scales font-size to precisely match container width without intermediate DOM mutations.
 */
export function useFitText<C extends HTMLElement, T extends HTMLElement>() {
  const containerRef = useRef<C>(null);
  const textRef = useRef<T>(null);

  useIsoLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    let rafId: number | null = null;

    const fit = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const available = container.clientWidth;
        if (!available) return;

        const currentWidth = text.scrollWidth || text.offsetWidth;
        const currentSize = parseFloat(window.getComputedStyle(text).fontSize) || 100;

        if (currentWidth > 0 && currentSize > 0) {
          // Multiply with 0.996 safety margin to prevent subpixel layout overflow
          const targetSize = (currentSize * (available / currentWidth)) * 0.996;
          text.style.fontSize = `${Math.max(12, targetSize)}px`;
        }
      });
    };

    fit();
    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (!cancelled) fit();
      });
    }

    const ro = new ResizeObserver(() => fit());
    ro.observe(container);

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return { containerRef, textRef };
}
