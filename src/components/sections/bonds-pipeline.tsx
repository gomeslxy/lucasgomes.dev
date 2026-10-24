"use client";

import { motion } from "motion/react";
import { EASE_EXPO } from "@/lib/utils";

const NODES = [
  {
    k: "Sportlife UI",
    title: "Sportlife VFX Interface",
    desc: "Next.js 14 App Router, animações fluidas Framer Motion e micro-interações de alta conversão.",
  },
  {
    k: "Realtime",
    title: "Realtime Inventory Sync",
    desc: "Supabase Realtime Channels com atualização sub-100ms de estoque e pedidos sem reload.",
  },
  {
    k: "Smart Checkout",
    title: "Checkout Matemático",
    desc: "Validação matemática de CPF em tempo real (client e server) com máscaras dinâmicas de input.",
  },
  {
    k: "PKCE Auth",
    title: "Auth PKCE & SSR Session",
    desc: "Autenticação Supabase Auth via Next.js Server Actions com mitigação de CSRF e token exchange seguro.",
  },
  {
    k: "Hardened Edge",
    title: "Anti-Brute Force na Borda",
    desc: "Rate limiting por IP com Upstash Redis nos endpoints críticos (/login, /signup, /admin, verificação).",
  },
  {
    k: "Admin & Edge",
    title: "Admin & Edge Functions",
    desc: "Painel de controle para estoque, cupons e disparo serverless de e-mails transacionais de pedidos.",
  },
];

const FOOTNOTES = [
  "Supabase Realtime Channels",
  "PostgreSQL Row Level Security (RLS)",
  "Upstash Redis Rate Limiting",
  "Next.js Server Actions SSR",
  "Supabase Edge Functions",
];

export function BondsPipeline() {
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
          Arquitetura de Engenharia — Pipeline BONDS AGENCE V4
        </span>
        <span className="label flex items-center gap-2 text-ash font-mono text-[0.62rem]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-crimson" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-crimson" />
          </span>
          REALTIME_CHANNEL_ACTIVE
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
