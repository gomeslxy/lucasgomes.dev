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
    k: "Stripe",
    title: "Checkout & Stripe",
    desc: "Processamento seguro de pagamentos via Stripe com validação server-side de estoque, CPF e cupons.",
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
    k: "Transacional",
    title: "Admin & Resend",
    desc: "Painel administrativo para catálogo, pedidos e disparo de e-mails transacionais via Resend.",
  },
];

const FOOTNOTES = [
  "Stripe Checkout & Webhooks",
  "Supabase Realtime Channels",
  "PostgreSQL Row Level Security (RLS)",
  "Upstash Redis Rate Limiting",
  "Resend Transactional Emails",
] as const;

export function BondsPipeline() {
  return (
    <ArchitecturePipeline
      title="Bonds Agence · Fluxo da arquitetura"
      nodes={NODES}
      footnotes={FOOTNOTES}
    />
  );
}
