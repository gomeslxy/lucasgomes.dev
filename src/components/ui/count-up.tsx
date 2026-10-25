"use client";

import { animate, useInView, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { useEnhancedMotion } from "@/lib/use-animation-policy";
import { EASE_EXPO } from "@/lib/utils";

type CountUpProps = {
  value: number;
  pad?: number;
  suffix?: string;
  className?: string;
  duration?: number;
};

export function CountUp({ value, pad = 2, suffix = "", className, duration = 1.8 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -10% 0px" });
  const enhancedMotion = useEnhancedMotion();
  const mv = useMotionValue(0);
  const displayValue = `${String(value).padStart(pad, "0")}${suffix}`;

  useEffect(() => {
    const element = ref.current;
    if (!element || !enhancedMotion || !inView) return;

    mv.set(0);
    // Update only this text node; a counter tick must not render React's tree.
    let previous = "";
    const unsubscribe = mv.on("change", (latest) => {
      const next = `${String(Math.round(latest)).padStart(pad, "0")}${suffix}`;
      if (next !== previous) element.textContent = next;
      previous = next;
    });
    const controls = animate(mv, value, { duration, ease: EASE_EXPO });

    return () => {
      controls.stop();
      unsubscribe();
      element.textContent = displayValue;
    };
  }, [inView, enhancedMotion, mv, value, duration, pad, suffix, displayValue]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}

