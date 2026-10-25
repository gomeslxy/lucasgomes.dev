import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { profile } from "@/lib/data";

const APPROACH = [
  {
    title: "Segurança na Raiz do Banco",
    description: "Isolamento transacional e políticas de Row Level Security (RLS) aplicadas nativamente, sem terceirizar integridade a filtros frágeis de API.",
  },
  {
    title: "IA com Resiliência & Auditoria",
    description: "Roteamento inteligente com circuit breaker para contingência de modelos, busca semântica documental auditada e modo copiloto com revisão humana.",
  },
  {
    title: "Pragmatismo de Negócio & Operação",
    description: "Vivência em balcão, inventário e atendimento comercial convertida em software objetivo que resolve gargalos reais de fluxo e conversão.",
  },
];

export function Manifesto() {
  return (
    <section id="manifesto" className="relative border-t border-white/10 bg-coal text-bone">
      <div className="gutter py-[clamp(4.5rem,8vw,8rem)]">
        <SectionLabel index="02" title="Sobre mim" aside="Filosofia de Engenharia & Princípios" tone="dark" />

        <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-[clamp(2rem,4.3vw,4.5rem)] font-medium leading-[1.1] tracking-[-0.04em]">
              Entender o problema.
              <br />
              Construir com <span className="font-serif italic text-crimson">intenção.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone/70 md:text-lg">
              Desenvolvedor Full-Stack focado em arquitetura resiliente, integridade de dados e interfaces cinematográficas de alta performance. Minha prática une o rigor técnico à vivência operacional do varejo para conceber software seguro, escalável e direto ao ponto.
            </p>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-12 items-center gap-2 text-sm text-bone underline decoration-white/25 underline-offset-4 transition-colors hover:text-crimson focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
            >
              Conheça meu código no GitHub <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>

          <dl className="grid grid-cols-2 gap-6 self-start md:col-span-4 md:grid-cols-1 md:border-l md:border-white/10 md:pl-8">
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

        <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 md:mt-16 md:grid-cols-3 md:gap-10">
          {APPROACH.map((item, index) => (
            <div key={item.title}>
              <span className="font-mono text-xs text-crimson">0{index + 1}</span>
              <h3 className="mt-3 text-lg font-medium tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
