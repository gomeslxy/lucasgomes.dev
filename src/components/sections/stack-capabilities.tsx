"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { capabilities, interests } from "@/lib/data";
import { cn, EASE_EXPO } from "@/lib/utils";

export function StackCapabilities() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="stack" className="relative bg-ink text-bone border-t border-white/10 py-[clamp(6rem,11vw,10rem)]">
      <div className="gutter">
        <SectionLabel index="03" title="Stack & Competências" aside="Engenharia de Ponta a Ponta" tone="dark" />

        <div className="mt-14 md:mt-20 grid gap-12 lg:grid-cols-12">
          {/* Header & Subtitle */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="display text-[clamp(2.6rem,7vw,6rem)] leading-[0.85]">
                Domínio <br />
                <span className="font-serif italic text-crimson text-[0.85em] normal-case tracking-normal">técnico</span> <br />
                completo.
              </h2>
              <p className="mt-8 text-base text-bone/70 leading-relaxed max-w-md">
                Não limito soluções a um framework. Da modelagem relacional e RLS com pgvector no banco até autenticação PKCE na borda, controle transacional de estoque e roteador Multi-LLM resiliente, meu foco é resolver o problema real com a engenharia mais cirúrgica.
              </p>
            </div>

            {/* Lifestyle / Personal interests */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <span className="label text-ash text-[0.62rem]">Além do Terminal / Lifestyle</span>
              <div className="mt-4 flex flex-wrap gap-2">
                {interests.map((item) => (
                  <span
                    key={item}
                    className="label rounded-full border border-white/15 px-3 py-1.5 text-[0.62rem] text-bone/70 hover:border-crimson hover:text-bone transition-colors select-none"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Stack Cards / Accessible Accordion */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {capabilities.map((cap, i) => {
              const isActive = activeTab === i;
              return (
                <motion.div
                  key={cap.index}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  aria-controls={`panel-${cap.index}`}
                  id={`tab-${cap.index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, ease: EASE_EXPO, delay: i * 0.07 }}
                  onClick={() => setActiveTab(i)}
                  onMouseEnter={() => setActiveTab(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveTab(i);
                    }
                  }}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden border p-6 md:p-8 transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-crimson",
                    isActive
                      ? "border-crimson bg-coal/90 shadow-[0_20px_50px_rgba(225,29,42,0.08)]"
                      : "border-white/10 bg-coal/30 hover:border-white/30"
                  )}
                >
                  {/* Left accent indicator */}
                  <div
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1 transition-all duration-500",
                      isActive ? "bg-crimson" : "bg-transparent group-hover:bg-white/20"
                    )}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className={cn("font-mono text-[0.7rem] font-bold tabular-nums tracking-widest", isActive ? "text-crimson" : "text-ash")}>
                        [{cap.index}]
                      </span>
                      <h3 className="display text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight">
                        {cap.title}
                      </h3>
                    </div>
                    <span className="font-mono text-[0.6rem] text-ash tracking-widest uppercase">
                      {isActive ? "ATIVO" : "+ EXPANDIR"}
                    </span>
                  </div>

                  <p className="mt-3.5 text-sm text-bone/70 leading-relaxed font-sans max-w-xl">
                    {cap.lead}
                  </p>

                  {/* Skills Grid with Hardware-Friendly Grid-Row Expansion */}
                  <div
                    id={`panel-${cap.index}`}
                    role="region"
                    aria-labelledby={`tab-${cap.index}`}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-expo overflow-hidden",
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="min-h-0 pt-6 mt-6 border-t border-white/10">
                      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {cap.items.map((tech) => (
                          <li
                            key={tech}
                            className="flex items-center gap-2 text-xs text-bone/90 font-mono tracking-tight"
                          >
                            <span className="h-1 w-1 rounded-full bg-crimson" />
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
