"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { experienceConfig } from "@/lib/experience-config";
import { useEnhancedMotion } from "@/lib/use-animation-policy";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
};

export function TiltCard({ children, className, max = .65, glare = true }: TiltCardProps) {
  const enhancedMotion = useEnhancedMotion();
  if (!enhancedMotion || max === 0) {
    return <div className={cn("relative w-full", className)}>{children}</div>;
  }

  return <TiltInteraction className={className} max={max} glare={glare}>{children}</TiltInteraction>;
}

function TiltInteraction({ children, className, max = .65, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bounds = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, experienceConfig.spring);
  const spy = useSpring(py, experienceConfig.spring);
  const tilt = Math.max(0, Math.min(.7, max));
  const rotateY = useTransform(spx, [0, 1], [-tilt, tilt]);
  const rotateX = useTransform(spy, [0, 1], [tilt, -tilt]);
  const glareX = useTransform(spx, [0, 1], ["-5%", "5%"]);
  const glareY = useTransform(spy, [0, 1], ["-5%", "5%"]);
  const glareOpacity = useMotionValue(0);
  const sGlare = useSpring(glareOpacity, experienceConfig.spring);

  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    bounds.current = {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
    glareOpacity.set(experienceConfig.pointer.lightOpacity);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = bounds.current;
    if (e.pointerType !== "mouse" || !rect || !rect.width || !rect.height) return;
    px.set(Math.max(0, Math.min(1, (e.pageX - rect.left) / rect.width)));
    py.set(Math.max(0, Math.min(1, (e.pageY - rect.top) / rect.height)));
  };

  const onLeave = () => {
    bounds.current = null;
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(ref.current?.contains(document.activeElement) ? experienceConfig.pointer.lightOpacity * .5 : 0);
  };

  return (
    <div
      ref={ref}
      className={cn("[perspective:1000px]", className)}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
      onFocusCapture={() => glareOpacity.set(experienceConfig.pointer.lightOpacity * .5)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) glareOpacity.set(0);
      }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative h-full w-full"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ opacity: sGlare }}
          >
            <motion.div
              className="absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgba(255,225,212,0.1),transparent_65%)]"
              style={{ x: glareX, y: glareY }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
