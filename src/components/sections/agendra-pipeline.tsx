const NODES = [
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
];

export function AgendraPipeline() {
  return (
    <div className="mt-16 border border-white/10 bg-coal/60">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-3 md:px-5">
        <span className="label font-mono text-[0.65rem] tracking-wider uppercase text-bone">
          Agendra · Mapa da arquitetura estudada
        </span>
        <span className="label flex items-center gap-2 text-ash font-mono text-[0.62rem]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-crimson" />
          FLUXO ILUSTRATIVO
        </span>
      </div>

      <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {NODES.map((node, i) => (
          <li
            key={node.k}
            className="relative flex min-h-[13rem] flex-col justify-between gap-4 border-b border-r border-white/10 p-4 md:p-5"
          >
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
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-3 md:px-5">
        {FOOTNOTES.map((note) => (
          <span key={note} className="label text-[0.6rem] text-ash">
            <span className="text-crimson">+</span> {note}
          </span>
        ))}
      </div>
    </div>
  );
}
