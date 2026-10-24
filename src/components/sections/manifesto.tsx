"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { CountUp } from "@/components/ui/count-up";
import { SectionLabel } from "@/components/ui/section-label";
import { cn, EASE_EXPO } from "@/lib/utils";

type Segment = { text: string; tone?: "serif" | "crimson" };

const MANIFESTO: Segment[] = [
  { text: "Tenho" },
  { text: "16 anos", tone: "crimson" },
  { text: "e escrevo software que" },
  { text: "trabalha enquanto o mundo dorme.", tone: "serif" },
  { text: "Do SaaS multi-tenant que qualifica leads no WhatsApp e processa PIX às 3 da manhã à plataforma de e-commerce com inventário realtime na borda" },
  { text: "— eu construo a ponte entre" },
  { text: "código, negócio e arquitetura escalável.", tone: "serif" },
];

type Word = { word: string; tone?: Segment["tone"] };

const WORDS: Word[] = MANIFESTO.flatMap((segment) =>
  segment.text.split(" ").map((word) => ({ word, tone: segment.tone })),
);

function ScrollWord({ word, tone, range, progress }: Word & { range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, ["0.16em", "0em"]);

  return (
    <motion.span
      style={{ opacity, y }}
      className={cn(
        "mr-[0.24em] inline-block",
        tone === "serif" && "font-serif italic tracking-[-0.01em]",
        tone === "crimson" && "text-crimson font-semibold",
      )}
    >
      {word}
    </motion.span>
  );
}

const ID_CARD = [
  { k: "Nome", v: "Lucas Gomes do Amaral" },
  { k: "Idade", v: "16 anos" },
  { k: "Base", v: "Indaiatuba — RMC, SP" },
  { k: "Idiomas", v: "PT-BR nativo · EN B2–C1" },
  { k: "Foco", v: "SaaS · IA · E-Commerce · Full-Stack" },
  { k: "Fora do terminal", v: "Musculação, estratégia, tech" },
];

const STATS = [
  { value: 16, pad: 2, suffix: "", label: "Anos de idade", note: "Em produção contínua" },
  { value: 2, pad: 2, suffix: "", label: "Projetos em produção", note: "Agendra & BONDS V4" },
  { value: 4, pad: 2, suffix: "", label: "Certificações", note: "SENAI, Callan B2, Excel" },
  { value: 4, pad: 1, suffix: "+", label: "Anos de inglês", note: "Método Callan · B2" },
];

export function Manifesto() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: textRef, offset: ["start 0.85", "end 0.45"] });

  return (
    <section id="manifesto" className="relative bg-bone text-ink">
      <div className="gutter py-[clamp(5.5rem,11vw,10.5rem)]">
        <SectionLabel index="01" title="Manifesto" aside="Quem escreve este código" tone="light" />

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 items-start">
          {/* Metadata Ledger */}
          <motion.dl
            className="order-2 grid grid-cols-2 gap-x-6 gap-y-5 self-start md:order-1 md:col-span-3 md:grid-cols-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: EASE_EXPO }}
          >
            {ID_CARD.map((row) => (
              <div key={row.k} className="flex flex-col gap-1 border-t border-ink/15 pt-3">
                <dt className="label text-smoke text-[0.62rem]">{row.k}</dt>
                <dd className="text-sm font-medium tracking-tight text-ink">{row.v}</dd>
              </div>
            ))}
          </motion.dl>

          {/* Kinetic Statement Paragraph */}
          <p
            ref={textRef}
            className="order-1 text-[clamp(1.85rem,4.2vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.035em] md:order-2 md:col-span-9"
          >
            {WORDS.map((w, i) => {
              const start = i / WORDS.length;
              const end = Math.min(1, start + 2.5 / WORDS.length);
              return <ScrollWord key={`${w.word}-${i}`} {...w} range={[start, end]} progress={scrollYProgress} />;
            })}
          </p>
        </div>

        {/* Quantified Impact Cards */}
        <div className="mt-20 grid grid-cols-2 border-t border-ink md:mt-28 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={cn(
                "group relative flex flex-col justify-between gap-8 overflow-hidden border-ink/15 p-4 md:p-6 select-none",
                i % 2 === 0 && "border-r",
                i < 2 && "border-b md:border-b-0",
                i === 1 && "md:border-r",
                i === 2 && "md:border-r",
              )}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: EASE_EXPO, delay: i * 0.07 }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-600 ease-expo group-hover:scale-y-100"
              />
              <span className="label relative text-smoke group-hover:text-ash text-[0.62rem]">
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <div className="relative">
                <CountUp
                  value={stat.value}
                  pad={stat.pad}
                  suffix={stat.suffix}
                  className="display block text-[clamp(3.2rem,8vw,7.8rem)] group-hover:text-bone leading-none"
                />
                <span className="mt-2.5 block text-sm font-semibold tracking-tight text-ink group-hover:text-bone">
                  {stat.label}
                </span>
                <span className="label mt-1 block text-[0.6rem] text-smoke group-hover:text-crimson font-medium">
                  {stat.note}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
