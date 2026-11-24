"use client";

import { Asterisk } from "lucide-react";
import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type VelocityMarqueeProps = {
  items: string[];
  baseVelocity?: number;
  className?: string;
  itemClassName?: string;
};

export function VelocityMarquee({ items, baseVelocity = -2, className, itemClassName }: VelocityMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const track = trackRef.current;
    if (!root || !track || baseVelocity === 0) return;

    let visible = false;
    const update = () => {
      track.style.animationPlayState = visible && !document.hidden ? "running" : "paused";
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      update();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", update);

    return () => {
      track.style.animationPlayState = "paused";
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [baseVelocity]);

  return (
    <div ref={ref} className={cn("flex overflow-hidden whitespace-nowrap select-none", className)}>
      <div
        ref={trackRef}
        className="velocity-marquee-track flex shrink-0 flex-nowrap"
        style={{
          "--marquee-duration": `${25 / Math.max(Math.abs(baseVelocity), 0.1)}s`,
          animationDirection: baseVelocity > 0 ? "reverse" : "normal",
        } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
            {items.map((item) => (
              <Fragment key={item}>
                <span className={cn("display px-[0.35em]", itemClassName)}>{item}</span>
                <Asterisk className="h-[0.55em] w-[0.55em] shrink-0" strokeWidth={2.5} aria-hidden="true" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
