"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useLenis } from "lenis/react";
import { useRef } from "react";
import { useIntro } from "@/components/providers/experience-provider";
import { Magnetic } from "@/components/ui/magnetic";
import { SplitReveal } from "@/components/ui/split-reveal";
import { profile } from "@/lib/data";
import { useFitText } from "@/lib/use-fit-text";
import { EASE_EXPO } from "@/lib/utils";

const WORDMARK = "GOMES".split("");

type HeroLetterProps = {
  char: string;
  index: number;
  progress: MotionValue<number>;
  ready: boolean;
};

function HeroLetter({ char, index, progress, ready }: HeroLetterProps) {
  const direction = index % 2 === 0 ? -1 : 1;
  const center = index - (WORDMARK.length - 1) / 2;
  const y = useTransform(progress, [0, 1], ["0%", `${direction * (10 + Math.abs(center) * 8)}%`]);
  const rotate = useTransform(progress, [0, 1], [0, center * 2.5]);

  return (
    <motion.span className="relative inline-block" style={{ y, rotate }}>
      <span className="group relative inline-block overflow-hidden py-[0.02em]">
        <motion.span
          className="relative inline-block"
          initial={{ y: "108%" }}
          animate={{ y: ready ? "0%" : "108%" }}
          transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.15 + index * 0.06 }}
        >
          <span className="block transition-transform duration-700 ease-expo group-hover:-translate-y-full">
            {char}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-full block text-crimson transition-transform duration-700 ease-expo group-hover:-translate-y-full select-none"
          >
            {char}
          </span>
        </motion.span>
      </span>
    </motion.span>
  );
}

// Cleaned up, streamlined metadata (1 concise line per column, zero clutter)
const META_ITEMS = [
  { label: "INDEX_LOCAL", value: "Indaiatuba, SP — Brasil" },
  { label: "DOMÍNIO_TÉCNICO", value: "SaaS Multi-Tenant · IA · Full-Stack" },
  { label: "STATUS_DISPONÍVEL", value: "Disponível para Projetos", live: true },
];

export function Hero() {
  const { ready } = useIntro();
  const lenis = useLenis();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const metaOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const metaY = useTransform(scrollYProgress, [0, 0.55], ["0%", "-20%"]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const { containerRef, textRef } = useFitText<HTMLDivElement, HTMLSpanElement>();

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-screen flex-col justify-between overflow-x-clip bg-ink text-bone pt-28 pb-10 md:pt-36 md:pb-16"
    >
      <div aria-hidden="true" className="grid-guides pointer-events-none absolute inset-0 opacity-40" />
      <h1 className="sr-only">Lucas Gomes — Full-Stack & AI Developer em Indaiatuba, SP</h1>

      {/* Top and Narrative Content */}
      <motion.div
        style={{ opacity: metaOpacity, y: metaY }}
        className="gutter relative z-10 flex flex-col justify-between gap-12 md:gap-16"
      >
        {/* Streamlined 1-Line Metadata Bar with High Contrast Mono */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-5">
          {META_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.35 + i * 0.08 }}
              className="flex flex-col gap-1"
            >
              <span className="font-mono text-[0.62rem] text-ash tracking-widest uppercase">[{item.label}]</span>
              <span className="flex items-center gap-2 text-xs md:text-sm font-medium tracking-tight text-bone">
                {item.live && (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inset-0 animate-pulse-dot rounded-full bg-crimson" />
                    <span className="relative h-2 w-2 rounded-full bg-crimson" />
                  </span>
                )}
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Breathable Headline Statement & Summary Copy */}
        <div className="grid items-end gap-8 pt-4 md:pt-8 md:grid-cols-12">
          <p className="font-serif text-[clamp(2.1rem,4.8vw,5rem)] leading-[0.98] tracking-[-0.02em] md:col-span-8">
            <SplitReveal
              by="word"
              trigger={ready}
              delay={0.3}
              stagger={0.04}
              text="Software que vende, atende e escala operações —"
            />{" "}
            <SplitReveal
              by="word"
              trigger={ready}
              delay={0.7}
              charClassName="italic text-crimson"
              text="sozinho."
            />
          </p>

          <motion.div
            className="flex flex-col gap-4 md:col-span-4 md:col-start-9"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.8 }}
          >
            <p className="max-w-sm text-sm md:text-base leading-relaxed text-bone/70">
              16 anos. Fundador do <span className="text-bone font-medium">Agendra</span>, SaaS multi-tenant de automação
              comercial com IA. Do banco de dados à borda: código, arquitetura e alta performance.
            </p>

            {/* Clean, Non-Overlapping Interactive Magnetic Scroll Affordance */}
            <div className="pt-2">
              <Magnetic strength={0.3}>
                <button
                  type="button"
                  onClick={() => lenis?.scrollTo("#manifesto", { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) })}
                  className="group flex min-h-[44px] items-center gap-3 text-left outline-none focus-visible:ring-1 focus-visible:ring-crimson rounded-sm"
                  aria-label="Rolar para manifesto"
                >
                  <span className="relative block h-7 w-px overflow-hidden bg-white/20">
                    <motion.span
                      className="absolute inset-x-0 top-0 h-1/2 bg-crimson"
                      animate={{ y: ["-100%", "200%"] }}
                      transition={{ duration: 1.8, ease: EASE_EXPO, repeat: Infinity, repeatDelay: 0.3 }}
                    />
                  </span>
                  <span className="font-mono text-ash group-hover:text-bone text-[0.62rem] tracking-widest uppercase transition-colors">
                    ROLE PARA EXPLORAR ↓
                  </span>
                </button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 
        CLEAN, UNCLUTTERED MONUMENTAL SIGNATURE
        - Fluid clamp() ensures precision scaling across mobile (320px) to ultra-wide (2560px)
        - tracking-tighter adds crisp editorial tension
      */}
      <motion.div
        style={{ y: wordY }}
        className="gutter relative z-0 mt-14 md:mt-20 pt-6 border-t border-white/10 select-none"
      >
        <div ref={containerRef} className="flex flex-col items-start w-full">
          {/* Pre-title "Lucas" in natural flow with zero overlap */}
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.5 }}
            className="font-serif italic text-crimson text-[clamp(2.4rem,5.5vw,5.5rem)] leading-none mb-1 pl-1"
          >
            Lucas
          </motion.span>

          {/* Monumental "GOMES" wordmark with fluid clamp() and tracking-tighter */}
          <span
            ref={textRef}
            aria-hidden="true"
            className="display block whitespace-nowrap leading-[0.78] text-bone tracking-tighter text-[clamp(4.8rem,23.5vw,22rem)]"
          >
            {WORDMARK.map((char, i) => (
              <HeroLetter key={`${char}-${i}`} char={char} index={i} progress={scrollYProgress} ready={ready} />
            ))}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
