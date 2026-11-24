"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type PointerEvent } from "react";
import { useSceneProgress } from "@/components/motion/scroll-director";
import { experienceConfig } from "@/lib/experience-config";

export function BigName() {
  const ref = useRef<HTMLAnchorElement>(null);
  const { progress: scrollYProgress, enhanced } = useSceneProgress(ref, { start: .96, end: .5 });
  const bounds = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // Micro-tilt on hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, experienceConfig.spring);
  const springY = useSpring(y, experienceConfig.spring);

  // Opposing translations reveal a fixed-size layer without layout per frame.
  const revealY = useTransform(scrollYProgress, [0.1, 0.9], ["100%", "0%"]);
  const contentY = useTransform(scrollYProgress, [0.1, 0.9], ["-100%", "0%"]);

  function enter(event: PointerEvent<HTMLAnchorElement>) {
    if (!enhanced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    bounds.current = { x: rect.left + window.scrollX, y: rect.top + window.scrollY, width: rect.width, height: rect.height };
  }

  function move(event: PointerEvent<HTMLAnchorElement>) {
    const rect = bounds.current;
    if (!enhanced || event.pointerType !== "mouse" || !rect || !rect.width || !rect.height) return;
    x.set(Math.max(-1, Math.min(1, ((event.pageX - rect.x) / rect.width) * 2 - 1)) * .6);
    y.set(Math.max(-1, Math.min(1, ((event.pageY - rect.y) / rect.height) * 2 - 1)) * .4);
  }

  function reset() {
    bounds.current = null;
    x.set(0);
    y.set(0);
  }

  useEffect(() => {
    const invalidate = () => {
      bounds.current = null;
      x.set(0);
      y.set(0);
    };
    if (!enhanced) {
      invalidate();
      return;
    }
    window.addEventListener("resize", invalidate, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("blur", invalidate);
    document.addEventListener("visibilitychange", invalidate);
    const observer = new ResizeObserver(invalidate);
    if (ref.current) observer.observe(ref.current);
    return () => {
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("blur", invalidate);
      document.removeEventListener("visibilitychange", invalidate);
      observer.disconnect();
    };
  }, [enhanced, x, y]);

  return (
    <motion.a
      ref={ref}
      href="#hero"
      aria-label="Lucas — voltar ao início do portfólio"
      className="sig relative isolate mt-6 block overflow-hidden rounded-xl py-6 text-center outline-none focus-visible:ring-2 focus-visible:ring-crimson sm:py-10 group"
      initial={false}
      onPointerEnter={enhanced ? enter : undefined}
      onPointerMove={enhanced ? move : undefined}
      onPointerLeave={enhanced ? reset : undefined}
      onPointerCancel={enhanced ? reset : undefined}
    >
      <div className="relative inline-block select-none font-display text-[clamp(5.5rem,30vw,30rem)] leading-[0.88] tracking-[-0.04em]">
        {/* Layer 1: Base Outline Text */}
        <span
          aria-hidden="true"
          className="sig-outline block"
        >
          LUCAS
        </span>

        {/* Layer 2: Scroll-revealed Solid / Gradient Fill Layer */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            x: enhanced ? springX : 0,
            y: enhanced ? springY : 0,
          }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ y: enhanced ? revealY : 0 }}
          >
            <motion.span
              className="block text-bone group-hover:text-[#f1e6e4]"
              style={{ y: enhanced ? contentY : 0 }}
            >
              LUCAS
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-ash/70 mt-3 group-hover:text-crimson">
        ↑ Clique para voltar ao topo
      </p>
    </motion.a>
  );
}
