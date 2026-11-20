import { ArrowUpRight, ExternalLink, Terminal } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { GithubIcon } from "@/components/ui/brand-icons";
import { SectionLabel } from "@/components/ui/section-label";
import {
  ProjectModalTrigger,
  WorksShowcaseModalHost,
} from "@/components/sections/works-showcase-modal-host";
import { projects, type Project } from "@/lib/data";

export function WorksShowcase() {
  const [flagship, ...secondary] = projects;

  return (
    <section id="work" aria-labelledby="work-title" className="relative border-t border-white/10 bg-ink text-bone py-20 md:py-28">
      <WorksShowcaseModalHost>
        <div className="gutter relative z-10 mx-auto max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 md:pb-16 border-b border-white/10">
            <div>
              <SectionLabel index="01" title="Projetos" aside="Selecionados" tone="dark" />
              <h2 id="work-title" className="display mt-6 text-[clamp(2.8rem,7vw,7rem)] leading-[0.88] tracking-tighter">
                <Reveal as="span" pattern="heading">
                  Projetos <span className="font-serif italic font-normal text-crimson text-[0.85em]">em</span> destaque
                </Reveal>
              </h2>
            </div>
            <Reveal pattern="body" delay={0.12} className="max-w-md">
              <p className="font-mono text-xs md:text-sm leading-relaxed text-bone/75">
                Sistemas desenvolvidos do front-end ao banco de dados, com demonstração publicada e repositório no GitHub.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 space-y-12 md:space-y-16">
            {flagship && <FlagshipCase project={flagship} />}
            {secondary.map((project) => (
              <ProductionSplitCase key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </WorksShowcaseModalHost>
    </section>
  );
}

function FlagshipCase({ project }: { project: Project }) {
  const demoLink = project.links.find((l) => !l.href.includes("github.com"));
  const repoLink = project.links.find((l) => l.href.includes("github.com"));

  return (
    <article
      id={`case-${project.slug}`}
      className="relative overflow-hidden rounded-[20px] border border-white/20 bg-[#0c0c0e] focus-within:border-crimson/50"
    >
      {/* Top Editorial Header */}
      <div className="border-b border-white/10 p-6 sm:p-9 xl:p-10">
        <Reveal pattern="meta" className="font-mono text-[10px] uppercase tracking-[0.16em]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex flex-wrap items-center gap-2.5 text-bone/75">
              <span className="font-bold text-crimson">[{project.index} · DESTAQUE]</span>
              <span>{project.period}</span>
              <span aria-hidden="true" className="h-px w-5 bg-white/15" />
              <span className="text-bone/90">{project.statusBadge}</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
              {project.category}
            </span>
          </div>
        </Reveal>

        <div className="mt-5 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="min-w-0 max-w-2xl">
            <h3 className="display text-[clamp(2.8rem,5.5vw,5.5rem)] leading-[0.9] tracking-tighter">
              <Reveal as="span" pattern="heading" delay={0.05}>
                <ProjectModalTrigger
                  projectSlug={project.slug}
                  className="block text-left outline-none hover:text-crimson focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson cursor-pointer"
                >
                  {project.shortTitle}
                </ProjectModalTrigger>
              </Reveal>
            </h3>
            <Reveal pattern="body" delay={0.1} className="mt-4">
              <p className="text-sm sm:text-base leading-relaxed text-bone/85">{project.punchline}</p>
            </Reveal>
          </div>

          {project.metrics && (
            <dl className="grid grid-cols-3 gap-5 border-t border-white/10 pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 shrink-0">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ash">{m.label}</dt>
                  <dd className="display mt-1 text-2xl sm:text-3xl text-crimson">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* Asymmetric Split Body */}
      <div className="grid lg:grid-cols-12 items-stretch">
        <Reveal
          pattern="depth"
          delay={0.08}
          innerClassName="h-full flex flex-col justify-center"
          className="lg:col-span-7 p-4 sm:p-6 lg:border-r lg:border-white/10"
        >
          <ProjectPreview
            project={project}
            imageSizes="(max-width: 1023px) 92vw, (max-width: 1600px) 56vw, 880px"
          />
        </Reveal>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-crimson block mb-2 font-semibold">
                Problema
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-bone/85">{project.problem}</p>
              <p className="mt-2.5 font-mono text-[11px] leading-relaxed text-ash">
                Contexto: <span className="text-bone/85">{project.audience}</span>
              </p>
            </div>

            <div className="border-t border-white/10 pt-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash block mb-3">
                Arquitetura
              </span>
              <dl className="space-y-3.5">
                {project.mechanisms.map((mech) => (
                  <div key={mech.label}>
                    <dt className="font-mono text-[11px] font-semibold text-bone flex items-center gap-2">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-crimson shrink-0" />
                      {mech.label}
                    </dt>
                    <dd className="mt-1 pl-3.5 text-xs leading-relaxed text-bone/75">{mech.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="border-l-2 border-crimson/70 pl-3.5 py-0.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash block mb-1">
              Trade-off
            </span>
            <p className="text-xs leading-relaxed text-bone/75">{project.consideration}</p>
          </div>
        </div>
      </div>

      {/* Technical Footer */}
      <div className="border-t border-white/10 bg-white/[0.015] px-6 py-5 sm:px-9 xl:px-10 space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash block mb-2">
              Fluxo do sistema
            </span>
            <FlowStrip steps={project.flowSteps} />
          </div>

          <div className="shrink-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash block mb-2">
              Stack
            </span>
            <StackStrip items={project.essentialStack} label={project.shortTitle} />
          </div>
        </div>

        <CaseActionBar projectSlug={project.slug} demoLink={demoLink?.href} repoLink={repoLink?.href} />
      </div>
    </article>
  );
}

function ProductionSplitCase({ project }: { project: Project }) {
  const demoLink = project.links.find((l) => !l.href.includes("github.com"));
  const repoLink = project.links.find((l) => l.href.includes("github.com"));

  return (
    <article
      id={`case-${project.slug}`}
      className="relative overflow-hidden rounded-[20px] border border-white/15 bg-[#0e0e10] focus-within:border-crimson/50"
    >
      <div className="grid lg:grid-cols-12 items-stretch">
        {/* Left Visual + Flow Column */}
        <div className="lg:col-span-5 p-4 sm:p-6 lg:border-r lg:border-white/10 flex flex-col justify-between gap-5">
          <Reveal pattern="depth" delay={0.08} innerClassName="h-full flex flex-col justify-center" className="flex-1">
            <ProjectPreview
              project={project}
              imageSizes="(max-width: 1023px) 92vw, (max-width: 1600px) 40vw, 640px"
            />
          </Reveal>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash block mb-2">
              Fluxo do sistema
            </span>
            <FlowStrip steps={project.flowSteps} />
          </div>
        </div>

        {/* Right Engineering Spec Column */}
        <div className="lg:col-span-7 p-6 sm:p-9 xl:p-10 flex flex-col justify-between gap-6">
          <div>
            <Reveal pattern="meta" className="font-mono text-[10px] uppercase tracking-[0.16em]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex flex-wrap items-center gap-2.5 text-bone/75">
                  <span className="font-bold text-crimson">[{project.index}]</span>
                  <span>{project.period}</span>
                  <span aria-hidden="true" className="h-px w-5 bg-white/15" />
                  <span className="inline-flex items-center gap-1.5 text-bone">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#9ec897]" />
                    {project.statusBadge}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                  {project.category}
                </span>
              </div>
            </Reveal>

            <h3 className="display mt-5 text-[clamp(2.4rem,4.5vw,4.6rem)] leading-[0.92] tracking-tighter">
              <Reveal as="span" pattern="heading" delay={0.05}>
                <ProjectModalTrigger
                  projectSlug={project.slug}
                  className="block text-left outline-none hover:text-crimson focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson cursor-pointer"
                >
                  {project.shortTitle}
                </ProjectModalTrigger>
              </Reveal>
            </h3>

            <Reveal pattern="body" delay={0.1} className="mt-4">
              <p className="text-sm sm:text-base leading-relaxed text-bone/85">{project.punchline}</p>
            </Reveal>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 border-t border-white/10 pt-5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-crimson block mb-2 font-semibold">
                  Problema
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-bone/80">{project.problem}</p>
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-ash">
                  Contexto: <span className="text-bone/85">{project.audience}</span>
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash block mb-2">
                  Arquitetura
                </span>
                <dl className="space-y-3">
                  {project.mechanisms.map((mech) => (
                    <div key={mech.label}>
                      <dt className="font-mono text-[11px] font-semibold text-bone flex items-center gap-2">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-crimson shrink-0" />
                        {mech.label}
                      </dt>
                      <dd className="mt-0.5 pl-3.5 text-xs leading-relaxed text-bone/75">{mech.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className="space-y-5 border-t border-white/10 pt-5">
            <div className="border-l-2 border-crimson/70 pl-3.5 py-0.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash block mb-1">
                Trade-off
              </span>
              <p className="text-xs leading-relaxed text-bone/75">{project.consideration}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash block mb-2">
                Stack
              </span>
              <StackStrip items={project.essentialStack} label={project.shortTitle} />
            </div>

            <CaseActionBar projectSlug={project.slug} demoLink={demoLink?.href} repoLink={repoLink?.href} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectPreview({
  project,
  imageSizes,
}: {
  project: Project;
  imageSizes: string;
}) {
  return (
    <ProjectModalTrigger
      projectSlug={project.slug}
      ariaLabel={`Ver detalhes técnicos de ${project.shortTitle}`}
      className="group/media flex w-full flex-col cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#141416] text-left hover:border-crimson/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
    >
      <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#121214] px-3.5 font-mono text-[10px]">
        <span className="text-bone/85 tracking-wide">{project.domain}</span>
        <span className="uppercase tracking-[0.14em] text-ash">Preview</span>
      </div>

      <div className="relative aspect-[1024/470] w-full overflow-hidden bg-[#0c0c0e]">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes={imageSizes}
          quality={90}
          className="object-cover object-top motion-safe:transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/media:scale-[1.02]"
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#121214] px-4 py-3 text-white">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone/85">
          Ver detalhes técnicos
        </span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 bg-black/40 motion-safe:transition-transform motion-safe:group-hover/media:scale-110 group-hover/media:border-crimson">
          <ArrowUpRight size={15} className="text-white group-hover/media:text-crimson" aria-hidden="true" />
        </span>
      </div>
    </ProjectModalTrigger>
  );
}

function FlowStrip({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[11px] text-bone/85">
      {steps.map((step, index) => (
        <li key={step} className="inline-flex items-center gap-2">
          <span>{step}</span>
          {index < steps.length - 1 && (
            <span aria-hidden="true" className="text-crimson font-bold">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function StackStrip({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={`Stack de ${label}`}>
      {items.map((tech) => (
        <li
          key={tech}
          className="rounded-md border border-white/10 bg-white/4 px-2.5 py-1 font-mono text-[10px] text-bone/85"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

function CaseActionBar({
  projectSlug,
  demoLink,
  repoLink,
}: {
  projectSlug: string;
  demoLink?: string;
  repoLink?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      {demoLink && (
        <a
          href={demoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-bone px-5 text-xs font-mono font-bold uppercase tracking-wider text-ink hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
        >
          <ExternalLink size={13} aria-hidden="true" />
          Acessar projeto
        </a>
      )}

      {repoLink && (
        <a
          href={repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-white/25 px-4 text-xs font-mono text-bone hover:border-crimson/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
        >
          <GithubIcon size={13} />
          Ver código
        </a>
      )}

      <ProjectModalTrigger
        projectSlug={projectSlug}
        className="press inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-4 text-xs font-mono text-bone/85 hover:border-crimson/50 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson cursor-pointer"
      >
        <Terminal size={13} className="text-crimson" aria-hidden="true" />
        Detalhes técnicos
      </ProjectModalTrigger>
    </div>
  );
}
