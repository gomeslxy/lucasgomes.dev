"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { SPRING_TACTILE, useMediaQuery } from "@/lib/utils";

type CursorState = { mode: "default" | "hover" | "label"; label: string };

export function Cursor() {
  const [mounted, setMounted] = useState(false);
  const finePointer = useMediaQuery("(pointer: fine) and (hover: hover)");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, SPRING_TACTILE);
  const ringY = useSpring(y, SPRING_TACTILE);
  const [state, setState] = useState<CursorState>({ mode: "default", label: "" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !finePointer) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setState({ mode: "label", label: labelled.dataset.cursor ?? "" });
        return;
      }
      const interactive = target?.closest("a, button, [role='button'], input, textarea");
      setState({ mode: interactive ? "hover" : "default", label: "" });
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [mounted, finePointer, x, y]);

  if (!mounted || !finePointer) return null;

  const ringScale = state.mode === "hover" ? 1.9 : state.mode === "label" ? 0 : 1;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone mix-blend-difference"
        style={{ x, y, willChange: "transform" }}
        animate={{ opacity: visible && state.mode !== "label" ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY, willChange: "transform" }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-bone/70 mix-blend-difference"
          animate={{ scale: ringScale, opacity: visible ? 1 : 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280, mass: 0.8 }}
        />
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY, willChange: "transform" }}>
        <AnimatePresence>
          {state.mode === "label" && visible && (
            <motion.div
              key="cursor-label"
              className="-translate-x-1/2 -translate-y-1/2 flex h-24 w-24 items-center justify-center rounded-full bg-crimson text-bone"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 300, mass: 0.7 }}
            >
              <span className="label text-[0.625rem]">{state.label}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
