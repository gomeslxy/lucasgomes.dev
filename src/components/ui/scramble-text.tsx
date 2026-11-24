"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_+";
const FRAME_MS = 42;

type ScrambleTextProps = {
  text: string;
  className?: string;
  duration?: number;
};

/**
 * One-shot decode effect for monospaced metadata. The real text ships in the
 * HTML and in an sr-only copy; the visible span is written imperatively
 * (no React state per frame). Monospace glyphs keep the width constant, so
 * there is no layout shift.
 */
export function ScrambleText({ text, className, duration = 900 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    let last = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const progress = (now - start) / duration;

      if (progress >= 1) {
        el.textContent = text;
        return;
      }

      if (now - last >= FRAME_MS) {
        last = now;
        const revealed = Math.floor(progress * text.length);
        let output = "";
        for (let i = 0; i < text.length; i++) {
          const char = text.charAt(i);
          output += i < revealed || char === " " ? char : GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
        }
        el.textContent = output;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text, duration]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span key={text} ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
