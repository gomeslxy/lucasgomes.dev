"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Award, Download, ExternalLink, FileCheck, FileText, Sparkles, X } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import { SectionLabel } from "@/components/ui/section-label";
import { certificates, education, experience, type CertificateItem } from "@/lib/data";
import { cn, EASE_EXPO } from "@/lib/utils";

export function Trajectory() {
  const [tab, setTab] = useState<"certificates" | "experience" | "all">("certificates");
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  // Close modal when pressing ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };

    if (selectedCert) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedCert]);

  const showCert = tab === "all" || tab === "certificates";
  const showExp = tab === "all" || tab === "experience";

  return (
    <section id="trajetoria" className="relative bg-bone text-ink py-[clamp(6rem,11vw,10rem)]">
      <div className="gutter">
        <SectionLabel index="04" title="Credenciais & Trajetória" aside="Certificados Comprovados & Prática de Mercado" tone="light" />

        {/* Section Headline & Filter Buttons */}
        <div className="mt-14 md:mt-20 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-ink/20">
          <div>
            <h2 className="display text-[clamp(2.6rem,7vw,6rem)] leading-[0.85] text-ink">
              Certificações <br />
              <span className="font-serif italic text-crimson text-[0.85em] normal-case tracking-normal">oficiais</span> <br />
              & mercado real.
            </h2>
            <p className="mt-6 text-base text-smoke leading-relaxed max-w-xl">
              Qualificação técnica chancelada pelo SENAI, proficiência internacional em inglês e domínio analítico em Excel com documentos originais para download e visualização instantânea na página — somados à experiência direta com público, estoque e operação no varejo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
            <Magnetic strength={0.15}>
              <button
                type="button"
                onClick={() => setTab("certificates")}
                className={cn(
                  "font-mono tracking-widest uppercase min-h-[44px] px-4 py-2.5 rounded-full border transition-all text-[0.62rem] outline-none focus-visible:ring-2 focus-visible:ring-crimson",
                  tab === "certificates" ? "bg-crimson text-bone border-crimson shadow-sm" : "border-ink/20 text-smoke hover:border-ink hover:text-ink"
                )}
              >
                ★ CERTIFICADOS [{certificates.length.toString().padStart(2, "0")}]
              </button>
            </Magnetic>
            <Magnetic strength={0.15}>
              <button
                type="button"
                onClick={() => setTab("experience")}
                className={cn(
                  "font-mono tracking-widest uppercase min-h-[44px] px-4 py-2.5 rounded-full border transition-all text-[0.62rem] outline-none focus-visible:ring-2 focus-visible:ring-crimson",
                  tab === "experience" ? "bg-ink text-bone border-ink shadow-sm" : "border-ink/20 text-smoke hover:border-ink hover:text-ink"
                )}
              >
                EXPERIÊNCIA & FORMAÇÃO [{experience.length.toString().padStart(2, "0")}]
              </button>
            </Magnetic>
            <Magnetic strength={0.15}>
              <button
                type="button"
                onClick={() => setTab("all")}
                className={cn(
                  "font-mono tracking-widest uppercase min-h-[44px] px-4 py-2.5 rounded-full border transition-all text-[0.62rem] outline-none focus-visible:ring-2 focus-visible:ring-crimson",
                  tab === "all" ? "bg-ink text-bone border-ink shadow-sm" : "border-ink/20 text-smoke hover:border-ink hover:text-ink"
                )}
              >
                VISÃO COMPLETA
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Section Content */}
        <div className="mt-12 space-y-16">
          {/* Spotlight: Certificates Gallery */}
          {showCert && (
            <div>
              <div className="flex items-center justify-between py-3 border-b border-ink">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-crimson" />
                  <span className="label font-bold text-ink text-[0.72rem] tracking-wider uppercase">
                    Certificações Oficiais Verificadas
                  </span>
                </div>
                <span className="label text-smoke text-[0.62rem] font-mono">
                  04 DOCUMENTOS OTIMIZADOS
                </span>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ duration: 0.6, ease: EASE_EXPO, delay: i * 0.08 }}
                    className="group relative flex flex-col justify-between p-6 md:p-8 bg-black/[0.02] border border-ink/15 hover:border-crimson hover:bg-black/[0.04] transition-all duration-300 rounded-sm"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-mono text-crimson text-[0.62rem] tracking-widest uppercase font-semibold px-2 py-0.5 rounded bg-crimson/10 border border-crimson/20">
                          {cert.category}
                        </span>
                        <span className="font-mono text-smoke text-[0.62rem] tracking-wider">
                          {cert.workload ? `${cert.workload} · ` : ""}{cert.date}
                        </span>
                      </div>

                      {/* Title & Issuer */}
                      <h3 className="mt-4 text-xl md:text-2xl font-bold tracking-tight text-ink group-hover:text-crimson transition-colors">
                        {cert.title}
                      </h3>
                      <p className="mt-1 text-xs font-mono text-smoke font-medium">
                        {cert.issuer}
                      </p>

                      <p className="mt-4 text-sm text-smoke/90 leading-relaxed">
                        {cert.description}
                      </p>

                      {/* Skills tags */}
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {cert.skills.map((skill) => (
                          <span
                            key={skill}
                            className="font-mono text-[0.58rem] px-2 py-0.5 bg-ink/5 border border-ink/10 text-ink/80 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="mt-8 pt-5 border-t border-ink/10 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedCert(cert)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-ink hover:text-crimson transition-colors min-h-[36px]"
                      >
                        <FileText className="h-3.5 w-3.5 text-crimson" />
                        Ver na Página
                      </button>

                      <a
                        href={cert.downloadUrl}
                        download
                        className="inline-flex items-center gap-1 text-[0.62rem] font-mono uppercase tracking-widest text-smoke hover:text-ink transition-colors min-h-[36px] px-2 py-1 rounded border border-ink/15 hover:border-ink"
                      >
                        {cert.downloadLabel}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Education Timelines */}
          {showExp && (
            <div className="space-y-12">
              <div>
                <div className="flex items-center justify-between py-3 border-b border-ink">
                  <span className="label font-bold text-ink text-[0.68rem] tracking-wider uppercase">
                    Experiência Prática & Mercado
                  </span>
                  <span className="label text-smoke text-[0.62rem] font-mono">
                    {experience.length.toString().padStart(2, "0")} Posições
                  </span>
                </div>
                <div className="divide-y divide-ink/15">
                  {experience.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-5%" }}
                      transition={{ duration: 0.6, ease: EASE_EXPO, delay: i * 0.05 }}
                      className="group py-6 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-black/[0.025] px-2 transition-colors rounded-sm"
                    >
                      <div className="md:col-span-3">
                        <span className="label text-crimson font-mono text-[0.68rem] block font-semibold">{item.period}</span>
                        <span className="label text-smoke text-[0.6rem] mt-1 block">{item.place}</span>
                      </div>

                      <div className="md:col-span-5">
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-ink group-hover:text-crimson transition-colors">
                          {item.title}
                        </h3>
                        <p className="label text-smoke text-[0.68rem] mt-1 tracking-wider">{item.org}</p>
                      </div>

                      <div className="md:col-span-4 flex flex-col justify-between">
                        <p className="text-sm text-smoke leading-relaxed">{item.detail}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="label px-2.5 py-1 rounded bg-ink/5 border border-ink/10 text-[0.58rem] text-ink font-semibold">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between py-3 border-b border-ink">
                  <span className="label font-bold text-ink text-[0.68rem] tracking-wider uppercase">
                    Formação Acadêmica & Marcos
                  </span>
                  <span className="label text-smoke text-[0.62rem] font-mono">
                    {education.length.toString().padStart(2, "0")} Registros
                  </span>
                </div>
                <div className="divide-y divide-ink/15">
                  {education.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-5%" }}
                      transition={{ duration: 0.6, ease: EASE_EXPO, delay: i * 0.05 }}
                      className="group py-6 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-black/[0.025] px-2 transition-colors rounded-sm"
                    >
                      <div className="md:col-span-3">
                        <span className="label text-crimson font-mono text-[0.68rem] block font-semibold">{item.period}</span>
                        <span className="label text-smoke text-[0.6rem] mt-1 block">{item.place}</span>
                      </div>

                      <div className="md:col-span-5">
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-ink group-hover:text-crimson transition-colors">
                          {item.title}
                        </h3>
                        <p className="label text-smoke text-[0.68rem] mt-1 tracking-wider">{item.org}</p>
                      </div>

                      <div className="md:col-span-4 flex flex-col justify-between">
                        <p className="text-sm text-smoke leading-relaxed">{item.detail}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="label px-2.5 py-1 rounded bg-ink/5 border border-ink/10 text-[0.58rem] text-ink font-semibold">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Lightbox for Instant In-Page Certificate Verification */}
      <AnimatePresence>
        {selectedCert && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-ink/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.25, ease: EASE_EXPO }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-bone text-ink rounded-lg shadow-2xl overflow-hidden border border-white/20 cursor-default"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink/15 bg-bone">
                <div>
                  <span className="font-mono text-[0.62rem] text-crimson font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <FileCheck className="h-3 w-3" />
                    Comprovante Oficial de Conclusão (ESC para fechar)
                  </span>
                  <h4 id="cert-modal-title" className="text-lg font-bold text-ink tracking-tight mt-0.5">
                    {selectedCert.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={selectedCert.downloadUrl}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-ink hover:text-crimson border border-ink/20 hover:border-crimson rounded transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {selectedCert.downloadLabel}
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    aria-label="Fechar comprovante (ESC)"
                    className="p-2 rounded-full hover:bg-black/5 text-ink transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body / Instant Visual Rendering */}
              <div className="flex-1 overflow-auto p-4 md:p-6 bg-coal/10 flex items-center justify-center min-h-[380px] max-h-[72vh]">
                <div className="relative max-w-full max-h-full shadow-lg border border-black/10 rounded overflow-hidden bg-bone">
                  <Image
                    src={selectedCert.previewImageUrl}
                    alt={`Comprovante de ${selectedCert.title}`}
                    width={1400}
                    height={1000}
                    priority
                    quality={90}
                    className="max-h-[66vh] w-auto h-auto object-contain mx-auto"
                  />
                </div>
              </div>

              {/* Modal Footer Info */}
              <div className="px-6 py-3 border-t border-ink/10 bg-bone/90 flex flex-wrap items-center justify-between text-xs font-mono text-smoke">
                <span>Emitido por: {selectedCert.issuer}</span>
                <span className="text-[0.68rem] text-smoke/70">Pressione ESC ou clique fora para fechar</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
