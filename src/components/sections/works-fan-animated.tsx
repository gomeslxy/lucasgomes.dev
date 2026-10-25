"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { TiltCard } from "@/components/ui/tilt-card";
import { ProjectArtwork } from "@/components/ui/project-artwork";
import { projects, type Project } from "@/lib/data";
import { SPRING } from "@/lib/utils";

type FanCardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  hovered: number | null;
  onHover: (index: number | null) => void;
};

const FAN_START = 0.45;
const FAN_END = 0.82;

function FanCard({ project, index, total, progress, hovered, onHover }: FanCardProps) {
  const c = index - (total - 1) / 2;
  const enterStart = 0.02 + index * 0.07;
  const enterEnd = enterStart + 0.18;

  const y = useTransform(progress, [0, enterStart, enterEnd, 1], ["130vh", "130vh", "0vh", "0vh"]);
  const rotate = useTransform(
    progress,
    [0, enterStart, enterEnd, FAN_START, FAN_END, 1],
    [c * -20, c * -20, c * 1.5, c * 1.5, c * 8, c * 8],
  );
  const x = useTransform(progress, [FAN_START, FAN_END], ["0vw", `${c * 16}vw`]);

  const isHovered = hovered === index;
  const isDimmed = hovered !== null && !isHovered;

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        y,
        rotate,
        x,
        transformOrigin: "50% 230%",
        zIndex: isHovered ? 40 : index + 1,
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
        onPointerEnter={(e) => progress.get() > FAN_START + 0.1 && e.pointerType === "mouse" && onHover(index)}
        onPointerLeave={() => onHover(null)}
        onFocus={() => onHover(index)}
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
          <TiltCard className="h-full w-full pointer-events-auto" max={6}>
            <ProjectArtwork project={project} />
          </TiltCard>
        </motion.div>
      </a>
    </motion.div>
  );
}

export function AnimatedWorksFan() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [hovered, setHovered] = useState<number | null>(null);

  const bgX = useTransform(scrollYProgress, [0, 1], ["5%", "-40%"]);
  const titleY = useTransform(scrollYProgress, [0, 0.15], ["30%", "0%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  return (
    <section
      id="work"
      ref={ref}
      className="relative h-[360vh] w-full max-w-full overflow-x-clip bg-ink text-bone"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden">
        {/* Kinetic Background Watermark */}
        <motion.div
          aria-hidden="true"
          style={{ x: bgX }}
          className="display text-outline pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[24vw] leading-none select-none opacity-15"
        >
          Projetos — Projetos —
        </motion.div>

        {/* Section Header */}
        <div className="gutter relative z-10 pt-16 md:pt-24 shrink-0">
          <SectionLabel index="01" title="Projetos selecionados" aside="02 cases de engenharia · 2025—2026" />
          <motion.div style={{ y: titleY, opacity: titleOpacity }} className="mt-4 flex items-end justify-between gap-6">
            <h2 className="display text-[clamp(2.4rem,6.5vw,6.5rem)]">
              Código <span className="font-serif text-[0.8em] normal-case italic tracking-[-0.02em] text-crimson">em</span>{" "}
              prática
            </h2>
            <p className="hidden max-w-xs text-sm leading-relaxed text-bone/60 md:block">
              Projetos completos para explorar arquitetura, interfaces e integração de IA. Conheça o contexto, as decisões e o código.
            </p>
          </motion.div>
        </div>

        {/* Fan Deck Center Stage */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-auto min-h-0">
          <div
            className="relative"
            style={{
              height: "min(54svh, 31rem, 80vw)",
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
                hovered={hovered}
                onHover={setHovered}
              />
            ))}
          </div>
        </div>

        {/* Footer Indicators */}
        <div className="gutter relative z-10 flex items-center justify-between gap-6 pb-6 md:pb-12 shrink-0">
          <div className="relative h-5 overflow-hidden">
            <span className="label block text-ash text-[0.62rem]">Selecione um projeto para abrir o estudo de caso ↓</span>
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
