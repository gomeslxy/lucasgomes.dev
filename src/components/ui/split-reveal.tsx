"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef, type ElementType } from "react";
import { cn, EASE_EXPO } from "@/lib/utils";
import { useEnhancedMotion } from "@/lib/use-animation-policy";

type SplitRevealProps = {
  text: string;
  as?: ElementType;
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
  by?: "char" | "word";
  once?: boolean;
  trigger?: boolean;
};

const container: Variants = {
  hidden: {},
  visible: (custom: { delay: number; stagger: number }) => ({
    transition: { delayChildren: custom.delay, staggerChildren: custom.stagger },
  }),
};

const piece: Variants = {
  hidden: { y: "110%", rotate: 4 },
  visible: { y: "0%", rotate: 0, transition: { duration: 0.95, ease: EASE_EXPO } },
};

export function SplitReveal({
  text,
  as: Tag = "span",
  className,
  charClassName,
  delay = 0,
  stagger = 0.03,
  by = "char",
  once = true,
  trigger,
}: SplitRevealProps) {
  const enhancedMotion = useEnhancedMotion();
  if (!enhancedMotion) return <Tag className={className}>{text}</Tag>;

  return (
    <AnimatedSplitReveal
      text={text}
      as={Tag}
      className={className}
      charClassName={charClassName}
      delay={delay}
      stagger={stagger}
      by={by}
      once={once}
      trigger={trigger}
    />
  );
}

function AnimatedSplitReveal({
  text,
  as: Tag = "span",
  className,
  charClassName,
  delay = 0,
  stagger = 0.03,
  by = "char",
  once = true,
  trigger,
}: SplitRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -12% 0px" });
  const active = trigger ?? inView;
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        ref={ref}
        aria-hidden="true"
        className="inline"
        variants={container}
        custom={{ delay, stagger }}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
      >
        {words.map((word, wi) => (
          <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
            {by === "word" ? (
              <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
                <motion.span variants={piece} className={cn("inline-block origin-bottom-left", charClassName)}>
                  {word}
                </motion.span>
              </span>
            ) : (
              word.split("").map((char, ci) => (
                <span
                  key={`${char}-${ci}`}
                  className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom"
                >
                  <motion.span variants={piece} className={cn("inline-block origin-bottom-left", charClassName)}>
                    {char}
                  </motion.span>
                </span>
              ))
            )}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
