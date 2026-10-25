"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useEnhancedMotion } from "@/lib/use-animation-policy";
import { SPRING_FOLLOW } from "@/lib/utils";

/** Rest position, in viewport fractions. Mirrors `.hero-lens` in globals.css. */
const REST = { x: 0.68, y: 0.42 } as const;

/**
 * Hero backdrop: static lattice + a "lens" that reveals a brighter lattice
 * with crimson nodes.
 *
 * - Desktop (fine pointer): the lens follows the cursor through springs.
 * - Touch: the lens drifts on a CSS keyframe loop (compositor-only) and
 *   pauses when the hero leaves the viewport.
 * - Reduced motion: the lens stays at its rest position.
 */
export function HeroField() {
  const enhanced = useEnhancedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Direct attribute write: no React render when the hero enters/leaves.
    const observer = new IntersectionObserver(([entry]) => {
      el.dataset.heroPaused = String(!(entry?.isIntersecting ?? true));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      <div className="hero-ambient absolute inset-0" />
      <div className="hero-grid absolute inset-0" />
      {enhanced ? (
        <PointerLens fieldRef={ref} />
      ) : (
        <div className="hero-lens">
          <div className="hero-lens-glow" />
          <div className="hero-lens-grid" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-ink to-transparent" />
    </div>
  );
}

function PointerLens({ fieldRef }: { fieldRef: RefObject<HTMLDivElement | null> }) {
  // Only mounted on the client (enhanced is false during SSR), so window is safe.
  const [rest] = useState(() => ({ x: window.innerWidth * REST.x, y: window.innerHeight * REST.y }));
  const x = useMotionValue(rest.x);
  const y = useMotionValue(rest.y);
  const sx = useSpring(x, SPRING_FOLLOW);
  const sy = useSpring(y, SPRING_FOLLOW);
  const ix = useTransform(sx, (v) => -v);
  const iy = useTransform(sy, (v) => -v);

  useEffect(() => {
    const field = fieldRef.current;
    const section = field?.parentElement;
    if (!field || !section) return;

    // Page-space origin, measured on entry only — never inside pointermove.
    let origin = { x: 0, y: 0 };
    const measure = () => {
      const rect = field.getBoundingClientRect();
      origin = { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
    };
    measure();

    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") measure();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.pageX - origin.x);
      y.set(event.pageY - origin.y);
    };
    const leave = () => {
      x.set(rest.x);
      y.set(rest.y);
    };

    section.addEventListener("pointerenter", enter);
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    return () => {
      section.removeEventListener("pointerenter", enter);
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
    };
  }, [fieldRef, rest, x, y]);

  return (
    <motion.div className="hero-lens" style={{ x: sx, y: sy }}>
      <div className="hero-lens-glow" />
      <motion.div className="hero-lens-grid" style={{ x: ix, y: iy }} />
    </motion.div>
  );
}
