import { ArrowUpRight, Code2, ExternalLink, ShieldCheck, Terminal } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { GithubIcon } from "@/components/ui/brand-icons";
import { SectionLabel } from "@/components/ui/section-label";
import {
  ProjectModalTrigger,
  WorksShowcaseModalHost,
} from "@/components/sections/works-showcase-modal-host";
import { projects, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";

export function WorksShowcase() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative border-t border-white/10 bg-ink text-bone py-20 md:py-28">
      <WorksShowcaseModalHost>
        <div className="gutter relative z-10 mx-auto max-w-[1600px]">
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
              <p className="font-mono text-xs md:text-sm leading-relaxed text-bone/75">
                Sistemas reais, da interface aos dados. Explore cada projeto para conhecer os desafios, as decisões e a arquitetura por trás da experiência.
              </p>
            </Reveal>
          </div>

          <ul className="mt-12 space-y-10 md:space-y-16">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </ul>
        </div>
      </WorksShowcaseModalHost>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const demoLink = project.links.find((l) => !l.href.includes("github.com"));
  const repoLink = project.links.find((l) => l.href.includes("github.com"));

  return (
    <li id={`case-${project.slug}`} className="relative">
      <article className="group relative isolate overflow-hidden rounded-[20px] border border-white/15 bg-[#0d0d0f] hover:border-white/30 focus-within:border-crimson/50">
        <div className="grid lg:grid-cols-[1.08fr_1fr] items-stretch">
          {/* Text Specification Column */}
          <div className={cn("relative flex flex-col justify-between p-6 sm:p-9 xl:p-12", index % 2 ? "lg:order-2" : "")}>
            <div>
              {/* Metadata row */}
              <Reveal pattern="meta" className="font-mono text-[10px] uppercase tracking-[0.16em]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2.5 text-bone/70">
                    <span className="font-bold text-crimson">[{project.index}]</span>
                    <span>{project.period}</span>
                    <span aria-hidden="true" className="h-px w-6 bg-white/15" />
                    <span className="text-bone/90">{project.statusBadge}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-bone/75">
                    <Code2 size={12} className="text-crimson" aria-hidden="true" />
                    {project.category}
                  </span>
                </div>
              </Reveal>

              {/* Title */}
              <h3 className="display mt-5 text-[clamp(2.4rem,4.5vw,4.8rem)] leading-[0.92] tracking-tighter">
                <Reveal as="span" pattern="heading" delay={0.05}>
                  <ProjectModalTrigger
                    projectSlug={project.slug}
                    className="block text-left outline-none hover:text-crimson focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson cursor-pointer"
                  >
                    {project.shortTitle}
                  </ProjectModalTrigger>
                </Reveal>
              </h3>

              {/* Punchline */}
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

              {/* Essential Stack */}
              <div className="mt-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ash block mb-2">Stack Essencial</span>
                <ul className="flex flex-wrap gap-1.5" aria-label={`Stack essencial de ${project.shortTitle}`}>
                  {project.essentialStack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-white/10 bg-white/4 px-2.5 py-1 font-mono text-[10px] text-bone/80"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interaction triggers */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
              <ProjectModalTrigger
                projectSlug={project.slug}
                className="press inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-lg bg-bone px-5 text-xs font-mono font-bold uppercase tracking-wider text-ink hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson cursor-pointer"
              >
                <Terminal size={14} className="text-crimson" aria-hidden="true" />
                Ver Detalhes Técnicos & Case
              </ProjectModalTrigger>

              {demoLink && (
                <a
                  href={demoLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-white/15 px-4 text-xs font-mono text-bone/80 hover:border-crimson/50 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                >
                  <ExternalLink size={13} aria-hidden="true" />
                  Live Demo
                </a>
              )}

              {repoLink && (
                <a
                  href={repoLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-white/10 px-3.5 text-xs font-mono text-ash hover:border-white/30 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                >
                  <GithubIcon size={13} />
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Media preview column */}
          <Reveal
            pattern="depth"
            delay={0.08}
            innerClassName="h-full"
            className={cn("relative m-3 sm:m-4 min-h-[300px] lg:min-h-[420px]", index % 2 ? "lg:order-1" : "")}
          >
            <ProjectModalTrigger
              projectSlug={project.slug}
              ariaLabel={`Abrir especificações técnicas de ${project.shortTitle}`}
              className="group/media relative block w-full min-h-[300px] lg:min-h-[420px] h-full cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#141416] text-left hover:border-crimson/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            >
              <div className="absolute inset-x-0 top-0 z-10 flex h-9 items-center gap-1.5 border-b border-white/10 bg-[#121214]/95 px-3.5">
                <span className="h-2 w-2 rounded-full bg-crimson/80" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-bone/60">
                  system://{project.slug}.preview
                </span>
              </div>

              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 1023px) 92vw, 48vw"
                className="object-cover object-top pt-9 motion-safe:transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/media:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 text-white">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone/80">
                  Clique para explorar arquitetura
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 bg-black/60 motion-safe:transition-transform motion-safe:group-hover/media:scale-110 group-hover/media:border-crimson">
                  <ArrowUpRight size={18} className="text-white group-hover/media:text-crimson" aria-hidden="true" />
                </span>
              </div>
            </ProjectModalTrigger>
          </Reveal>
        </div>
      </article>
    </li>
  );
}
