"use client";

import { VelocityMarquee } from "@/components/ui/velocity-marquee";
import { marqueeA, marqueeB } from "@/lib/data";
import { motion, useTransform } from "motion/react";
import { useRef } from "react";
import { useSceneProgress } from "@/components/motion/scroll-director";

export function MarqueeBands() {
  const ref = useRef<HTMLElement>(null);
  const { progress, enhanced } = useSceneProgress(ref, { start: 1, end: -.5 });
  const upper = useTransform(progress, p => `translate3d(${(p - .5) * 36}px, 0, 0) rotate(-2.8deg) scaleX(1.1)`);
  const lower = useTransform(progress, p => `translate3d(${(.5 - p) * 28}px, 0, 0) rotate(2deg) scaleX(1.1)`);
  return (
    <section
      ref={ref}
      aria-label="Stack e especialidades em movimento contínuo"
      className="relative z-10 w-full max-w-full overflow-hidden overflow-x-clip bg-ink py-16 md:py-[6.5vw]"
    >
      {/* Top Crimson Band */}
      <motion.div style={{ transform: enhanced ? upper : "rotate(-2.8deg) scaleX(1.1)" }} className="relative bg-crimson py-2.5 md:py-[0.85vw] text-ink">
        <VelocityMarquee
          items={marqueeA}
          baseVelocity={-1.5}
          itemClassName="text-[clamp(2.2rem,5.8vw,6rem)] leading-[0.95]"
          className="[&_svg]:text-ink"
        />
      </motion.div>

      {/* Counter Bone Band */}
      <motion.div style={{ transform: enhanced ? lower : "rotate(2deg) scaleX(1.1)" }} className="relative -mt-6 md:-mt-[4vw] border-y border-ink bg-bone py-2.5 md:py-[0.85vw] text-ink">
        <VelocityMarquee
          items={marqueeB}
          baseVelocity={1.5}
          itemClassName="text-[clamp(2.2rem,5.8vw,6rem)] leading-[0.95]"
          className="[&_svg]:text-crimson"
        />
      </motion.div>
    </section>
  );
}
