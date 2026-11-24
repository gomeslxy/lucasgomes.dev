import { ArchitecturePipeline, type PipelineNode } from "@/components/sections/architecture-pipeline";

const NODES: readonly PipelineNode[] = [
  {
    k: "Sportlife UI",
    title: "Sportlife VFX Interface",
    desc: "Next.js App Router, Motion e microinterações na navegação do catálogo.",
  },
  {
    k: "Realtime",
    title: "Realtime Inventory Sync",
    desc: "Supabase Realtime Channels para atualizar estoque e pedidos sem recarregar a página.",
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
] as const;

export function BondsPipeline() {
  return (
    <ArchitecturePipeline
      title="Arquitetura de Engenharia — Pipeline BONDS AGENCE V4"
      nodes={NODES}
      footnotes={FOOTNOTES}
    />
  );
}
