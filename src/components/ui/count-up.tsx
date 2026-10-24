"use client";

import { animate, motion, useInView, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const mv = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(() => `${String(0).padStart(pad, "0")}${suffix}`);

  useMotionValueEvent(mv, "change", (latest) => {
    setDisplayValue(`${String(Math.round(latest)).padStart(pad, "0")}${suffix}`);
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration, ease: EASE_EXPO });
    return () => controls.stop();
  }, [inView, mv, value, duration]);

  return (
    <motion.span ref={ref} className={className} style={{ willChange: "transform" }}>
      {displayValue}
    </motion.span>
  );
}

