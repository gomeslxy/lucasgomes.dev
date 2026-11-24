"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
  Workflow,
  X,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AgendraPipeline } from "@/components/sections/agendra-pipeline";
import { BondsPipeline } from "@/components/sections/bonds-pipeline";
import { projects } from "@/lib/data";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import { cn, EASE_EXPO, SPRING_UI } from "@/lib/utils";

type ModalTab = "decisions" | "pipeline" | "specs";

const MODAL_TABS: ReadonlyArray<{ id: ModalTab; label: string; icon: typeof Cpu }> = [
  { id: "decisions", label: "01. Decisões", icon: Cpu },
  { id: "pipeline", label: "02. Fluxo", icon: Workflow },
  { id: "specs", label: "03. Stack e recursos", icon: Layers },
];

export function ProjectArchitectureModal({
  projectSlug,
  onClose,
}: {
  projectSlug: string;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ModalTab>("decisions");
  const dialogRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const idBase = useId();
  const project = projects.find((item) => item.slug === projectSlug);

  useDialogA11y({ open: !!project, dialogRef, onClose });

  if (!project) return null;

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % MODAL_TABS.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + MODAL_TABS.length) % MODAL_TABS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = MODAL_TABS.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    const nextTab = MODAL_TABS[nextIndex];
    if (!nextTab) return;
    setActiveTab(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  };

  const activeTabId = `${idBase}-tab-${activeTab}`;
  const activePanelId = `${idBase}-panel-${activeTab}`;

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="blueprint-dialog-title"
      className="fixed inset-0 z-[120] overflow-y-auto bg-black/88 px-3 py-6 sm:px-6 md:py-10"
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
        initial={{ opacity: 0, y: 26, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.985 }}
        transition={SPRING_UI}
        className="relative mx-auto my-[max(0px,3svh)] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-[#0d0d0f] text-bone shadow-[0_25px_80px_rgba(0,0,0,0.85)]"
      >
        {/* Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#121214] px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-crimson font-bold text-xs">[{project.index}]</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ash">
              ARQUITETURA · {project.domain}
            </span>
            <span className="hidden sm:inline-block rounded-full bg-crimson/20 border border-crimson/40 px-2.5 py-0.5 font-mono text-[9px] text-bone uppercase">
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
                className="press hidden sm:inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-white/15 px-3.5 py-1 font-mono text-[10px] uppercase text-bone/80 hover:border-crimson hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
              >
                {link.label}
                <ArrowUpRight size={12} className="text-crimson" aria-hidden="true" />
              </a>
            ))}

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar detalhes do projeto"
              className="press grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-bone/80 hover:border-crimson hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Modal Header */}
        <div className="border-b border-white/10 p-5 sm:p-8 bg-coal/50">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase text-ash tracking-widest mb-2">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.role}</span>
          </div>
          <h3 id="blueprint-dialog-title" className="display text-3xl sm:text-5xl tracking-tighter text-bone">
            {project.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-bone/80 font-sans">
            {project.technicalDescription}
          </p>

          {/* Accessible Navigation Tabs */}
          <LayoutGroup id={`blueprint-tabs-${idBase}`}>
            <div
              role="tablist"
              aria-label="Seções da arquitetura"
              className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/10"
            >
              {MODAL_TABS.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    id={`${idBase}-tab-${tab.id}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls={`${idBase}-panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={cn(
                      "press relative isolate inline-flex min-h-[44px] sm:min-h-[40px] items-center gap-2 rounded-lg border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson",
                      isActive
                        ? "border-crimson text-bone font-bold"
                        : "border-white/10 bg-white/4 text-bone/70 hover:border-white/25 hover:text-bone",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="blueprint-tab-pill"
                        transition={SPRING_UI}
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-[7px] bg-crimson"
                      />
                    )}
                    <Icon size={13} aria-hidden="true" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        {/* Modal Body / Tab Contents */}
        <div
          id={activePanelId}
          role="tabpanel"
          aria-labelledby={activeTabId}
          tabIndex={0}
          className="p-5 sm:p-8 max-h-[62svh] overflow-y-auto outline-none focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-crimson"
          data-lenis-prevent
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE_EXPO }}
            >
              {activeTab === "decisions" && (
                <div className="space-y-8">
                  <div className="rounded-xl border border-white/10 bg-white/2 p-5 sm:p-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-crimson font-bold flex items-center gap-2 mb-3">
                      <Terminal size={14} aria-hidden="true" />
                      Problema
                    </span>
                    <p className="text-sm sm:text-base leading-relaxed text-bone/85">
                      {project.challenge}
                    </p>
                    <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3.5 font-mono text-xs text-bone/75">
                      <span className="text-crimson font-bold">Trade-off: </span>
                      {project.consideration}
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash font-bold block mb-4">
                      Decisões de arquitetura
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
                            <p className="mt-2 text-xs leading-relaxed text-bone/75">
                              {dec.rationale}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/8 font-mono text-[10px] text-ash">
                            <span className="text-bone/60">Alternativa considerada: </span>
                            {dec.alternative}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pipeline" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase text-ash tracking-widest">
                    <span>Fluxo de execução</span>
                    <span className="text-crimson font-bold">ARQUITETURA</span>
                  </div>

                  {project.slug === "agendra" && <AgendraPipeline />}
                  {project.slug === "bonds" && <BondsPipeline />}
                </div>
              )}

              {activeTab === "specs" && (
                <div className="space-y-6">
                  {project.metrics && (
                    <div className="grid grid-cols-3 gap-3 border border-white/10 bg-white/2 p-4 rounded-xl">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="text-center sm:text-left">
                          <span className="display text-2xl sm:text-3xl text-crimson block">{m.value}</span>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-ash mt-1 block">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="rounded-xl border border-white/10 bg-white/2 p-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash font-bold block mb-3">
                      Principais recursos
                    </span>
                    <ul className="grid gap-2.5 sm:grid-cols-2">
                      {project.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-xs text-bone/85 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-crimson mt-1.5 shrink-0" aria-hidden="true" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash font-bold block mb-3">
                      Stack completa
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

                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="press inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-bone px-5 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                      >
                        {link.label}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modal Footer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#121214] px-5 py-3 sm:px-8 font-mono text-[10px] text-ash">
          <span>{project.shortTitle.toUpperCase()} · {project.period}</span>
          <span>PRESSIONE ESC PARA FECHAR</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
