export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucasgomes.dev").replace(/\/+$/, "");

export const profile = {
  name: "Lucas",
  fullName: "Lucas Gomes",
  signature: "Lucas",
  city: "Indaiatuba, SP",
  country: "Brasil",
  region: "Região Metropolitana de Campinas",
  role: "Desenvolvedor Full-Stack",
  status: "Disponível para contratação",
  modes: ["Presencial · Indaiatuba / RMC", "Híbrido", "Remoto"],
  email: "la181009@gmail.com",
  phoneDisplay: "+55 (11) 98994-0080",
  phoneE164: "+5511989940080",
  whatsapp: "https://wa.me/5511989940080",
  github: "https://github.com/gomeslxy",
  githubHandle: "@gomeslxy",
  linkedin: "https://www.linkedin.com/in/lucas-gomes-amaral-8b058b391",
} as const;

export type Chapter = {
  id: string;
  index: string;
  label: string;
};

export const chapters: Chapter[] = [
  { id: "hero", index: "00", label: "Início" },
  { id: "work", index: "01", label: "Projetos" },
  { id: "trajetoria", index: "02", label: "Trajetória" },
  { id: "stack", index: "03", label: "Stack" },
  { id: "contato", index: "04", label: "Contato" },
];

export type ProjectLink = { label: string; href: string };

export type ProjectMetric = { value: string; label: string };

export type ProjectMechanism = {
  label: string;
  detail: string;
};

export type ArchitectureDecision = {
  choice: string;
  alternative: string;
  rationale: string;
};

export type Project = {
  slug: string;
  index: string;
  shortTitle: string;
  title: string;
  domain: string;
  role: string;
  period: string;
  category: string;
  image: string;
  imageAlt: string;
  punchline: string;
  audience: string;
  problem: string;
  mechanisms: ProjectMechanism[];
  flowSteps: string[];
  statusBadge: string;
  statusTone?: "completed" | "study";
  essentialStack: string[];
  technicalDescription: string;
  challenge: string;
  consideration: string;
  architectureDecisions: ArchitectureDecision[];
  features: string[];
  stack: string[];
  links: ProjectLink[];
  metrics?: ProjectMetric[];
};

export const projects: Project[] = [
  {
    slug: "agendra",
    index: "01",
    shortTitle: "Agendra",
    title: "Agendra — Plataforma Omnichannel com IA & Multi-Tenancy",
    domain: "www.agendra.site",
    role: "Arquitetura e Desenvolvimento Full-Stack",
    period: "2025 — Presente",
    category: "Full-Stack · IA · Multi-Tenant",
    image: "/work/agendra.jpg",
    imageAlt: "Interface do Agendra exibindo página inicial, conversa no WhatsApp com IA e agenda sincronizada",
    punchline:
      "Projeto de estudo full-stack de qualificação de leads e agendamento automatizado via WhatsApp com IA, busca semântica e isolamento multi-tenant.",
    audience:
      "Empresas com atendimento comercial e agendamento por mensagens.",
    problem:
      "Qualificar leads e automatizar agendamentos no WhatsApp com IA isolando dados e documentos de diferentes empresas no mesmo banco, sem interrupções quando um provedor de LLM atinge limite de requisições (429).",
    mechanisms: [
      {
        label: "PostgreSQL RLS",
        detail:
          "Isolamento por empresa aplicado diretamente nas tabelas transacionais, sem depender de filtro manual na API.",
      },
      {
        label: "Fallback Multi-LLM e RAG",
        detail:
          "Circuit breaker entre Groq, Gemini e Cerebras (<800ms em falhas) e busca vetorial com pgvector (HNSW).",
      },
      {
        label: "Agenda e Concorrência",
        detail:
          "Integração OAuth2 com Google Calendar e locks atômicos no Upstash Redis contra duplo agendamento.",
      },
    ],
    flowSteps: [
      "Webhook WhatsApp/IG",
      "Redis Debounce",
      "RAG pgvector",
      "Multi-LLM Fallback",
      "Google Calendar",
    ],
    statusBadge: "Projeto de Estudo",
    statusTone: "study",
    essentialStack: [
      "Next.js 15",
      "TypeScript",
      "Supabase (PostgreSQL / RLS)",
      "pgvector (HNSW)",
      "Upstash Redis",
      "WhatsApp Cloud API",
    ],
    technicalDescription:
      "Projeto de estudo em Next.js 15 App Router, TypeScript e Supabase (PostgreSQL). Realiza qualificação de leads e agendamento automatizado via WhatsApp Cloud API com isolamento multi-tenant por Row Level Security (RLS), busca semântica via pgvector (HNSW), circuit breaker entre Groq, Gemini e Cerebras, agenda via Google Calendar OAuth2 e locks atômicos no Upstash Redis.",
    challenge:
      "Receber e responder conversas em tempo real via WhatsApp e Instagram Direct sem vazar contexto documental entre empresas diferentes e sem sofrer indisponibilidade por rate limits (429) das APIs de LLM.",
    consideration:
      "O RLS adiciona verificação em cada consulta; índices HNSW e cache de sessão no Redis reduzem o custo de leitura.",
    architectureDecisions: [
      {
        choice: "PostgreSQL Row Level Security (RLS) Nativo",
        alternative: "Filtros manuais de tenant_id na camada de aplicação (Node.js/ORM)",
        rationale:
          "Filtros de aplicação são suscetíveis a esquecimentos em refatorações. RLS delega ao PostgreSQL a garantia de que nenhuma query retorne dados de outra organização, mesmo em caso de erro na API.",
      },
      {
        choice: "Circuit Breaker Multi-LLM (Groq, Gemini, Cerebras)",
        alternative: "Dependência exclusiva de um único provedor de IA",
        rationale:
          "Provedores de LLM sofrem picos de latência e restrições de cota. O circuit breaker detecta erros e desvia o tráfego em <800ms para modelos equivalentes.",
      },
      {
        choice: "pgvector integrado com índice HNSW",
        alternative: "Banco vetorial externo separado (Pinecone / Milvus)",
        rationale:
          "Manter vetores e dados relacionais no mesmo PostgreSQL elimina sincronização externa, mantém transações ACID e aplica as mesmas regras de RLS sobre a busca semântica.",
      },
      {
        choice: "Upstash Redis para Locks Atômicos e Debouncing",
        alternative: "Controle de concorrência apenas via locks SQL pessimistas",
        rationale:
          "Evita que rajadas de webhooks do WhatsApp saturem o pool de conexões do banco e impede que agendamentos concorrentes no Google Calendar criem conflito de horário.",
      },
    ],
    features: [
      "Isolamento transacional por tenant via PostgreSQL RLS",
      "Busca semântica documental com pgvector e índice HNSW",
      "Circuit breaker distribuído entre Groq, Gemini e Cerebras",
      "Integração oficial WhatsApp Cloud API com debouncing de webhooks",
      "Sincronização bidirecional de agenda via Google Calendar OAuth2",
      "Supervisão humana opcional (Human-in-the-Loop) antes do envio",
    ],
    stack: [
      "Next.js 15 (App Router)",
      "React 19",
      "TypeScript",
      "Supabase (PostgreSQL / pgvector)",
      "Upstash Redis",
      "Tailwind CSS v4",
      "WhatsApp Cloud API",
      "Google Calendar OAuth2",
    ],
    links: [
      { label: "Acessar projeto", href: "https://www.agendra.site" },
      { label: "Ver código", href: "https://github.com/gomeslxy/Agendra" },
    ],
    metrics: [
      { value: "RLS", label: "Isolamento no Banco" },
      { value: "HNSW", label: "Busca Vetorial" },
      { value: "<800ms", label: "Fallback Multi-LLM" },
    ],
  },
  {
    slug: "bonds",
    index: "02",
    shortTitle: "Bonds Agence",
    title: "Bonds Agence — E-Commerce Full-Stack & Edge Security",
    domain: "bonds-agence.vercel.app",
    role: "Desenvolvimento Full-Stack e Arquitetura",
    period: "2025",
    category: "E-Commerce · Realtime · Edge Security",
    image: "/work/bonds.jpg",
    imageAlt: "Interface da loja virtual Bonds Agence com destaque Sportlife e chamada para explorar coleção",
    punchline:
      "E-commerce full-stack com checkout Stripe, estoque em tempo real no Supabase, e-mails transacionais via Resend e rate limiting na Edge.",
    audience:
      "Loja virtual de vestuário streetwear com lançamentos de estoque limitado.",
    problem:
      "Evitar venda de peças esgotadas (overselling) durante acessos simultâneos em lançamentos limitados e proteger login, cupons e checkout contra abuso automatizado.",
    mechanisms: [
      {
        label: "Checkout Stripe e SQL Atômico",
        detail:
          "Pagamentos integrados ao Stripe com validação e baixa atômica de estoque no PostgreSQL contra overselling.",
      },
      {
        label: "Supabase Realtime e Auth PKCE",
        detail:
          "Atualização imediata de saldo via WebSockets e autenticação SSR com Server Actions e cookies HTTP-only.",
      },
      {
        label: "Edge Security e Resend",
        detail:
          "Rate limiting (Sliding Window) com Upstash Redis no Edge Middleware e envio de e-mails transacionais via Resend.",
      },
    ],
    flowSteps: [
      "Catálogo Next.js",
      "Edge Rate Limit",
      "Checkout Stripe",
      "Baixa Atômica SQL",
      "Realtime & Resend",
    ],
    statusBadge: "Finalizado",
    statusTone: "completed",
    essentialStack: [
      "Next.js App Router",
      "TypeScript",
      "Stripe",
      "Supabase",
      "Resend",
      "Upstash Redis",
    ],
    technicalDescription:
      "Arquitetura e-commerce desenvolvida com Next.js App Router, TypeScript, Stripe, Supabase e Resend. Pagamentos e confirmação de pedidos operam sobre transações atômicas no PostgreSQL e canais Realtime de estoque, com proteção na borda via Upstash Redis e e-mails transacionais via Resend.",
    challenge:
      "Em lançamentos de tiragem limitada, múltiplos compradores disputam os mesmos itens no mesmo segundo. O sistema precisa impedir overselling (venda de item sem estoque) e proteger endpoints de login e checkout contra bots.",
    consideration:
      "WebSockets atualizam a interface em tempo real, mas a consistência final do estoque depende sempre da transação atômica no PostgreSQL.",
    architectureDecisions: [
      {
        choice: "Supabase Realtime Channels (WebSockets)",
        alternative: "Polling HTTP periódico (fetch a cada 5 segundos)",
        rationale:
          "Elimina requisições periódicas desnecessárias de polling. O cliente recebe broadcasts de alteração de estoque logo após cada confirmação de pedido.",
      },
      {
        choice: "Upstash Redis Rate Limiting na Edge",
        alternative: "Rate limit na camada de banco de dados ou aplicação central",
        rationale:
          "Filtrar bots e tentativas de força bruta diretamente na borda (Vercel Edge Middleware) barra requisições maliciosas antes que consumam o pool de conexões do PostgreSQL.",
      },
      {
        choice: "Transações Atômicas de Baixa de Estoque",
        alternative: "Leitura prévia seguida de update condicional na API",
        rationale:
          "Operações separadas de leitura-depois-escrita no Node.js criam race conditions. Transações atômicas com verificação condicional no SQL rejeitam compras simultâneas quando o estoque zera.",
      },
      {
        choice: "Autenticação PKCE com SSR Server Actions",
        alternative: "Tokens JWT persistidos em LocalStorage no navegador",
        rationale:
          "O fluxo PKCE com cookies HTTP-only protege tokens contra XSS e viabiliza verificação de papéis administrativos diretamente no servidor.",
      },
    ],
    features: [
      "Checkout e confirmação de pagamentos integrados ao Stripe",
      "Inventário sincronizado em tempo real via Supabase Realtime Channels",
      "Proteção de checkout e autenticação via Edge Middleware com Upstash Redis",
      "Consistência transacional atômica para prevenção de overselling",
      "Autenticação com Supabase Auth PKCE e Server Actions",
      "Validação dupla de CPF e envio de e-mails transacionais com Resend",
    ],
    stack: [
      "Next.js 15 (App Router)",
      "TypeScript",
      "Stripe",
      "Supabase (PostgreSQL / Realtime / Auth)",
      "Resend",
      "Upstash Redis",
      "Tailwind CSS",
      "Motion",
    ],
    links: [
      { label: "Acessar projeto", href: "https://bonds-agence.vercel.app" },
      { label: "Ver código", href: "https://github.com/gomeslxy/bonds-agence" },
    ],
    metrics: [
      { value: "WS", label: "Estoque Realtime" },
      { value: "Edge", label: "Redis Rate Limit" },
      { value: "SQL", label: "Baixa atômica" },
    ],
  },
];

export type Capability = {
  index: string;
  title: string;
  whatIBuild: string;
  appliedIn: string;
  items: string[];
};

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "Front-End",
    whatIBuild:
      "Interfaces responsivas com App Router, formulários validados, dashboards e componentes acessíveis.",
    appliedIn: "Agendra, Bonds Agence e este portfólio",
    items: [
      "Next.js 15 (App Router & Server Actions)",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Motion (motion/react)",
      "HTML5 & CSS3",
    ],
  },
  {
    index: "02",
    title: "Back-End e Dados",
    whatIBuild:
      "Modelagem relacional, isolamento multi-tenant com RLS, transações atômicas, canais realtime e rate limiting na Edge.",
    appliedIn: "Agendra e Bonds Agence",
    items: [
      "PostgreSQL",
      "Row Level Security (RLS)",
      "Supabase (Auth PKCE, Realtime & Edge Functions)",
      "Upstash Redis",
      "Node.js",
      "PLpgSQL & pg_cron",
    ],
  },
  {
    index: "03",
    title: "IA, Integrações e Deploy",
    whatIBuild:
      "Busca semântica (RAG), fallback entre provedores de LLM, pagamentos, webhooks, OAuth2 e e-mails transacionais.",
    appliedIn: "Agendra, Bonds Agence e deploy na Vercel",
    items: [
      "pgvector (HNSW)",
      "Groq, Gemini & Cerebras (Circuit Breaker)",
      "WhatsApp Cloud API & Google Calendar OAuth2",
      "Stripe (Checkout & Webhooks)",
      "Resend (E-mails Transacionais)",
      "Git, GitHub Actions & Vercel",
    ],
  },
];

export type WorkingPrinciple = {
  index: string;
  title: string;
  detail: string;
};

export const workingStyle: WorkingPrinciple[] = [
  {
    index: "01",
    title: "Decisões fundamentadas",
    detail:
      "Escolho tecnologias de acordo com o problema e documento os trade-offs de cada solução.",
  },
  {
    index: "02",
    title: "Projetos abertos",
    detail:
      "Os projetos do portfólio têm repositório público e ambiente publicado para avaliação.",
  },
  {
    index: "03",
    title: "Comunicação objetiva",
    detail:
      "Clareza para alinhar prazos, reportar bloqueios técnicos e trabalhar com revisão de código em equipe.",
  },
];

export type CertificateItem = {
  id: string;
  title: string;
  issuer: string;
  workload?: string;
  date: string;
  description: string;
  category: "Software & Web" | "Inteligência Artificial" | "Idiomas" | "Dados & Business";
  previewImageUrl: string;
  downloadUrl: string;
  downloadLabel: string;
};

export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  place: string;
  detail: string;
  highlights?: string[];
  tag: string;
};

export const certificates: CertificateItem[] = [
  {
    id: "senai-js",
    title: "Desenvolvimento em JavaScript",
    issuer: 'Escola SENAI "Comendador Santoro Mirone"',
    workload: "60 horas",
    date: "Junho 2026",
    description:
      "Formação presencial em JavaScript moderno, lógica estruturada, manipulação de DOM e requisições assíncronas.",
    category: "Software & Web",
    previewImageUrl: "/certificates/certificado-senai-javascript.webp",
    downloadUrl: "/certificates/certificado-senai-javascript.png",
    downloadLabel: "Baixar PNG",
  },
  {
    id: "senai-ia-mkt",
    title: "Marketing Digital com Inteligência Artificial",
    issuer: 'Escola SENAI "Comendador Santoro Mirone"',
    workload: "30 horas",
    date: "Agosto 2026",
    description:
      "Aplicação prática de IA generativa em automação de comunicação comercial e fluxos orientados a dados.",
    category: "Inteligência Artificial",
    previewImageUrl: "/certificates/certificado-senai-marketing-digital-ia.webp",
    downloadUrl: "/certificates/certificado-senai-marketing-digital-ia.png",
    downloadLabel: "Baixar PNG",
  },
  {
    id: "callan-english",
    title: "Callan Method General English — Stage 10 (CEFR B2)",
    issuer: "BC English School · Callan Method International",
    workload: "4+ anos de imersão",
    date: "Julho 2026",
    description:
      "Conclusão do Stage 10 do Método Callan com nível CEFR B2 indicado no certificado para conversação, escuta e leitura técnica.",
    category: "Idiomas",
    previewImageUrl: "/certificates/certificado-ingles-callan-method.webp",
    downloadUrl: "/certificates/certificado-ingles-callan-method.pdf",
    downloadLabel: "Baixar PDF",
  },
  {
    id: "excel-prof",
    title: "Microsoft Excel Profissional",
    issuer: "Global Training Technology",
    workload: "28 horas",
    date: "Maio 2026",
    description:
      "Fórmulas lógicas e de busca (PROCV/XLOOKUP), planilhas de estoque e custos, tabelas dinâmicas e dashboards gerenciais.",
    category: "Dados & Business",
    previewImageUrl: "/certificates/certificado-excel-profissional.webp",
    downloadUrl: "/certificates/certificado-excel-profissional.jpg",
    downloadLabel: "Baixar JPG",
  },
];

export const experience: TimelineItem[] = [
  {
    period: "2025 — Hoje",
    title: "Desenvolvedor Full-Stack & Automação",
    org: "Autônomo / Projetos Próprios e Clientes",
    place: "Indaiatuba, SP",
    detail:
      "Desenvolvimento de aplicações web em Next.js e TypeScript, e-commerce com estoque em tempo real, automações de atendimento via WhatsApp e otimização de performance e segurança na Edge.",
    highlights: [
      "Arquitetura multi-tenant com PostgreSQL RLS, busca semântica (pgvector/HNSW) e fallback multi-LLM.",
      "E-commerce full-stack com estoque em tempo real via WebSockets, baixa atômica em SQL e rate limiting na Edge.",
      "Integrações com WhatsApp Cloud API, Google Calendar OAuth2 e deploy contínuo na Vercel.",
    ],
    tag: "Full-Stack · Freelance",
  },
];

export const education: TimelineItem[] = [
  {
    period: "Conclusão prevista: Dez 2027",
    title: "Ensino Médio — 2ª Série",
    org: "E.E. Profª Helena de Campos Camargo",
    place: "Indaiatuba, SP",
    detail:
      "Cursando no período matutino, conciliando a rotina escolar com o desenvolvimento de projetos full-stack e a formação técnica contínua.",
    tag: "Em andamento",
  },
];
