"use client";

import { motion } from "motion/react";
import { EASE_EXPO } from "@/lib/utils";

const NODES = [
  {
    k: "Omnichannel",
    title: "Ingestão Omnichannel",
    desc: "WhatsApp Cloud API oficial e Instagram Direct com webhook streaming.",
  },
  {
    k: "Multi-LLM",
    title: "Circuit Breaker Multi-LLM",
    desc: "Fallback automático entre Gemini Flash, Groq Whisper, Cerebras e SambaNova.",
  },
  {
    k: "RAG 788D",
    title: "RAG Vetorial pgvector",
    desc: "Indexação HNSW 788D de documentos PDF/DOCX da base de conhecimento da empresa.",
  },
  {
    k: "Calendar",
    title: "Smart Scheduling OAuth2",
    desc: "Google Calendar com sync bidirecional, zero conflito e detecção de fuso horário.",
  },
  {
    k: "Copilot",
    title: "Copilot & Lead Scoring",
    desc: "Classificação Quente (🔥)/Morno/Frio, reengajamento pg_cron e shadow mode humano.",
  },
  {
    k: "Fintech",
    title: "Fintech Conversacional",
    desc: "Cobrança instantânea PIX dentro do WhatsApp e assinaturas via Stripe Webhooks.",
  },
];

const FOOTNOTES = [
  "Multi-Tenant PostgreSQL RLS",
  "Upstash Redis atomic locks & debouncing",
  "Circuit Breaker Pattern",
  "Groq Whisper & Gemini Vision",
  "PLpgSQL Triggers",
];

export function AgendraPipeline() {
  return (
    <motion.div
      className="mt-16 border border-white/10 bg-coal/60"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1, ease: EASE_EXPO }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 md:px-5">
        <span className="label font-mono text-[0.65rem] tracking-wider uppercase text-bone">
          Arquitetura de Engenharia — Pipeline Agendra
        </span>
        <span className="label flex items-center gap-2 text-ash font-mono text-[0.62rem]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-crimson" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-crimson" />
          </span>
          CIRCUIT_BREAKER_ACTIVE
        </span>
      </div>

      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-[2.6rem] hidden h-px overflow-hidden bg-white/10 lg:block">
          <motion.div
            className="h-px w-1/4 bg-linear-to-r from-transparent via-crimson to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 3, ease: [0.76, 0, 0.24, 1], repeat: Infinity }}
          />
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {NODES.map((node, i) => (
            <motion.li
              key={node.k}
              className="relative flex min-h-[13rem] flex-col justify-between gap-4 border-b border-r border-white/10 p-4 md:p-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.1 + i * 0.07 }}
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] origin-left bg-crimson"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 1, 0] }}
                transition={{
                  duration: 3,
                  times: [0, 0.12, 0.3, 0.45],
                  ease: EASE_EXPO,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
              <div className="flex items-center gap-2.5">
                <span className="relative z-10 flex h-3 w-3 items-center justify-center rounded-full border border-bone/40 bg-ink">
                  <span className="h-1 w-1 rounded-full bg-crimson" />
                </span>
                <span className="label text-ash text-[0.6rem]">{node.k}</span>
              </div>
              <div>
                <span className="block text-base font-semibold tracking-tight text-bone leading-snug">{node.title}</span>
                <span className="mt-1.5 block text-xs leading-relaxed text-bone/60">{node.desc}</span>
              </div>
              <span className="label text-[0.6rem] text-smoke font-mono">[{String(i + 1).padStart(2, "0")}]</span>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-3 md:px-5">
        {FOOTNOTES.map((note) => (
          <span key={note} className="label text-[0.6rem] text-ash">
            <span className="text-crimson">+</span> {note}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
