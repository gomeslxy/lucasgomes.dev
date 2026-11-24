import { SectionLabel } from "@/components/ui/section-label";
import { ProjectArtwork } from "@/components/ui/project-artwork";
import { projects } from "@/lib/data";

export function WorksFan() {
  return (
    <section id="work" className="relative border-t border-white/10 bg-ink text-bone">
      <div className="gutter py-16 md:py-24">
        <div>
          <SectionLabel index="01" title="Projetos selecionados" aside="02 cases de engenharia · 2025—2026" />
          <h2 className="display mt-6 text-[clamp(2.4rem,6.5vw,6.5rem)]">
            Código <span className="font-serif text-[0.8em] normal-case italic tracking-[-0.02em] text-crimson">em</span> prática
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.slug}
              id={`fan-card-${project.slug}`}
              href={`#case-${project.slug}`}
              aria-label={`Abrir estudo de caso: ${project.title}`}
              className="group relative block aspect-[4/5] w-full outline-none focus-visible:ring-2 focus-visible:ring-crimson md:aspect-[5/4]"
            >
              <ProjectArtwork project={project} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
