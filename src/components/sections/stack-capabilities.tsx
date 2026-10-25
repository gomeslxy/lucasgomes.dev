import { SectionLabel } from "@/components/ui/section-label";
import { GlowSurface } from "@/components/ui/glow-surface";
import { capabilities, interests } from "@/lib/data";
import styles from "@/components/spatial/living-surface.module.css";
import { Reveal } from "@/components/motion/reveal";

export function StackCapabilities() {
  return (
    <section id="stack" className="relative bg-ink text-bone border-t border-white/10 py-[clamp(6rem,11vw,10rem)]">
      <div className="gutter">
        <SectionLabel index="03" title="Stack & Competências" aside="Engenharia de Ponta a Ponta" tone="dark" />

        <div className="mt-14 md:mt-20 grid gap-12 lg:grid-cols-12">
          {/* Header & Subtitle */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="display text-[clamp(2.6rem,7vw,6rem)] leading-[0.85]">
                <Reveal as="span" pattern="heading">Tecnologias</Reveal>
                <Reveal as="span" pattern="heading" delay={.08}><span className="font-serif italic text-crimson text-[0.85em] normal-case tracking-normal">em</span></Reveal>
                <Reveal as="span" pattern="heading" delay={.16}>prática.</Reveal>
              </h2>
              <Reveal pattern="body" delay={.1} className="mt-8 max-w-md"><p className="text-base text-bone/70 leading-relaxed">
                Minha stack conecta interfaces, APIs e dados. Uso os projetos para aprofundar decisões de arquitetura, testar integrações e entender os limites de cada ferramenta.
              </p></Reveal>
            </div>

            {/* Lifestyle / Personal interests */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <span className="label text-ash text-xs">Interesses</span>
              <div className="mt-4 flex flex-wrap gap-2">
                {interests.map((item) => (
                  <Reveal as="span" pattern="meta" delay={interests.indexOf(item) * .035}
                    key={item}
                    className="label rounded-full border border-white/15 px-3 py-1.5 text-[0.62rem] text-bone/70 hover:border-crimson hover:text-bone select-none"
                  >
                    {item}
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Native disclosure avoids hover-driven state and animated layout. */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {capabilities.map((cap, index) => (
              <Reveal key={cap.index} pattern="row" delay={index * .035}><GlowSurface className={styles.capabilitySurface}>
                <details name="capabilities" open={index === 0} className={styles.capability}>
                  <summary>
                    <span className={styles.moduleHeader}>
                      <span className={styles.moduleTitle}>
                        <span className={styles.moduleIndex}>
                          {cap.index}
                        </span>
                        <span className="display text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight">{cap.title}</span>
                      </span>
                      <span aria-hidden="true" className={styles.moduleToggle}><span>+</span></span>
                    </span>
                    <span className="mt-3.5 block max-w-xl text-sm leading-relaxed text-bone/70">{cap.lead}</span>
                  </summary>
                  <ul className="mt-6 grid grid-cols-2 gap-2.5 border-t border-white/10 pt-6 sm:grid-cols-3">
                    {cap.items.map((tech) => (
                      <li key={tech} className={`${styles.technology} flex items-start gap-2 font-mono text-xs leading-relaxed tracking-tight text-bone/90`}>
                        <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-crimson" />
                        {tech}
                      </li>
                    ))}
                  </ul>
                </details>
              </GlowSurface></Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
