import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { ScrollStory, type StoryChapter } from "@/components/experience/scroll-story";
import { profile } from "@/lib/data";
import { Reveal } from "@/components/motion/reveal";

const APPROACH: readonly StoryChapter[] = [
  {
    id: "integridade",
    label: "Integridade",
    title: ["Segurança.", "Na raiz."],
    description: "A confiança começa nos dados. Isolamento transacional e políticas de acesso no próprio banco protegem cada operação, desde a primeira linha.",
    detail: "PostgreSQL · Row Level Security · Multi-tenant",
  },
  {
    id: "inteligencia",
    label: "Inteligência",
    title: ["Inteligência.", "Com critério."],
    description: "IA precisa de contexto e responsabilidade. Modelos com contingência, busca documental auditada e um copiloto que mantém a decisão nas mãos de quem importa.",
    detail: "Circuit breaker · Busca semântica · Revisão humana",
  },
  {
    id: "realidade",
    label: "Realidade",
    title: ["Software.", "Para o real."],
    description: "Antes do código, existe uma operação. A vivência em balcão, inventário e atendimento se transforma em software que descomplica o trabalho de verdade.",
    detail: "Entender o fluxo · Reduzir atrito · Resolver o problema",
  },
];

export function Manifesto() {
  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="relative border-t border-white/10 bg-coal text-bone">
      <div className="gutter pt-[clamp(4.5rem,8vw,8rem)] pb-10">
        <SectionLabel index="02" title="Sobre mim" aside="Filosofia de Engenharia & Princípios" tone="dark" />

        <div className="mt-10 max-w-4xl md:mt-16">
          <div>
            <h2 id="manifesto-title" className="text-[clamp(2rem,4.3vw,4.5rem)] font-medium leading-[1.1] tracking-[-0.04em]">
              <Reveal as="span" pattern="heading">Entender o problema.</Reveal>
              <Reveal as="span" pattern="heading" delay={.09}>Construir com <span className="font-serif italic text-crimson">intenção.</span></Reveal>
            </h2>
          </div>
        </div>
      </div>

      <ScrollStory chapters={APPROACH} continueTo="#manifesto-details" />

      <div id="manifesto-details" className="gutter grid gap-10 border-t border-white/10 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-7">
          <Reveal pattern="body"><p className="max-w-2xl text-base leading-relaxed text-bone/70 md:text-lg">
            Desenvolvedor Full-Stack focado em arquitetura resiliente, integridade de dados e interfaces cinematográficas de alta performance. Minha prática une o rigor técnico à vivência operacional do varejo para conceber software seguro, escalável e direto ao ponto.
          </p></Reveal>
          <Reveal pattern="depth" delay={.12}><a href={profile.github} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 items-center gap-2 text-sm text-bone underline decoration-white/25 underline-offset-4 hover:text-crimson focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson">
            Conheça meu código no GitHub <ArrowUpRight aria-hidden="true" className="size-4" />
          </a></Reveal>
        </div>
        <dl className="grid grid-cols-2 gap-6 self-start md:col-span-5 md:border-l md:border-white/10 md:pl-8">
            {[
              { key: "Base", value: "Indaiatuba · Região de Campinas" },
              { key: "Idiomas", value: "Português · Inglês B2" },
              { key: "Interesse", value: "Oportunidades em desenvolvimento" },
              { key: "Formato", value: "Presencial, híbrido ou remoto" },
            ].map((item) => (
              <div key={item.key}>
                <dt className="font-mono text-xs uppercase tracking-wider text-ash">{item.key}</dt>
                <dd className="mt-2 text-sm leading-relaxed">{item.value}</dd>
              </div>
            ))}
        </dl>
      </div>
    </section>
  );
}
