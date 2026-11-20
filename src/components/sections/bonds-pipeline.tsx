import { ArchitecturePipeline, type PipelineNode } from "@/components/sections/architecture-pipeline";

const NODES: readonly PipelineNode[] = [
  {
    k: "Interface",
    title: "Interface & Catálogo",
    desc: "Next.js App Router, Motion e microinterações na navegação do catálogo.",
  },
  {
    k: "Realtime",
    title: "Realtime Inventory Sync",
    desc: "Supabase Realtime Channels para atualizar estoque e pedidos sem recarregar a página.",
  },
  {
    k: "Checkout",
    title: "Validação de checkout",
    desc: "Validação de CPF no cliente e no servidor, com máscaras de entrada e sanitização de dados.",
  },
  {
    k: "PKCE Auth",
    title: "Auth PKCE & SSR Session",
    desc: "Autenticação Supabase Auth via Next.js Server Actions com mitigação de CSRF e token exchange seguro.",
  },
  {
    k: "Edge Security",
    title: "Rate limiting na Edge",
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
      title="BONDS AGENCE V4 · Fluxo da arquitetura"
      nodes={NODES}
      footnotes={FOOTNOTES}
    />
  );
}
