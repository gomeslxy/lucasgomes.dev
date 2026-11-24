"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { TiltCard } from "@/components/ui/tilt-card";
import { projects, type Project } from "@/lib/data";
import { EASE_EXPO, SPRING, useMediaQuery } from "@/lib/utils";

type FanCardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  compact: boolean;
  hovered: number | null;
  interactive: boolean;
  onHover: (index: number | null) => void;
  onOpen: (slug: string) => void;
};

const FAN_START = 0.45;
const FAN_END = 0.82;

function FanCard({ project, index, total, progress, compact, hovered, interactive, onHover, onOpen }: FanCardProps) {
  const c = index - (total - 1) / 2;
  const enterStart = 0.02 + index * 0.07;
  const enterEnd = enterStart + 0.18;
  const spreadRot = compact ? 4.5 : 8;
  const spreadX = compact ? 0 : 16;

  const y = useTransform(progress, [0, enterStart, enterEnd, 1], ["130vh", "130vh", "0vh", "0vh"]);
  const rotate = useTransform(
    progress,
    [0, enterStart, enterEnd, FAN_START, FAN_END, 1],
    [c * -20, c * -20, c * 1.5, c * 1.5, c * spreadRot, c * spreadRot],
  );
  const x = useTransform(progress, [FAN_START, FAN_END], ["0vw", `${c * spreadX}vw`]);

  const isHovered = hovered === index;
  const isDimmed = hovered !== null && !isHovered;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpen(project.slug);
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        y,
        rotate,
        x,
        transformOrigin: "50% 230%",
        zIndex: isHovered ? 40 : index + 1,
        willChange: "transform",
      }}
    >
      {/* 
        HIT BOUNDARY SEPARATION:
        The trigger element (a) stays strictly stationary at the layout position,
        preventing hover flicker when the card lifts or tilts.
      */}
      <a
        id={`fan-card-${project.slug}`}
        href={`#case-${project.slug}`}
        onClick={handleClick}
        onPointerEnter={(e) => interactive && e.pointerType === "mouse" && onHover(index)}
        onPointerLeave={() => onHover(null)}
        onFocus={() => interactive && onHover(index)}
        onBlur={() => onHover(null)}
        data-cursor="Abrir case"
        aria-label={`Abrir estudo de caso: ${project.title}`}
        className="relative block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded-sm"
      >
        {/* Visual layer that animates smoothly without moving the hit boundary */}
        <motion.div
          className="h-full w-full pointer-events-none"
          animate={{
            y: isHovered ? -38 : 0,
            scale: isHovered ? 1.035 : 1,
            opacity: isDimmed ? 0.38 : 1,
          }}
          transition={SPRING}
        >
          <TiltCard className="h-full w-full pointer-events-auto" max={compact ? 0 : 6}>
            <div className="relative h-full w-full overflow-hidden border border-white/10 bg-coal shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] select-none">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(min-width: 1280px) 24rem, (min-width: 768px) 30vw, 75vw"
                quality={85}
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-ink/10" />

              {/* Card Header with Refined Mono Metadata */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-5">
                <span className="font-mono text-[0.62rem] font-bold rounded-full bg-ink/75 px-2.5 py-1.5 backdrop-blur-sm border border-white/10 tracking-widest text-bone">
                  [{project.index}]
                </span>
                <span className="font-mono max-w-[60%] text-right text-[0.58rem] text-bone/85 tracking-widest uppercase truncate">
                  {project.category.split("·")[0]?.trim() || project.category}
                </span>
              </div>

              {/* Card Footer */}
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <span className="font-mono text-[0.62rem] text-crimson font-semibold tracking-widest uppercase">
                  {project.kicker}
                </span>
                <h3 className="display mt-1.5 text-[clamp(1.9rem,3.2vw,3rem)] text-bone tracking-tighter leading-[0.9]">
                  {project.shortTitle}
                </h3>
                <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3">
                  <span className="font-mono text-[0.6rem] text-bone/60 tracking-wider uppercase">{project.period}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-bone">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </a>
    </motion.div>
  );
}

export function WorksFan() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const compact = useMediaQuery("(max-width: 767px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [fanned, setFanned] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v > FAN_START + 0.1;
    setFanned((prev) => (prev === next ? prev : next));
    if (!next) setHovered(null);
  });

  const bgX = useTransform(scrollYProgress, [0, 1], ["5%", "-40%"]);
  const titleY = useTransform(scrollYProgress, [0, 0.15], ["30%", "0%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  const open = (slug: string) => {
    lenis?.scrollTo(`#case-${slug}`, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  };

  return (
    <section
      id="work"
      ref={ref}
      className={
        compact
          ? "relative h-[280vh] w-full max-w-full overflow-x-clip bg-ink text-bone"
          : "relative h-[360vh] w-full max-w-full overflow-x-clip bg-ink text-bone"
      }
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden">
        {/* Kinetic Background Watermark */}
        <motion.div
          aria-hidden="true"
          style={{ x: bgX }}
          className="display text-outline pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[24vw] leading-none select-none opacity-15"
        >
          Selected Works — Selected Works —
        </motion.div>

        {/* Section Header */}
        <div className="gutter relative z-10 pt-16 md:pt-24 shrink-0">
          <SectionLabel index="02" title="Trabalhos selecionados" aside="02 projetos de alta escala · 2025—2026" />
          <motion.div style={{ y: titleY, opacity: titleOpacity }} className="mt-4 flex items-end justify-between gap-6">
            <h2 className="display text-[clamp(2.4rem,6.5vw,6.5rem)]">
              Obra <span className="font-serif text-[0.8em] normal-case italic tracking-[-0.02em] text-crimson">em</span>{" "}
              produção
            </h2>
            <p className="hidden max-w-xs text-sm leading-relaxed text-bone/60 md:block">
              Engenharia full-stack e automação comercial — do SaaS multi-tenant com IA ao e-commerce streetwear com sincronização em tempo real.
            </p>
          </motion.div>
        </div>

        {/* Fan Deck Center Stage */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-auto min-h-0">
          <div
            className="relative"
            style={{
              height: compact ? "min(48svh, 25rem)" : "min(54svh, 31rem, 80vw)",
              aspectRatio: "3 / 4",
            }}
          >
            {projects.map((project, i) => (
              <FanCard
                key={project.slug}
                project={project}
                index={i}
                total={projects.length}
                progress={scrollYProgress}
                compact={compact}
                hovered={hovered}
                interactive={fanned}
                onHover={setHovered}
                onOpen={open}
              />
            ))}
          </div>
        </div>

        {/* Footer Indicators */}
        <div className="gutter relative z-10 flex items-center justify-between gap-6 pb-6 md:pb-12 shrink-0">
          <div className="relative h-5 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={fanned ? "fan" : "deal"}
                className="label block text-ash text-[0.62rem]"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.5, ease: EASE_EXPO }}
              >
                {fanned ? "Clique em um card para abrir o estudo de caso detalhado" : "Role para abrir o leque de projetos ↓"}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-4">
            <span className="label tabular-nums text-ash">0{projects.length}</span>
            <span className="relative block h-px w-20 bg-white/15 md:w-36">
              <motion.span className="absolute inset-0 origin-left bg-crimson" style={{ scaleX: scrollYProgress }} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
