"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  Layers,
  ShieldCheck,
  Terminal,
  Workflow,
  X,
} from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { projects, type Project } from "@/lib/data";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { cn, EASE_EXPO, SPRING_UI } from "@/lib/utils";
import { AgendraPipeline } from "@/components/sections/agendra-pipeline";
import { BondsPipeline } from "@/components/sections/bonds-pipeline";

export function WorksShowcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="work" aria-labelledby="work-title" className="relative border-t border-white/10 bg-ink text-bone py-20 md:py-28">
      <div className="gutter relative z-10 mx-auto max-w-[1600px]">
        {/* Section Header: Clean, purposeful, zero repetitive filler */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 md:pb-16 border-b border-white/10">
          <div>
            <SectionLabel index="01" title="Projetos Selecionados" aside="Engenharia de Ponta a Ponta" tone="dark" />
            <h2 id="work-title" className="display mt-6 text-[clamp(2.8rem,7vw,7rem)] leading-[0.88] tracking-tighter">
              <Reveal as="span" pattern="heading">
                Engenharia <span className="font-serif italic font-normal text-crimson text-[0.85em]">em</span> prática.
              </Reveal>
            </h2>
          </div>
          <Reveal pattern="body" delay={0.12} className="max-w-md">
            <p className="font-mono text-xs md:text-sm leading-relaxed text-bone/60">
              Sistemas reais, da interface aos dados. Explore cada projeto para conhecer os desafios, as decisões e a arquitetura por trás da experiência.
            </p>
          </Reveal>
        </div>

        {/* Project Cards: Ultra-clean, scan-friendly, non-repetitive */}
        <ul className="mt-12 space-y-10 md:space-y-16">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              onOpenDetails={() => setSelectedProject(project)}
            />
          ))}
        </ul>
      </div>

      {/* On-Demand Architecture Deep Dive Modal / Drawer */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedProject && (
              <ProjectArchitectureModal
                key={selectedProject.slug}
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}

/**
 * Surface-level Project Card:
 * Scannable in 5 seconds.
 * Single punchline, 4 essential tech pills, high-contrast metric badge, and clear trigger.
 */
function ProjectCard({
  project,
  index,
  onOpenDetails,
}: {
  project: Project;
  index: number;
  onOpenDetails: () => void;
}) {
  const demoLink = project.links.find((l) => l.href.includes("site") || l.href.includes("vercel") || l.href.includes("http"));

  return (
    <li id={`case-${project.slug}`} className="relative">
      <article className="group relative isolate overflow-hidden rounded-[20px] border border-white/15 bg-[#0d0d0f] hover:border-white/30 focus-within:border-crimson/50">
        <div className="grid lg:grid-cols-[1.08fr_1fr] items-stretch">
          {/* Text Specification Column */}
          <div className={cn("relative flex flex-col justify-between p-6 sm:p-9 xl:p-12", index % 2 ? "lg:order-2" : "")}>
            <div>
              {/* Metadata row */}
              <Reveal pattern="meta" className="font-mono text-[9px] uppercase tracking-[0.16em]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2.5 text-bone/60">
                  <span className="font-bold text-crimson">[{project.index}]</span>
                  <span>{project.period}</span>
                  <span aria-hidden="true" className="h-px w-6 bg-white/15" />
                  <span className="text-bone/85">{project.statusBadge}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-bone/70">
                  <Code2 size={12} className="text-crimson" aria-hidden="true" />
                  {project.category}
                </span>
                </div>
              </Reveal>

              {/* Title */}
              <h3 className="display mt-5 text-[clamp(2.4rem,4.5vw,4.8rem)] leading-[0.92] tracking-tighter">
                <Reveal as="span" pattern="heading" delay={0.05}>
                  <button
                    type="button"
                    onClick={onOpenDetails}
                    className="block text-left outline-none hover:text-crimson focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson"
                  >
                    {project.shortTitle}
                  </button>
                </Reveal>
              </h3>

              {/* Punchline: 1 clear impact sentence */}
              <Reveal pattern="body" delay={0.1} className="mt-4">
                <p className="text-sm sm:text-base leading-relaxed text-bone/85 font-sans">{project.punchline}</p>
              </Reveal>

              {/* Architectural metric tag */}
              <Reveal pattern="depth" delay={0.16} className="mt-5">
                <div className="inline-flex items-center gap-2 rounded-md border border-crimson/30 bg-crimson/10 px-3 py-1.5 font-mono text-[10px] text-bone">
                  <ShieldCheck size={13} className="text-crimson shrink-0" aria-hidden="true" />
                  <span>{project.keyMetricBadge}</span>
                </div>
              </Reveal>

              {/* Essential Stack: Exactly 4 tags */}
              <div className="mt-6">
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-ash block mb-2">Stack Essencial</span>
                <ul className="flex flex-wrap gap-1.5" aria-label={`Stack essencial de ${project.shortTitle}`}>
                  {project.essentialStack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-white/10 bg-white/4 px-2.5 py-1 font-mono text-[10px] text-bone/75"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interaction triggers: Open details vs Direct Demo */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={onOpenDetails}
                className="inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-lg bg-bone px-5 text-xs font-mono font-bold uppercase tracking-wider text-ink hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
              >
                <Terminal size={14} className="text-crimson" aria-hidden="true" />
                Ver Detalhes Técnicos & Case
              </button>

              {demoLink && (
                <a
                  href={demoLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-white/15 px-4 text-xs font-mono text-bone/70 hover:border-crimson/50 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                >
                  <ExternalLink size={13} aria-hidden="true" />
                  Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Media preview column: Clickable to expand */}
          <Reveal pattern="depth" delay={0.08} innerClassName="h-full" className={cn("relative m-3 sm:m-4 min-h-[300px] lg:min-h-[420px]", index % 2 ? "lg:order-1" : "")}>
          <div
            onClick={onOpenDetails}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenDetails();
              }
            }}
            aria-label={`Abrir especificações técnicas de ${project.shortTitle}`}
            className={cn(
              "group/media relative min-h-[300px] lg:min-h-[420px] h-full cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#141416] hover:border-crimson/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson",
            )}
          >
            {/* Terminal / Browser Chrome Header */}
            <div className="absolute inset-x-0 top-0 z-10 flex h-9 items-center gap-1.5 border-b border-white/10 bg-[#121214]/95 px-3.5">
              <span className="h-2 w-2 rounded-full bg-crimson/80" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">
                system://{project.slug}.preview
              </span>
            </div>

            {/* High-res Image */}
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(max-width: 1023px) 92vw, 48vw"
              className="object-cover object-top pt-9 motion-safe:transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/media:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

            {/* Quick hover indicator at bottom */}
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 text-white">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/70">
                Clique para explorar arquitetura
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 bg-black/60 motion-safe:transition-transform motion-safe:group-hover/media:scale-110 group-hover/media:border-crimson">
                <ArrowUpRight size={18} className="text-white group-hover/media:text-crimson" aria-hidden="true" />
              </span>
            </div>
          </div>
          </Reveal>
        </div>
      </article>
    </li>
  );
}

/**
 * On-Demand Architecture Deep Dive Modal:
 * Reveals technical bottlenecks, design trade-offs, architecture decisions,
 * technical highlights and the interactive pipeline visual.
 */
function ProjectArchitectureModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"decisions" | "highlights" | "pipeline" | "specs">("decisions");
  const modalRef = useRef<HTMLDivElement>(null);
  useScrollLock(true);

  // Focus trap & Escape key listener
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousInert = new Map<HTMLElement, boolean>();
    const dialog = modalRef.current?.parentElement;
    if (dialog) {
      for (const sibling of document.body.children) {
        if (!(sibling instanceof HTMLElement) || sibling === dialog || /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) continue;
        previousInert.set(sibling, sibling.inert);
        sibling.inert = true;
      }
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const elements = modalRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
      const first = elements?.[0];
      const last = elements?.[elements.length - 1];
      if (!first || !last) return;
      if (!modalRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    modalRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    window.addEventListener("keydown", keydown);

    return () => {
      window.removeEventListener("keydown", keydown);
      previousInert.forEach((value, element) => { element.inert = value; });
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blueprint-dialog-title"
      className="fixed inset-0 z-[120] overflow-y-auto bg-black/85 px-3 py-6 sm:px-6 md:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: EASE_EXPO }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-lenis-prevent
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={SPRING_UI}
        className="relative mx-auto my-[max(0px,3vh)] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-[#0d0d0f] text-bone shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
      >
        {/* Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#121214] px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-crimson font-bold text-xs">[{project.index}]</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ash">
              blueprint://{project.slug}.architecture/spec
            </span>
            <span className="hidden sm:inline-block rounded-full bg-crimson/20 border border-crimson/40 px-2 py-0.5 font-mono text-[8px] text-bone uppercase">
              {project.statusBadge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-white/15 px-3 py-1 font-mono text-[10px] uppercase text-bone/75 hover:border-crimson hover:text-bone"
              >
                {link.label}
                <ArrowUpRight size={12} className="text-crimson" aria-hidden="true" />
              </a>
            ))}

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar blueprint de arquitetura"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-bone/70 hover:border-crimson hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Modal Header */}
        <div className="border-b border-white/10 p-5 sm:p-8 bg-coal/50">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase text-ash tracking-widest mb-2">
            <span>{project.category}</span>
            <span>·</span>
            <span>{project.role}</span>
          </div>
          <h3 id="blueprint-dialog-title" className="display text-3xl sm:text-5xl tracking-tighter text-bone">
            {project.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-bone/75 font-sans">
            {project.technicalDescription}
          </p>

          {/* Navigation Tabs */}
          <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/10">
            {[
              { id: "decisions", label: "01. Desafio & Decisões", icon: Cpu },
              { id: "highlights", label: "02. Destaques Técnicos", icon: ShieldCheck },
              { id: "pipeline", label: "03. Pipeline Interativo", icon: Workflow },
              { id: "specs", label: "04. Stack & Acessos", icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex min-h-[38px] items-center gap-2 rounded-lg border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider",
                    isActive
                      ? "border-crimson bg-crimson text-bone font-bold shadow-sm"
                      : "border-white/10 bg-white/4 text-bone/60 hover:border-white/25 hover:text-bone",
                  )}
                >
                  <Icon size={13} aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="p-5 sm:p-8 max-h-[62vh] overflow-y-auto space-y-8" data-lenis-prevent>
          {/* TAB 1: DESAFIO & DECISÕES DE ARQUITETURA */}
          {activeTab === "decisions" && (
            <div className="space-y-8">
              {/* O Gargalo / Desafio */}
              <div className="rounded-xl border border-white/10 bg-white/2 p-5 sm:p-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-crimson font-bold flex items-center gap-2 mb-2">
                  <Terminal size={14} aria-hidden="true" />
                  O Gargalo Técnico
                </span>
                <h4 className="text-base sm:text-lg font-semibold text-bone mb-2">
                  Qual problema motivou a arquitetura?
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-bone/75">
                  {project.challenge}
                </p>
                <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3.5 font-mono text-xs text-bone/70">
                  <span className="text-crimson font-bold">Compromisso de Engenharia: </span>
                  {project.consideration}
                </div>
              </div>

              {/* Decisões de Arquitetura (Trade-offs) */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash font-bold block mb-4">
                  Decisões de Arquitetura & Escolhas de Stack
                </span>

                <div className="grid gap-4 sm:grid-cols-2">
                  {project.architectureDecisions.map((dec, i) => (
                    <div
                      key={dec.choice}
                      className="rounded-xl border border-white/10 bg-white/2 p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px]">
                          <span className="text-crimson font-bold">DECISÃO [0{i + 1}]</span>
                          <span className="text-ash uppercase">Trade-off</span>
                        </div>
                        <h5 className="text-sm font-semibold text-bone flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-crimson shrink-0 mt-0.5" aria-hidden="true" />
                          {dec.choice}
                        </h5>
                        <p className="mt-2 text-xs leading-relaxed text-bone/70">
                          {dec.rationale}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/8 font-mono text-[10px] text-ash">
                        <span className="text-bone/50">Alternativa Descartada: </span>
                        {dec.alternative}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DESTAQUES TÉCNICOS & REGRAS */}
          {activeTab === "highlights" && (
            <div className="space-y-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash font-bold block">
                Implementação Profunda de Engenharia
              </span>

              <div className="grid gap-4 sm:grid-cols-2">
                {project.highlights.map((highlight, index) => (
                  <div
                    key={highlight.title}
                    className="rounded-xl border border-white/10 bg-white/2 p-5 hover:border-white/20"
                  >
                    <div className="flex items-center gap-2 font-mono text-[10px] text-crimson font-bold mb-2">
                      <span>ESPECIFICAÇÃO [0{index + 1}]</span>
                    </div>
                    <h5 className="text-sm font-semibold text-bone">{highlight.title}</h5>
                    <p className="mt-2 text-xs leading-relaxed text-bone/70">{highlight.description}</p>
                  </div>
                ))}
              </div>

              {/* Checklist de recursos */}
              <div className="mt-6 rounded-xl border border-white/10 bg-white/2 p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash font-bold block mb-3">
                  Checklist de Engenharia & Confiabilidade
                </span>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {project.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs text-bone/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-crimson mt-1.5 shrink-0" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: PIPELINE VISUAL / BLUEPRINT INTERATIVO */}
          {activeTab === "pipeline" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase text-ash tracking-widest">
                <span>Diagrama de Fluxo & Nós de Execução</span>
                <span className="text-crimson font-bold">INTERACTIVE_MAP</span>
              </div>

              {project.slug === "agendra" && <AgendraPipeline />}
              {project.slug === "bonds" && <BondsPipeline />}
            </div>
          )}

          {/* TAB 4: STACK COMPLETA & LINKS */}
          {activeTab === "specs" && (
            <div className="space-y-6">
              {/* Métricas do projeto */}
              {project.metrics && (
                <div className="grid grid-cols-3 gap-3 border border-white/10 bg-white/2 p-4 rounded-xl">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="text-center sm:text-left">
                      <span className="display text-2xl sm:text-3xl text-crimson block">{m.value}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-ash mt-1 block">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stack Completa */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash font-bold block mb-3">
                  Inventário Completo de Tecnologias
                </span>
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs text-bone/85"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Links de acesso */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-bone px-5 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                  >
                    {link.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#121214] px-5 py-3 sm:px-8 font-mono text-[9px] text-ash">
          <span>SPEC_VERSION // 2026.4</span>
          <span>PRESSIONE ESC PARA FECHAR</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
