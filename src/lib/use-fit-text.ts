"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Fit once per width/font change; ignore height changes caused by our own write. */
export function useFitText<C extends HTMLElement, T extends HTMLElement>() {
  const containerRef = useRef<C>(null);
  const textRef = useRef<T>(null);

  useIsoLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    let rafId: number | null = null;
    let measuredWidth = -1;

    const fit = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const available = container.clientWidth;
        if (!available) return;

        const currentWidth = text.scrollWidth || text.offsetWidth;
        const currentSize = parseFloat(window.getComputedStyle(text).fontSize) || 100;

        if (currentWidth > 0 && currentSize > 0) {
          // Multiply with 0.996 safety margin to prevent subpixel layout overflow
          const targetSize = (currentSize * (available / currentWidth)) * 0.996;
          const nextSize = Math.max(12, targetSize);
          if (Math.abs(nextSize - currentSize) > 0.1) text.style.fontSize = `${nextSize}px`;
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

    const ro = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      if (Math.abs(width - measuredWidth) < 0.5) return;
      measuredWidth = width;
      fit();
    });
    ro.observe(container);

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return { containerRef, textRef };
}
