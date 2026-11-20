import { ArrowUp, ArrowUpRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ContactCard } from "@/components/sections/contact-card";
import { AnchorLink } from "@/components/ui/anchor-link";
import { BigName } from "@/components/ui/big-name";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { profile } from "@/lib/data";

export function ContactFooter() {
  return (
    <footer id="contato" className="relative overflow-hidden border-t border-white/10 bg-ink pt-16 text-bone sm:pt-24">
      <div className="gutter mx-auto max-w-[1600px]">
        {/* Header Metadata Rail */}
        <Reveal pattern="meta">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 font-mono text-[0.6875rem] uppercase tracking-widest">
            <span className="flex items-center gap-3">
              <span className="text-crimson font-bold">[05]</span>
              <span>VAMOS CONVERSAR</span>
            </span>
            <span className="inline-flex items-center gap-2 text-bone/80">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-crimson animate-pulse-dot" />
              <span>DISPONÍVEL PARA CONTRATAÇÃO</span>
            </span>
          </div>
        </Reveal>

        {/* Content Grid */}
        <div className="grid items-start gap-12 py-12 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <h2 className="display text-[clamp(2.8rem,7vw,7rem)] uppercase leading-[0.92] tracking-tighter">
              <Reveal as="span" pattern="heading">Boas ideias.</Reveal>
              <Reveal as="span" pattern="heading" delay={0.1}><span className="text-crimson">Melhor em equipe.</span></Reveal>
            </h2>
            <Reveal pattern="body" delay={0.16} className="mt-8 max-w-lg">
              <p className="text-base leading-relaxed text-bone/75 sm:text-lg">
                Estou pronto para agregar valor a times que priorizam engenharia consistente, atenção meticulosa a cada detalhe de interface e evolução técnica contínua.
              </p>
            </Reveal>
            <Reveal pattern="meta" delay={0.2} className="mt-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-ash">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-crimson shrink-0" aria-hidden="true" />
                  <span>Indaiatuba &amp; Região de Campinas</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>Presencial · Híbrido · Remoto</span>
              </div>
            </Reveal>
          </div>

          <Reveal pattern="depth" delay={0.1} className="min-w-0">
            <ContactCard />
          </Reveal>
        </div>

        {/* Social Links Row */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 py-6 sm:grid-cols-3 font-mono text-xs">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center gap-2 text-bone/80 hover:text-bone"
          >
            <GithubIcon size={16} /> <span>GitHub</span> <ArrowUpRight aria-hidden="true" size={14} className="text-ash" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center gap-2 text-bone/80 hover:text-bone"
          >
            <LinkedinIcon size={16} /> <span>LinkedIn</span> <ArrowUpRight aria-hidden="true" size={14} className="text-ash" />
          </a>
          <AnchorLink
            href="#case-agendra"
            className="col-span-2 flex min-h-[44px] items-center gap-2 text-bone/80 hover:text-crimson sm:col-span-1 sm:justify-self-end"
          >
            <span>Case Agendra</span> <ArrowUpRight aria-hidden="true" size={14} />
          </AnchorLink>
        </div>

        {/* Monumental Signature */}
        <BigName />

        {/* Bottom Micro Copyright Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs font-mono text-ash sm:flex-row">
          <span>© 2026 Lucas · Desenvolvedor Full-Stack &amp; IA</span>
          <AnchorLink href="#hero" className="flex min-h-[44px] items-center gap-2 text-bone/85 hover:text-crimson">
            <span>Voltar ao topo</span>
            <ArrowUp aria-hidden="true" size={14} />
          </AnchorLink>
        </div>
      </div>
    </footer>
  );
}
