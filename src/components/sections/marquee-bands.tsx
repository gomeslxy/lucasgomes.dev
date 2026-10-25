"use client";

import { VelocityMarquee } from "@/components/ui/velocity-marquee";
import { marqueeA, marqueeB } from "@/lib/data";

export function MarqueeBands() {
  return (
    <section
      aria-label="Stack e especialidades em movimento contínuo"
      className="relative z-10 w-full max-w-full overflow-hidden overflow-x-clip bg-ink py-16 md:py-[6.5vw]"
    >
      {/* Top Crimson Band */}
      <div className="relative -rotate-[2.8deg] scale-x-110 bg-crimson py-2.5 md:py-[0.85vw] text-ink">
        <VelocityMarquee
          items={marqueeA}
          baseVelocity={-1.5}
          itemClassName="text-[clamp(2.2rem,5.8vw,6rem)] leading-[0.95]"
          className="[&_svg]:text-ink"
        />
      </div>

      {/* Counter Bone Band */}
      <div className="relative -mt-6 md:-mt-[4vw] rotate-[2deg] scale-x-110 border-y border-ink bg-bone py-2.5 md:py-[0.85vw] text-ink">
        <VelocityMarquee
          items={marqueeB}
          baseVelocity={1.5}
          itemClassName="text-[clamp(2.2rem,5.8vw,6rem)] leading-[0.95]"
          className="[&_svg]:text-crimson"
        />
      </div>
    </section>
  );
}
