"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useIntro } from "@/components/providers/experience-provider";
import { EASE_EXPO, EASE_QUART } from "@/lib/utils";

const WORDS = ["Software", "IA", "Automação", "Hardware", "Gomes"];

export function Preloader() {
  const { markReady } = useIntro();
  const [visible, setVisible] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const progress = useMotionValue(0);
  const [countDisplay, setCountDisplay] = useState("000");
  const scaleX = useTransform(progress, [0, 100], [0, 1]);

  useEffect(() => {
    let timeoutId: number | null = null;

    const unsubscribe = progress.on("change", (latest) => {
      setCountDisplay(String(Math.round(latest)).padStart(3, "0"));
    });

    const controls = animate(progress, 100, {
      duration: 2.1,
      ease: EASE_QUART,
      onComplete: () => {
        timeoutId = window.setTimeout(() => {
          setVisible(false);
          markReady();
        }, 220);
      },
    });

    const intervalId = window.setInterval(() => {
      setWordIndex((i) => Math.min(i + 1, WORDS.length - 1));
    }, 420);

    return () => {
      unsubscribe();
      controls.stop();
      window.clearInterval(intervalId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [progress, markReady]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink text-bone gutter py-6"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: EASE_QUART }}
          aria-hidden="true"
        >
          <div className="flex items-start justify-between">
            <span className="label">Lucas Gomes — Portfolio</span>
            <span className="label text-right text-ash">
              Indaiatuba, SP
              <br />
              ©2026
            </span>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-[clamp(3rem,9vw,8rem)] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={WORDS[wordIndex]}
                  className="block font-serif text-[clamp(3rem,9vw,8rem)] italic leading-none"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5, ease: EASE_EXPO }}
                >
                  {WORDS[wordIndex]}
                  {wordIndex === WORDS.length - 1 && <span className="text-crimson">.</span>}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-6">
              <span className="label max-w-[14rem] text-ash">
                Carregando experiência
                <br />
                Full-Stack & AI Developer
              </span>
              <motion.span className="display text-[clamp(5rem,18vw,16rem)] text-bone tabular-nums">
                {countDisplay}
              </motion.span>
            </div>
            <div className="mt-4 h-px w-full bg-white/10">
              <motion.div className="h-px w-full origin-left bg-crimson" style={{ scaleX }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
