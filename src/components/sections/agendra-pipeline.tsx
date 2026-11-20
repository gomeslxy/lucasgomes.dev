import { ArchitecturePipeline, type PipelineNode } from "@/components/sections/architecture-pipeline";

const NODES: readonly PipelineNode[] = [
  {
    k: "Omnichannel",
    title: "Ingestão Omnichannel",
    desc: "Mensagens de WhatsApp Cloud API e Instagram Direct recebidas por webhooks.",
  },
  {
    k: "Multi-LLM",
    title: "Circuit Breaker Multi-LLM",
    desc: "Roteamento e fallback entre provedores de modelos de linguagem.",
  },
  {
    k: "RAG",
    title: "RAG Vetorial pgvector",
    desc: "Busca semântica com índice HNSW sobre documentos da base de conhecimento de cada tenant.",
  },
  {
    k: "Calendar",
    title: "Smart Scheduling OAuth2",
    desc: "Google Calendar com sincronização, verificação de conflitos e tratamento de fusos horários.",
  },
  {
    k: "Copilot",
    title: "Revisão humana",
    desc: "Sugestões de resposta, classificação de conversas e revisão antes do envio.",
  },
  {
    k: "Pagamentos",
    title: "Eventos de pagamento",
    desc: "Estudo de integrações PIX e Stripe Webhooks para acompanhar estados de cobrança.",
  },
];

const FOOTNOTES = [
  "Multi-Tenant PostgreSQL RLS",
  "Upstash Redis atomic locks & debouncing",
  "Circuit Breaker Pattern",
  "Groq Whisper & Gemini Vision",
  "PLpgSQL Triggers",
] as const;

export function AgendraPipeline() {
  return (
    <ArchitecturePipeline
      title="Agendra · Mapa da arquitetura estudada"
      nodes={NODES}
      footnotes={FOOTNOTES}
    />
  );
}
