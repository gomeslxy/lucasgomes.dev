import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";

export function ProjectArtwork({ project }: { project: Project }) {
  return (
    <div className="relative h-full w-full overflow-hidden border border-white/10 bg-coal select-none">
      <Image
        src={project.image}
        alt={project.imageAlt}
        fill
        sizes="(min-width: 768px) 45vw, 90vw"
        quality={80}
        className="object-cover object-top"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-ink/10" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-5">
        <span className="rounded-full border border-white/10 bg-ink px-2.5 py-1.5 font-mono text-[0.62rem] font-bold tracking-widest text-bone">
          [{project.index}]
        </span>
        <span className="max-w-[60%] truncate text-right font-mono text-[0.58rem] tracking-widest text-bone/85 uppercase">
          {project.category.split("·")[0]?.trim() || project.category}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
        <span className="font-mono text-[0.62rem] font-semibold tracking-widest text-bone/80 uppercase">{project.kicker}</span>
        <h3 className="display mt-1.5 text-[clamp(1.9rem,3.2vw,3rem)] leading-[0.9] tracking-tighter text-bone">{project.shortTitle}</h3>
        <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3">
          <span className="font-mono text-[0.6rem] tracking-wider text-bone/60 uppercase">{project.period}</span>
          <span className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-ink px-3 text-xs text-bone transition-colors group-hover:border-crimson group-focus-visible:border-crimson">
            Ver case
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}
