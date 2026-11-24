import { SectionLabel } from "@/components/ui/section-label";
import { capabilities } from "@/lib/data";
import { Reveal } from "@/components/motion/reveal";

export function StackCapabilities() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="relative bg-ink text-bone border-t border-white/10 py-[clamp(6rem,11vw,10rem)]">
      <div className="gutter mx-auto max-w-[1600px]">
        <SectionLabel index="03" title="Stack" aside="Tecnologias" tone="dark" />

        <div className="mt-14 md:mt-20 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10">
          <h2 id="stack-title" className="display text-[clamp(2.6rem,7vw,6rem)] leading-[0.85]">
            <Reveal as="span" pattern="heading">Stack</Reveal>{" "}
            <Reveal as="span" pattern="heading" delay={0.08}>
              <span className="font-serif italic text-crimson text-[0.85em] normal-case tracking-normal">técnica</span>
            </Reveal>
          </h2>
          <Reveal pattern="body" delay={0.1} className="max-w-md">
            <p className="text-base text-bone/75 leading-relaxed">
              Tecnologias utilizadas nos projetos acima, organizadas por camada.
            </p>
          </Reveal>
        </div>

        <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {capabilities.map((cap, index) => (
            <Reveal key={cap.index} pattern="row" delay={index * 0.04}>
              <div className="py-8 md:py-10 grid gap-6 lg:grid-cols-12 items-start">
                <div className="lg:col-span-4">
                  <span className="font-mono text-xs font-bold text-crimson tabular-nums">[{cap.index}]</span>
                  <h3 className="display mt-2 text-[clamp(1.6rem,2.8vw,2.3rem)] tracking-tight text-bone">
                    {cap.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/75">
                    {cap.whatIBuild}
                  </p>
                </div>

                <ul className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-1">
                  {cap.items.map((tech) => (
                    <li key={tech} className="flex items-start gap-2.5 font-mono text-xs leading-relaxed text-bone/90">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-crimson" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>

                <div className="lg:col-span-3 lg:border-l lg:border-white/10 lg:pl-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash block">
                    Aplicado em
                  </span>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-bone/80">
                    {cap.appliedIn}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
