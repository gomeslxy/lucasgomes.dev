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
  const boundsRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const maxTravel = Math.min(6, Math.max(0, strength * 24));
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING_MAGNETIC);
  const sy = useSpring(y, SPRING_MAGNETIC);

  useEffect(() => {
    const invalidate = () => {
      boundsRef.current = null;
      x.set(0);
      y.set(0);
    };
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    window.addEventListener("blur", invalidate);
    return () => {
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("blur", invalidate);
    };
  }, [x, y]);

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    boundsRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  };

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") return;
    let rect = boundsRef.current;
    if (!rect) {
      const measured = event.currentTarget.getBoundingClientRect();
      rect = { left: measured.left, top: measured.top, width: measured.width, height: measured.height };
      boundsRef.current = rect;
    }
    if (!rect.width || !rect.height) return;
    const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
    x.set(nx * maxTravel);
    y.set(ny * maxTravel);
  };

  const handlePointerLeave = () => {
    boundsRef.current = null;
    x.set(0);
    y.set(0);
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
