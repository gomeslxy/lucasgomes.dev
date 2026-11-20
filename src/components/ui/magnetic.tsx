"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { useEnhancedMotion } from "@/lib/use-animation-policy";
import { cn, SPRING_MAGNETIC } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

const magnetics = new Set<() => void>();
const invalidateMagnetics = () => magnetics.forEach((invalidate) => invalidate());

function registerMagnetic(invalidate: () => void) {
  if (!magnetics.size) {
    window.addEventListener("scroll", invalidateMagnetics, { passive: true });
    window.addEventListener("resize", invalidateMagnetics, { passive: true });
    window.addEventListener("blur", invalidateMagnetics);
  }
  magnetics.add(invalidate);
  return () => {
    magnetics.delete(invalidate);
    if (magnetics.size) return;
    window.removeEventListener("scroll", invalidateMagnetics);
    window.removeEventListener("resize", invalidateMagnetics);
    window.removeEventListener("blur", invalidateMagnetics);
  };
}

/**
 * Tactile GPU-only magnetic pull on fine-pointer desktop.
 * The outer hit wrapper stays stationary so targets never jitter out from under
 * the cursor; only the inner composited span translates within <= 6px.
 */
export function Magnetic({ children, strength = 0.2, className }: MagneticProps) {
  const enhanced = useEnhancedMotion();

  if (!enhanced || strength <= 0) {
    return <span className={cn("inline-flex", className)}>{children}</span>;
  }

  return (
    <MagneticInteraction strength={strength} className={className}>
      {children}
    </MagneticInteraction>
  );
}

function MagneticInteraction({
  children,
  strength,
  className,
}: {
  children: ReactNode;
  strength: number;
  className?: string;
}) {
  const boundsStorage = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const boundsRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const maxTravel = Math.min(6, Math.max(0, strength * 24));
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING_MAGNETIC);
  const sy = useSpring(y, SPRING_MAGNETIC);

  useEffect(() => {
    const invalidate = () => {
      if (!boundsRef.current && x.get() === 0 && y.get() === 0) return;
      boundsRef.current = null;
      if (x.get() !== 0) x.set(0);
      if (y.get() !== 0) y.set(0);
    };
    return registerMagnetic(invalidate);
  }, [x, y]);

  const measureBounds = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const target = boundsStorage.current;
    target.left = rect.left;
    target.top = rect.top;
    target.width = rect.width;
    target.height = rect.height;
    boundsRef.current = target;
    return target;
  };

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") return;
    measureBounds(event.currentTarget);
  };

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = boundsRef.current ?? measureBounds(event.currentTarget);
    if (!rect.width || !rect.height) return;
    const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
    x.set(nx * maxTravel);
    y.set(ny * maxTravel);
  };

  const handlePointerLeave = () => {
    boundsRef.current = null;
    if (x.get() !== 0) x.set(0);
    if (y.get() !== 0) y.set(0);
  };

  return (
    <span
      className={cn("inline-flex", className)}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <motion.span className="inline-flex" style={{ x: sx, y: sy }}>
        {children}
      </motion.span>
    </span>
  );
}
