"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode, type PointerEvent } from "react";
import { cn, SPRING_CARD } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
};

export function TiltCard({ children, className, max = 8, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, SPRING_CARD);
  const spy = useSpring(py, SPRING_CARD);
  const rotateY = useTransform(spx, [0, 1], [-max, max]);
  const rotateX = useTransform(spy, [0, 1], [max, -max]);
  const glareX = useTransform(spx, [0, 1], ["-30%", "30%"]);
  const glareY = useTransform(spy, [0, 1], ["-30%", "30%"]);
  const glareOpacity = useMotionValue(0);
  const sGlare = useSpring(glareOpacity, { damping: 28, stiffness: 220 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    glareOpacity.set(1);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(0);
  };

  return (
    <div className={cn("[perspective:1000px]", className)}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
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
              className="absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgba(234,234,234,0.16),transparent_45%)]"
              style={{ x: glareX, y: glareY }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
