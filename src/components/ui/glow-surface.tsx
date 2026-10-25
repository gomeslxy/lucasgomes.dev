"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { useEnhancedMotion } from "@/lib/use-animation-policy";
import { experienceConfig } from "@/lib/experience-config";
import { cn } from "@/lib/utils";
import styles from "@/components/spatial/living-surface.module.css";

type GlowSurfaceProps = {
  children: ReactNode;
  className?: string;
};

/** One rasterized light moves above the material; no gradient is rebuilt per frame. */
export function GlowSurface({ children, className }: GlowSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enhanced = useEnhancedMotion();
  const bounds = useRef<{ left: number; top: number } | null>(null);
  const boundsDirty = useRef(true);
  const pointerInside = useRef(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const light = useMotionValue(0);
  const sx = useSpring(x, experienceConfig.spring);
  const sy = useSpring(y, experienceConfig.spring);
  const opacity = useSpring(light, experienceConfig.spring);

  // A change in input policy cancels the enhancement without remounting content.
  useEffect(() => {
    if (!enhanced) {
      light.set(0);
      bounds.current = null;
      boundsDirty.current = true;
      pointerInside.current = false;
    }
  }, [enhanced, light]);

  useEffect(() => {
    if (!enhanced) return;
    const invalidate = () => {
      bounds.current = null;
      boundsDirty.current = true;
      light.set(0);
    };
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    document.addEventListener("toggle", invalidate, true);
    const observer = new ResizeObserver(invalidate);
    if (ref.current) observer.observe(ref.current);
    return () => {
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      document.removeEventListener("toggle", invalidate, true);
      observer.disconnect();
    };
  }, [enhanced, light]);

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!enhanced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    bounds.current = { left: rect.left + window.scrollX, top: rect.top + window.scrollY };
    boundsDirty.current = false;
    pointerInside.current = true;
    x.jump(event.pageX - bounds.current.left - 200);
    y.jump(event.pageY - bounds.current.top - 200);
    light.set(experienceConfig.pointer.lightOpacity);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enhanced || event.pointerType !== "mouse" || !pointerInside.current) return;
    if (boundsDirty.current || !bounds.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      bounds.current = { left: rect.left + window.scrollX, top: rect.top + window.scrollY };
      boundsDirty.current = false;
      light.set(experienceConfig.pointer.lightOpacity);
    }
    x.set(event.pageX - bounds.current.left - 200);
    y.set(event.pageY - bounds.current.top - 200);
  };

  const onPointerLeave = () => {
    bounds.current = null;
    boundsDirty.current = true;
    pointerInside.current = false;
    if (!ref.current?.contains(document.activeElement)) light.set(0);
  };

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (!enhanced) return;
    const container = event.currentTarget.getBoundingClientRect();
    const target = event.target.getBoundingClientRect();
    x.set(target.left - container.left + target.width / 2 - 200);
    y.set(target.top - container.top + target.height / 2 - 200);
    light.set(experienceConfig.pointer.lightOpacity * .55);
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) light.set(0);
  };

  return (
    <div
      ref={ref}
      className={cn(styles.surface, className)}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerLeave}
      onFocusCapture={onFocus}
      onBlurCapture={onBlur}
    >
      <span className={styles.lightEnvelope} aria-hidden="true">
        <motion.span className={styles.light} style={{ x: sx, y: sy, opacity: enhanced ? opacity : 0 }} />
      </span>
      <span className={styles.rimEnvelope} aria-hidden="true">
        <motion.span className={`${styles.light} ${styles.rimLight}`} style={{ x: sx, y: sy, opacity: enhanced ? opacity : 0 }} />
      </span>
      {children}
    </div>
  );
}
