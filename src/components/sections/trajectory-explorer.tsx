"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Award, FileText } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { certificates, education, experience, type CertificateItem } from "@/lib/data";
import { cn, SPRING_UI } from "@/lib/utils";

const CertificateLightbox = dynamic(
  () => import("@/components/sections/certificate-lightbox").then((mod) => mod.CertificateLightbox),
  { ssr: false },
);

type TrajectoryTab = "certificates" | "experience" | "all";

const totalRecords = experience.length + education.length;

export function TrajectoryExplorer() {
  const [tab, setTab] = useState<TrajectoryTab>("experience");
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openCert = useCallback((cert: CertificateItem) => {
    setHasOpened(true);
    setSelectedCert(cert);
  }, []);

  const closeCert = useCallback(() => {
    setSelectedCert(null);
  }, []);

  const showCert = tab === "all" || tab === "certificates";
  const showExp = tab === "all" || tab === "experience";

  const tabs: ReadonlyArray<{ id: TrajectoryTab; label: string; activeTone: "crimson" | "ink" }> = [
    {
      id: "certificates",
      label: `★ CERTIFICADOS [${certificates.length.toString().padStart(2, "0")}]`,
      activeTone: "crimson",
    },
    {
      id: "experience",
      label: `EXPERIÊNCIA & FORMAÇÃO [${totalRecords.toString().padStart(2, "0")}]`,
      activeTone: "ink",
    },
    {
      id: "all",
      label: "VISÃO COMPLETA",
      activeTone: "ink",
    },
  ];

  return (
    <>
      {/* Section Headline & Filter Buttons */}
      <div className="mt-14 md:mt-20 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-ink/20">
        <div>
          <h2 id="trajectory-title" className="display text-[clamp(2.6rem,7vw,6rem)] leading-[0.85] text-ink">
            <Reveal as="span" pattern="heading">Aprender.</Reveal>
            <Reveal as="span" pattern="heading" delay={0.08}><span className="font-serif italic text-crimson text-[0.85em] normal-case tracking-normal">Aplicar.</span></Reveal>
            <Reveal as="span" pattern="heading" delay={0.16}>Evoluir.</Reveal>
          </h2>
          <Reveal pattern="body" delay={0.16} className="mt-6 max-w-xl">
            <p className="text-base text-smoke leading-relaxed">
              Cursos de JavaScript, IA aplicada, inglês e Excel complementam minha prática com projetos. A experiência no varejo também contribui para entender o contexto de quem usa o software.
            </p>
          </Reveal>
        </div>

        <LayoutGroup id="trajectory-tabs">
          <div className="flex flex-wrap items-center gap-2 self-start md:self-end" role="group" aria-label="Filtrar trajetória">
            {tabs.map((item) => {
              const isActive = tab === item.id;
              return (
                <Magnetic key={item.id} strength={0.15}>
                  <button
                    type="button"
                    onClick={() => setTab(item.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "press relative isolate font-mono tracking-widest uppercase min-h-[44px] px-4 py-2.5 rounded-full border text-[0.65rem] outline-none focus-visible:ring-2 focus-visible:ring-crimson cursor-pointer",
                      isActive
                        ? item.activeTone === "crimson"
                          ? "border-crimson text-bone"
                          : "border-ink text-bone"
                        : "border-ink/20 text-smoke hover:border-ink hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="trajectory-tab-bg"
                        transition={SPRING_UI}
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-0 -z-10 rounded-full shadow-sm",
                          item.activeTone === "crimson" ? "bg-crimson" : "bg-ink",
                        )}
                      />
                    )}
                    {item.label}
                  </button>
                </Magnetic>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      {/* Section Content */}
      <div className="mt-12 space-y-16">
        {showCert && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-ink">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-crimson-deep" aria-hidden="true" />
                <span className="label font-bold text-ink text-[0.72rem] tracking-wider uppercase">
                  Cursos e certificados
                </span>
              </div>
              <span className="label text-smoke text-[0.65rem] font-mono">
                {certificates.length.toString().padStart(2, "0")} DOCUMENTOS
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert, index) => (
                <Reveal key={cert.id} pattern="depth" delay={(index % 2) * 0.08} innerClassName="h-full">
                  <div
                    className="group relative h-full flex flex-col justify-between p-6 md:p-8 bg-black/[0.02] border border-ink/15 hover:border-crimson hover:bg-black/[0.04] rounded-sm"
                  >
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <span className="font-mono text-crimson-deep text-[0.65rem] tracking-widest uppercase font-semibold px-2 py-0.5 rounded bg-crimson/10 border border-crimson/20">
                          {cert.category}
                        </span>
                        <span className="font-mono text-smoke text-[0.65rem] tracking-wider">
                          {cert.workload ? `${cert.workload} · ` : ""}{cert.date}
                        </span>
                      </div>

                      <h3 className="mt-4 break-words text-xl md:text-2xl font-bold tracking-tight text-ink group-hover:text-crimson-deep">
                        {cert.title}
                      </h3>
                      <p className="mt-1 text-xs font-mono text-smoke font-medium">
                        {cert.issuer}
                      </p>

                      <p className="mt-4 text-sm text-ink/80 leading-relaxed">
                        {cert.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {cert.skills.map((skill) => (
                          <span
                            key={skill}
                            className="font-mono text-[0.62rem] px-2 py-0.5 bg-ink/5 border border-ink/10 text-ink/85 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => openCert(cert)}
                        className="press inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-ink hover:text-crimson-deep min-h-[44px] cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5 text-crimson-deep" aria-hidden="true" />
                        Ver na Página
                      </button>

                      <a
                        href={cert.downloadUrl}
                        download
                        className="press inline-flex items-center gap-1.5 text-[0.65rem] font-mono uppercase tracking-widest text-ink/80 hover:text-ink min-h-[44px] px-3 py-1 rounded border border-ink/20 hover:border-ink"
                      >
                        {cert.downloadLabel}
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {showExp && (
          <div className="space-y-12">
            <div>
              <div className="flex items-center justify-between py-3 border-b border-ink">
                <span className="label font-bold text-ink text-[0.68rem] tracking-wider uppercase">
                  Experiência Prática & Mercado
                </span>
                <span className="label text-smoke text-[0.65rem] font-mono">
                  {experience.length.toString().padStart(2, "0")} Registros
                </span>
              </div>
              <div className="divide-y divide-ink/15">
                {experience.map((item, index) => (
                  <Reveal key={item.title} pattern="row" delay={index * 0.04}>
                    <div className="group py-6 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-black/[0.025] px-2 rounded-sm">
                      <div className="md:col-span-3">
                        <span className="label text-crimson-deep font-mono text-[0.68rem] block font-semibold">{item.period}</span>
                        <span className="label text-smoke text-[0.65rem] mt-1 block">{item.place}</span>
                      </div>

                      <div className="md:col-span-5">
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-ink group-hover:text-crimson-deep">
                          {item.title}
                        </h3>
                        <p className="label text-smoke text-[0.68rem] mt-1 tracking-wider">{item.org}</p>
                      </div>

                      <div className="md:col-span-4 flex flex-col justify-between">
                        <p className="text-sm text-ink/80 leading-relaxed">{item.detail}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="label px-2.5 py-1 rounded bg-ink/5 border border-ink/10 text-[0.62rem] text-ink font-semibold">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between py-3 border-b border-ink">
                <span className="label font-bold text-ink text-[0.68rem] tracking-wider uppercase">
                  Formação Acadêmica & Marcos
                </span>
                <span className="label text-smoke text-[0.65rem] font-mono">
                  {education.length.toString().padStart(2, "0")} Registros
                </span>
              </div>
              <div className="divide-y divide-ink/15">
                {education.map((item, index) => (
                  <Reveal key={item.title} pattern="row" delay={Math.min(index * 0.04, 0.16)}>
                    <div className="group py-6 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-black/[0.025] px-2 rounded-sm">
                      <div className="md:col-span-3">
                        <span className="label text-crimson-deep font-mono text-[0.68rem] block font-semibold">{item.period}</span>
                        <span className="label text-smoke text-[0.65rem] mt-1 block">{item.place}</span>
                      </div>

                      <div className="md:col-span-5">
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-ink group-hover:text-crimson-deep">
                          {item.title}
                        </h3>
                        <p className="label text-smoke text-[0.68rem] mt-1 tracking-wider">{item.org}</p>
                      </div>

                      <div className="md:col-span-4 flex flex-col justify-between">
                        <p className="text-sm text-ink/80 leading-relaxed">{item.detail}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="label px-2.5 py-1 rounded bg-ink/5 border border-ink/10 text-[0.62rem] text-ink font-semibold">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Lightbox for Instant In-Page Certificate Verification */}
      {mounted &&
        hasOpened &&
        createPortal(
          <AnimatePresence>
            {selectedCert && (
              <CertificateLightbox certificate={selectedCert} onClose={closeCert} />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
