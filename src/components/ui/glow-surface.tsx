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

// All live materials share event delivery and a ResizeObserver. Pointer movement
// consumes cached geometry; scroll invalidation never reads the DOM.
const surfaces = new Map<Element, () => void>();
let surfaceObserver: ResizeObserver | undefined;
const invalidateSurfaces = () => surfaces.forEach((invalidate) => invalidate());

function registerSurface(element: Element, invalidate: () => void) {
  if (!surfaces.size) {
    window.addEventListener("scroll", invalidateSurfaces, { passive: true });
    window.addEventListener("resize", invalidateSurfaces, { passive: true });
    window.addEventListener("blur", invalidateSurfaces);
    document.addEventListener("visibilitychange", invalidateSurfaces);
    surfaceObserver = new ResizeObserver((entries) => entries.forEach((entry) => surfaces.get(entry.target)?.()));
  }
  surfaces.set(element, invalidate);
  surfaceObserver?.observe(element);
  return () => {
    surfaces.delete(element);
    surfaceObserver?.unobserve(element);
    if (surfaces.size) return;
    surfaceObserver?.disconnect();
    surfaceObserver = undefined;
    window.removeEventListener("scroll", invalidateSurfaces);
    window.removeEventListener("resize", invalidateSurfaces);
    window.removeEventListener("blur", invalidateSurfaces);
    document.removeEventListener("visibilitychange", invalidateSurfaces);
  };
}

/** One rasterized light moves above the material; no gradient is rebuilt per frame. */
export function GlowSurface({ children, className }: GlowSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enhanced = useEnhancedMotion();
  const boundsStorage = useRef({ left: 0, top: 0 });
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
      light.jump(0);
      opacity.jump(0);
      sx.jump(sx.get());
      sy.jump(sy.get());
      bounds.current = null;
      boundsDirty.current = true;
      pointerInside.current = false;
    }
  }, [enhanced, light, opacity, sx, sy]);

  useEffect(() => {
    const element = ref.current;
    if (!enhanced || !element) return;
    const invalidate = () => {
      if (
        !pointerInside.current &&
        !bounds.current &&
        boundsDirty.current &&
        light.get() === 0 &&
        opacity.get() === 0
      ) {
        return;
      }
      bounds.current = null;
      boundsDirty.current = true;
      light.jump(0);
      opacity.jump(0);
      sx.jump(sx.get());
      sy.jump(sy.get());
    };
    return registerSurface(element, invalidate);
  }, [enhanced, light, opacity, sx, sy]);

  const measureBounds = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const target = boundsStorage.current;
    target.left = rect.left + window.scrollX;
    target.top = rect.top + window.scrollY;
    bounds.current = target;
    boundsDirty.current = false;
    return target;
  };

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!enhanced || event.pointerType !== "mouse") return;
    const target = measureBounds(event.currentTarget);
    pointerInside.current = true;
    x.jump(event.pageX - target.left - 200);
    y.jump(event.pageY - target.top - 200);
    light.set(experienceConfig.pointer.lightOpacity);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enhanced || event.pointerType !== "mouse" || !pointerInside.current) return;
    let target = bounds.current;
    if (boundsDirty.current || !target) {
      target = measureBounds(event.currentTarget);
      light.set(experienceConfig.pointer.lightOpacity);
    }
    x.set(event.pageX - target.left - 200);
    y.set(event.pageY - target.top - 200);
  };

  const onPointerLeave = () => {
    bounds.current = null;
    boundsDirty.current = true;
    pointerInside.current = false;
    if (!ref.current?.contains(document.activeElement)) light.set(0);
  };

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (!enhanced || !(event.target instanceof HTMLElement) || !event.target.matches(":focus-visible")) return;
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
      onPointerDown={event => { if (event.pointerType !== "mouse") onPointerLeave(); }}
      onFocusCapture={onFocus}
      onBlurCapture={onBlur}
    >
      <span className={styles.lightEnvelope} aria-hidden="true">
        <motion.span className={styles.light} style={{ x: sx, y: sy, opacity: enhanced ? opacity : 0 }} />
      </span>
      {children}
    </div>
  );
}
