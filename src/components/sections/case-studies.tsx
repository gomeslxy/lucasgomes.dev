"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Cpu, Layers, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { AgendraPipeline } from "@/components/sections/agendra-pipeline";
import { BondsPipeline } from "@/components/sections/bonds-pipeline";
import { ImageReveal } from "@/components/ui/image-reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { RollText } from "@/components/ui/roll-text";
import { SplitReveal } from "@/components/ui/split-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { projects, type Project } from "@/lib/data";
import { cn, EASE_EXPO } from "@/lib/utils";

function CaseStudy({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <article
      id={`case-${project.slug}`}
      aria-labelledby={`case-title-${project.slug}`}
      className="gutter relative scroll-mt-20 border-t border-white/10 py-[clamp(5rem,9vw,8.5rem)]"
    >
      {/* Editorial Category & Meta Row */}
      <motion.div
        className="flex flex-wrap items-center gap-x-5 gap-y-2"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
      >
        <span className="font-mono text-crimson font-bold text-[0.68rem] tracking-widest">[{project.index}]</span>
        <span className="font-mono text-bone text-[0.62rem] tracking-widest uppercase">{project.kicker}</span>
        <span aria-hidden="true" className="hairline-dots hidden min-w-12 flex-1 md:block" />
        <span className="font-mono text-ash text-[0.62rem] tracking-widest uppercase">{project.period}</span>
        <span className="font-mono text-ash text-[0.62rem] tracking-widest uppercase">{project.role}</span>
      </motion.div>

      {/* Kinetic Monumental Short Title & Full Title Badge */}
      <div className="mt-6 flex flex-col gap-2">
        <h3
          id={`case-title-${project.slug}`}
          className="display text-[clamp(2.75rem,10.5vw,11.5rem)] leading-[0.82] break-words tracking-tighter"
        >
          <SplitReveal text={project.shortTitle} stagger={0.035} />
        </h3>
        <p className="font-mono text-xs md:text-sm text-bone/70 tracking-wide mt-1">
          {project.title}
        </p>
      </div>

      {/* Impact Statement / Tagline */}
      <motion.p
        className="mt-6 max-w-4xl font-serif text-[clamp(1.35rem,2.6vw,2.3rem)] italic leading-[1.12] text-bone/85"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.15 }}
      >
        "{project.tagline}"
      </motion.p>

      {/* Dual Column Layout */}
      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12 items-start">
        {/* Specification & Details */}
        <div className={cn("lg:col-span-6", flip ? "lg:col-start-7" : "lg:col-start-1")}>
          <div className="flex flex-col gap-8 lg:sticky lg:top-24">
            {/* Short Impact Description */}
            <div className="border-l-2 border-crimson pl-4 py-1">
              <span className="label text-ash text-[0.6rem] block uppercase mb-1">Resumo de Impacto</span>
              <p className="text-[1rem] leading-relaxed text-bone/90">{project.summary}</p>
            </div>

            {/* Detailed Technical Blueprint */}
            <div className="border border-white/10 bg-coal/70 p-5 md:p-6 rounded-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="label text-[0.62rem] text-crimson flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5" />
                  ESPECIFICAÇÃO_TÉCNICA_ARQUITETURA
                </span>
                <span className="label text-[0.58rem] text-smoke font-mono">RELEASES_PROD</span>
              </div>
              <p className="text-xs md:text-sm leading-relaxed text-bone/75 font-sans">
                {project.technicalDescription}
              </p>
            </div>

            {/* Engineering Highlights / In-depth Features */}
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Cpu className="h-3.5 w-3.5 text-crimson" />
                <span className="label text-ash text-[0.62rem]">Destaques de Engenharia & Features</span>
              </div>
              <div className="mt-4 space-y-4">
                {project.highlights.map((highlight, i) => (
                  <motion.div
                    key={highlight.title}
                    className="group border border-white/10 bg-coal/40 p-4 hover:border-white/25 transition-all"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ duration: 0.6, ease: EASE_EXPO, delay: i * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-crimson text-xs font-bold pt-0.5">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold tracking-tight text-bone group-hover:text-crimson transition-colors">
                          {highlight.title}
                        </h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-bone/70">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stack Tags */}
            <div>
              <div className="flex items-center gap-2 pb-2">
                <Layers className="h-3.5 w-3.5 text-crimson" />
                <span className="label text-ash text-[0.62rem]">Tech Stack (Badges)</span>
              </div>
              <ul className="mt-2 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="label rounded-full border border-white/15 bg-graphite/60 px-3 py-1.5 text-[0.62rem] text-bone/85 hover:border-crimson hover:text-bone transition-colors"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Links */}
            {project.links.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {project.links.map((link, i) => (
                  <Magnetic key={link.href} strength={0.25}>
                    <a
                      id={`case-link-${project.slug}-${i}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex min-h-11 items-center gap-2.5 rounded-full px-5 text-xs font-mono uppercase tracking-wider transition-all",
                        i === 0
                          ? "bg-bone text-ink hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.15)] font-semibold"
                          : "border border-white/25 text-bone hover:border-crimson hover:text-crimson",
                      )}
                    >
                      <RollText text={link.label} />
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:rotate-45" />
                    </a>
                  </Magnetic>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Media & Key Metrics */}
        <div className={cn("lg:col-span-6", flip ? "lg:col-start-1" : "lg:col-start-7")}>
          <TiltCard max={3.5}>
            <ImageReveal
              src={project.image}
              alt={project.imageAlt}
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 90vw, 100vw"
              quality={88}
              className="aspect-[4/5] w-full md:aspect-[5/6] border border-white/10"
            />
          </TiltCard>

          {project.metrics && (
            <dl className="mt-6 grid grid-cols-3 border-t border-white/10">
              {project.metrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  className={cn("flex flex-col gap-1.5 py-4 pr-3", i > 0 && "border-l border-white/10 pl-4 md:pl-6")}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: EASE_EXPO, delay: i * 0.08 }}
                >
                  <dd className="display text-[clamp(2rem,3.8vw,3.6rem)] text-crimson leading-none">{metric.value}</dd>
                  <dt className="label text-[0.6rem] text-ash mt-1">{metric.label}</dt>
                </motion.div>
              ))}
            </dl>
          )}

          {/* Quick Technical Highlights Checklist */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <span className="label text-ash text-[0.62rem] block mb-3">Checklist de Funcionalidades & Arquitetura</span>
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {project.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  className="group relative flex gap-3 py-3"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.6, ease: EASE_EXPO, delay: i * 0.04 }}
                >
                  <span className="label pt-0.5 text-crimson font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs leading-snug text-bone/80 group-hover:text-bone transition-colors">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Dedicated Interactive Engineering Architecture Diagrams */}
      {project.slug === "agendra" && <AgendraPipeline />}
      {project.slug === "bonds" && <BondsPipeline />}
    </article>
  );
}

export function CaseStudies() {
  return (
    <section aria-label="Estudos de caso" className="relative bg-ink text-bone">
      {projects.map((project, i) => (
        <CaseStudy key={project.slug} project={project} flip={i % 2 === 1} />
      ))}
    </section>
  );
}
