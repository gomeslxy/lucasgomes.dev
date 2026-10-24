"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Asterisk } from "lucide-react";
import { Fragment, useRef } from "react";
import { cn, wrap } from "@/lib/utils";

type VelocityMarqueeProps = {
  items: string[];
  baseVelocity?: number;
  className?: string;
  itemClassName?: string;
};

const COPIES = 4;

export function VelocityMarquee({ items, baseVelocity = -2, className, itemClassName }: VelocityMarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2500, 0, 2500], [8, 0, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={cn("flex overflow-hidden whitespace-nowrap select-none", className)}>
      <motion.div className="flex shrink-0 flex-nowrap" style={{ x, skewX, willChange: "transform" }}>
        {Array.from({ length: COPIES }).map((_, copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
            {items.map((item) => (
              <Fragment key={`${copy}-${item}`}>
                <span className={cn("display px-[0.35em]", itemClassName)}>{item}</span>
                <Asterisk className="h-[0.55em] w-[0.55em] shrink-0" strokeWidth={2.5} aria-hidden="true" />
              </Fragment>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
