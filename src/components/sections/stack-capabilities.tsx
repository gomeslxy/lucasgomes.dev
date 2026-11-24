import { SectionLabel } from "@/components/ui/section-label";
import { GlowSurface } from "@/components/ui/glow-surface";
import { capabilities, interests } from "@/lib/data";
import styles from "@/components/spatial/living-surface.module.css";

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
                Tecnologias <br />
                <span className="font-serif italic text-crimson text-[0.85em] normal-case tracking-normal">em</span> <br />
                prática.
              </h2>
              <p className="mt-8 text-base text-bone/70 leading-relaxed max-w-md">
                Minha stack conecta interfaces, APIs e dados. Uso os projetos para aprofundar decisões de arquitetura, testar integrações e entender os limites de cada ferramenta.
              </p>
            </div>

            {/* Lifestyle / Personal interests */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <span className="label text-ash text-xs">Interesses</span>
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

          {/* Native disclosure avoids hover-driven state and animated layout. */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {capabilities.map((cap, index) => (
              <GlowSurface key={cap.index} className={styles.capabilitySurface}>
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
              </GlowSurface>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
