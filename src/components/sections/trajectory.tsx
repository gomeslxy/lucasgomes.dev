import { ArrowUpRight, FileText } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CertificateModalHost, CertificateTrigger } from "@/components/sections/certificate-modal-host";
import { SectionLabel } from "@/components/ui/section-label";
import { certificates, education, experience, profile, workingStyle } from "@/lib/data";

export function Trajectory() {
  const englishCert = certificates.find((cert) => cert.id === "callan-english");

  return (
    <section id="trajetoria" aria-labelledby="trajectory-title" className="relative bg-bone text-ink py-[clamp(6rem,11vw,10rem)]">
      <div className="gutter">
        <SectionLabel index="02" title="Sobre e Experiência" aside="Formação e Certificados" tone="light" />

        <CertificateModalHost>
          {/* Bloco 1 — Sobre e Forma de Trabalho */}
          <div className="mt-14 md:mt-20 pb-12 border-b border-ink/20 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="trajectory-title" className="display text-[clamp(2.6rem,7vw,6rem)] leading-[0.85] text-ink">
                <Reveal as="span" pattern="heading">Sobre</Reveal>{" "}
                <Reveal as="span" pattern="heading" delay={0.08}>
                  <span className="font-serif italic text-crimson text-[0.85em] normal-case tracking-normal">e</span>
                </Reveal>{" "}
                <Reveal as="span" pattern="heading" delay={0.16}>experiência</Reveal>
              </h2>
              <Reveal pattern="body" delay={0.14} className="mt-7 max-w-2xl space-y-4 text-sm sm:text-base text-ink/85 leading-relaxed">
                <p>
                  Desenvolvo aplicações web com Next.js, TypeScript e PostgreSQL, atuando da interface às regras de banco de dados, autenticação e integrações com APIs externas.
                </p>
                <p>
                  Além dos projetos de software, trabalho presencialmente no varejo com atendimento ao público, vendas e controle de estoque. Essa rotina trouxe disciplina operacional, comunicação objetiva e foco no uso prático dos sistemas.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-ink/15 lg:pl-8 flex flex-col justify-center">
              <span className="label text-crimson-deep font-mono text-[0.68rem] font-semibold">
                Forma de trabalho
              </span>
              <ol className="mt-5 space-y-5">
                {workingStyle.map((item) => (
                  <li key={item.index} className="flex items-start gap-4">
                    <span className="font-mono text-xs font-bold text-crimson-deep pt-0.5 tabular-nums">
                      [{item.index}]
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold tracking-tight text-ink">{item.title}</h3>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-smoke">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Bloco 2 — Experiência vs. Formação e Idioma */}
          <div className="mt-14 space-y-14">
            <div className="grid gap-10 lg:grid-cols-12 items-start">
              {/* Experiência */}
              <div className="lg:col-span-7">
                <div className="flex items-center justify-between py-3 border-b border-ink">
                  <span className="label font-bold text-ink text-[0.68rem] tracking-wider uppercase">
                    Experiência
                  </span>
                  <span className="label text-smoke text-[0.65rem] font-mono">
                    {experience.length.toString().padStart(2, "0")} registros
                  </span>
                </div>
                <div className="divide-y divide-ink/15">
                  {experience.map((item, index) => (
                    <Reveal key={item.title} pattern="row" delay={index * 0.04}>
                      <div className="py-6 md:py-7 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="label text-crimson-deep font-mono text-[0.68rem] font-semibold">
                            {item.period}
                          </span>
                          <span className="label px-2.5 py-1 rounded bg-ink/5 border border-ink/10 text-[0.62rem] text-ink font-semibold">
                            {item.tag}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-ink">
                          {item.title}
                        </h3>
                        <p className="font-mono text-xs text-smoke">
                          {item.org} · {item.place}
                        </p>
                        <p className="pt-1 text-sm text-ink/80 leading-relaxed">{item.detail}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* Formação e Idioma */}
              <div className="lg:col-span-5 rounded-sm border border-ink/15 bg-black/[0.03] p-6 sm:p-7 space-y-6">
                <div>
                  <span className="label font-bold text-ink text-[0.68rem] tracking-wider uppercase block pb-3 border-b border-ink/15">
                    Formação e idioma
                  </span>
                </div>

                {education[0] && (
                  <div>
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-crimson-deep font-semibold">
                      Ensino Médio · {education[0].period}
                    </span>
                    <h3 className="mt-1 text-lg font-bold tracking-tight text-ink">{education[0].title}</h3>
                    <p className="font-mono text-xs text-smoke mt-0.5">
                      {education[0].org} · {education[0].place}
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-ink/80 leading-relaxed">{education[0].detail}</p>
                  </div>
                )}

                <div className="pt-5 border-t border-ink/15">
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-crimson-deep font-semibold">
                    Idioma · CEFR B2
                  </span>
                  <h3 className="mt-1 text-lg font-bold tracking-tight text-ink">
                    Inglês — Callan Method Stage 10
                  </h3>
                  <p className="font-mono text-xs text-smoke mt-0.5">
                    BC English School · 4+ anos de imersão
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-ink/80 leading-relaxed">
                    Conversação, compreensão oral e leitura de documentação técnica com nível B2 registrado no certificado.
                  </p>
                  {englishCert && (
                    <CertificateTrigger
                      certificateId={englishCert.id}
                      className="press mt-3 inline-flex min-h-[44px] items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:text-crimson-deep underline decoration-ink/30 underline-offset-4 cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 text-crimson-deep" aria-hidden="true" />
                      Ver certificado
                    </CertificateTrigger>
                  )}
                </div>

                <div className="pt-5 border-t border-ink/15">
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-smoke font-semibold">
                    Disponibilidade
                  </span>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {profile.city} · {profile.region}
                  </p>
                  <p className="mt-1 font-mono text-xs text-smoke">
                    {profile.modes.join(" · ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Bloco 3 — Certificados */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-ink">
                <span className="label font-bold text-ink text-[0.68rem] tracking-wider uppercase">
                  Certificados
                </span>
                <span className="label text-smoke text-[0.65rem] font-mono">
                  {certificates.length.toString().padStart(2, "0")} documentos
                </span>
              </div>

              <div className="divide-y divide-ink/15 border-b border-ink/15">
                {certificates.map((cert, index) => (
                  <Reveal key={cert.id} pattern="row" delay={index * 0.04}>
                    <div className="group py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-black/[0.025] px-2">
                      <div className="md:col-span-3">
                        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-crimson-deep font-semibold block">
                          {cert.category}
                        </span>
                        <span className="font-mono text-xs text-smoke mt-1 block">
                          {cert.workload ? `${cert.workload} · ` : ""}{cert.date}
                        </span>
                      </div>

                      <div className="md:col-span-6">
                        <h3 className="text-lg md:text-xl font-bold tracking-tight text-ink">
                          {cert.title}
                        </h3>
                        <p className="font-mono text-xs text-smoke mt-0.5">{cert.issuer}</p>
                        <p className="mt-2 text-sm text-ink/80 leading-relaxed">{cert.description}</p>
                      </div>

                      <div className="md:col-span-3 flex flex-wrap md:justify-end items-center gap-2.5">
                        <CertificateTrigger
                          certificateId={cert.id}
                          className="press inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-ink hover:text-crimson-deep min-h-[44px] px-3 rounded border border-ink/20 hover:border-crimson-deep cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5 text-crimson-deep" aria-hidden="true" />
                          Visualizar
                        </CertificateTrigger>

                        <a
                          href={cert.downloadUrl}
                          download
                          className="press inline-flex items-center gap-1.5 text-[0.65rem] font-mono uppercase tracking-widest text-ink/80 hover:text-ink min-h-[44px] px-3 rounded border border-ink/15 hover:border-ink"
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
          </div>
        </CertificateModalHost>
      </div>
    </section>
  );
}
