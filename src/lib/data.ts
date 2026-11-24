export const profile = {
  name: "Lucas",
  signature: "Lucas",
  short: "Lucas",
  city: "Indaiatuba, SP",
  country: "Brasil",
  region: "Região Metropolitana de Campinas",
  coords: "23°05′S — 47°13′W",
  role: "Full-Stack & AI Developer",
  positioning: "Desenvolvedor Full-Stack — Interfaces modernas, performance e IA aplicada",
  status: "Disponível para oportunidades em desenvolvimento",
  modes: ["Presencial · Indaiatuba / RMC", "Híbrido", "Remoto"],
  email: "la181009@gmail.com",
  phoneDisplay: "+55 (11) 98994-0080",
  whatsapp: "https://wa.me/5511989940080",
  github: "https://github.com/gomeslxy",
  githubHandle: "@gomeslxy",
  linkedin: "https://www.linkedin.com/in/lucas-gomes-amaral-8b058b391",
  agendra: "https://agendra.site",
} as const;

export type Chapter = {
  id: string;
  index: string;
  label: string;
};

export const chapters: Chapter[] = [
  { id: "hero", index: "00", label: "Index" },
  { id: "work", index: "01", label: "Projetos" },
  { id: "manifesto", index: "02", label: "Sobre" },
  { id: "stack", index: "03", label: "Stack" },
  { id: "trajetoria", index: "04", label: "Trajetória" },
  { id: "contato", index: "05", label: "Contato" },
];

export type ProjectLink = { label: string; href: string };

export type ProjectMetric = { value: string; label: string };

export type ArchitectureDecision = {
  choice: string;
  alternative: string;
  rationale: string;
};

export type EngineeringHighlight = {
  title: string;
  description: string;
};

export type Project = {
  slug: string;
  index: string;
  shortTitle: string;
  title: string;
  kicker: string;
  tagline: string;
  role: string;
  period: string;
  category: string;
  image: string;
  imageAlt: string;
  summary: string;
  technicalDescription: string;
  challenge: string;
  consideration: string;
  highlights: EngineeringHighlight[];
  features: string[];
  stack: string[];
  links: ProjectLink[];
  metrics?: ProjectMetric[];
  punchline: string;
  statusBadge: string;
  keyMetricBadge: string;
  essentialStack: string[];
  architectureDecisions: ArchitectureDecision[];
};

export const projects: Project[] = [
  {
    slug: "agendra",
    index: "01",
    shortTitle: "Agendra",
    title: "Agendra — Plataforma Omnichannel com IA & Multi-Tenancy",
    kicker: "Case de Engenharia · Arquitetura Distribuída",
    punchline: "Plataforma de atendimento e agendamento omnichannel com isolamento de dados por tenant (PostgreSQL RLS) e automação conversacional com resiliência multi-LLM.",
    statusBadge: "Estudo de Arquitetura",
    keyMetricBadge: "Isolamento RLS & Fallback Multi-LLM",
    essentialStack: ["Next.js 15 (App Router)", "PostgreSQL (RLS)", "pgvector (HNSW)", "Upstash Redis"],
    tagline: "Arquitetura multi-tenant com isolamento em nível de banco, busca semântica em base de conhecimento e circuit breaker para chamadas de IA.",
    role: "Engenharia de Software Ponta a Ponta",
    period: "2025 — Presente",
    category: "Full-Stack · IA Aplicada · Multi-Tenant",
    image: "/work/agendra.jpg",
    imageAlt: "Interface do Agendra exibindo dashboard escuro, caixa de entrada omnichannel e calendário sincronizado",
    summary:
      "Sistema de atendimento conversacional com inteligência artificial projetado para operar com isolamento estrito de dados entre empresas, busca vetorial e tolerância a falhas de provedores externos.",
    technicalDescription:
      "Aplicação Next.js 15 App Router integrada ao PostgreSQL via Supabase. O isolamento de dados é garantido na camada de banco via Row Level Security (RLS). A tolerância a falhas de IA utiliza um padrão Circuit Breaker distribuindo requisições entre Groq, Gemini e Cerebras. O contexto de cada cliente é recuperado via RAG com pgvector e índice HNSW, com sincronização atômica de agenda via Google Calendar OAuth2 e locks em Redis.",
    challenge:
      "Receber e responder dezenas de conversas em tempo real via WhatsApp e Instagram Direct sem vazar contexto documental entre diferentes empresas clientes e sem sofrer indisponibilidade por rate limits (429) das APIs de LLM.",
    consideration:
      "Garantir isolamento de dados na camada de banco (RLS) impõe overhead de checagem em cada query. A arquitetura equilibra isso com índices HNSW dedicados e cache de sessão distribuído via Redis.",
    architectureDecisions: [
      {
        choice: "PostgreSQL Row Level Security (RLS) Nativo",
        alternative: "Filtros manuais de tenant_id na camada de aplicação (Node.js/ORM)",
        rationale: "Filtros de aplicação são suscetíveis a falhas humanas em refatorações. RLS delega ao PostgreSQL a garantia matemática de que nenhuma query retorne dados de outra organização, mesmo em caso de bug na API.",
      },
      {
        choice: "Circuit Breaker Multi-LLM (Groq, Gemini, Cerebras)",
        alternative: "Dependência exclusiva da OpenAI ou Google AI",
        rationale: "Provedores de LLM sofrem picos de latência e restrições de cota. O circuit breaker detecta erros e desvia o tráfego em <800ms para modelos equivalentes, garantindo resposta sem interrupção.",
      },
      {
        choice: "pgvector integrado com índice HNSW",
        alternative: "Banco vetorial externo separado (Pinecone / Milvus)",
        rationale: "Manter vetores e dados relacionais no mesmo PostgreSQL elimina pipelines de sincronização, viabiliza transações ACID e aplica as mesmas regras de RLS sobre a busca semântica.",
      },
      {
        choice: "Upstash Redis para Locks Atômicos & Debouncing",
        alternative: "Controle de concorrência exclusivamente via locks SQL pessimistas",
        rationale: "Evita que rajadas de webhooks do WhatsApp sobrecarreguem o pool de conexões do banco e garante que agendamentos concorrentes no Google Calendar não criem conflitos de horário.",
      },
    ],
    highlights: [
      {
        title: "Isolamento Estrito Multi-Tenant com RLS",
        description:
          "Políticas de PostgreSQL Row Level Security aplicadas a todas as tabelas transacionais, auditadas para impedir vazamento cruzado de dados entre organizações.",
      },
      {
        title: "Pipeline RAG com Indexação HNSW",
        description:
          "Chunking semântico de manuais e base de conhecimento institucional, gerando embeddings de 768 dimensões com busca por similaridade de cosseno de sub-15ms.",
      },
      {
        title: "Orquestração Resiliente de Modelos (Circuit Breaker)",
        description:
          "Roteamento de prompts com fallback sequencial automático entre Groq Whisper (transcrição), Gemini Flash (visão) e Cerebras/Groq (inferência rápida).",
      },
      {
        title: "Sincronização Bidirecional & Smart Scheduling",
        description:
          "Integração OAuth2 com Google Calendar, conversão de fusos horários e locks atômicos no Redis para impedir duplo agendamento no mesmo intervalo.",
      },
    ],
    features: [
      "Isolamento transacional por tenant garantido via PostgreSQL RLS",
      "Busca semântica documental com pgvector e índice HNSW",
      "Circuit breaker distribuído tolerante a falhas entre múltiplos provedores de IA",
      "Integração oficial WhatsApp Cloud API com debouncing de webhooks",
      "Sincronização bidirecional de agenda via Google Calendar OAuth2",
      "Supervisão humana opcional (Human-in-the-Loop) para auditoria de respostas",
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
      { label: "Ver demonstração", href: "https://agendra.site" },
      { label: "Repositório GitHub", href: "https://github.com/gomeslxy/Agendra" },
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
    shortTitle: "BONDS AGENCE V4",
    title: "BONDS AGENCE V4 — E-Commerce Full-Stack & Edge Security",
    kicker: "Interface · Concorrência · Dados em Tempo Real",
    punchline: "E-commerce streetwear de alta performance com sincronização de estoque sub-segundo via WebSockets e camada de proteção contra força bruta na Edge.",
    statusBadge: "Aplicação em Produção",
    keyMetricBadge: "Zero Overselling · Edge Security",
    essentialStack: ["Next.js App Router", "Supabase Realtime", "Upstash Redis", "TypeScript"],
    tagline: "E-commerce de vestuário com atualização de estoque em tempo real, checkout com validação matemática e rate limiting na borda.",
    role: "Desenvolvimento Full-Stack & Arquitetura",
    period: "2025",
    category: "E-Commerce · Interfaces · Realtime",
    image: "/work/bonds.jpg",
    imageAlt: "Interface da loja virtual BONDS AGENCE V4 com catálogo escuro e estética Sportlife",
    summary:
      "Aplicação de e-commerce completa que sincroniza estoque em tempo real e blinda rotas críticas de autenticação e checkout contra sobrecarga e ataques automatizados.",
    technicalDescription:
      "Desenvolvido com Next.js App Router, TypeScript e Supabase. O estoque é sincronizado em tempo real entre todos os clientes conectados via Supabase Realtime Channels. A consistência de compras simultâneas é resolvida com transações atômicas no PostgreSQL, enquanto um middleware na Edge com Upstash Redis intercepta tentativas de abuso, força bruta e injeção antes de atingirem o banco.",
    challenge:
      "Em lançamentos (drops) de tiragem limitada, múltiplos compradores disputam os mesmos itens no mesmo segundo. O sistema precisa garantir zero overselling (venda de item sem estoque) sem lentidão e proteger endpoints de login e checkout contra bots.",
    consideration:
      "Atualizações de tela via WebSockets melhoram a experiência do usuário, mas a autoridade sobre o saldo de estoque precisa residir exclusivamente nas transações atômicas do PostgreSQL.",
    architectureDecisions: [
      {
        choice: "Supabase Realtime Channels (WebSockets)",
        alternative: "Polling HTTP periódico (fetch a cada 5 segundos)",
        rationale: "Reduz o overhead de rede e consumo de CPU no servidor em 95%. O cliente recebe broadcasts de alteração de estoque imediatamente após cada confirmação de pedido.",
      },
      {
        choice: "Upstash Redis Rate Limiting na Edge",
        alternative: "Rate limit na camada de banco de dados ou aplicação central",
        rationale: "Filtrar bots e tentativas de brute-force diretamente na borda (Vercel Edge Middleware) estanca requisições maliciosas antes que consumam o pool de conexões do PostgreSQL.",
      },
      {
        choice: "Transações Atômicas de Baixa de Estoque",
        alternative: "Leitura prévia seguida de update condicional na API",
        rationale: "Operações compostas de leitura-depois-escrita no Node.js criam race conditions. Transações atômicas com verificação condicional no SQL garantem que estoque zerado rejeite compras simultâneas instantaneamente.",
      },
      {
        choice: "Autenticação PKCE com SSR Server Actions",
        alternative: "Tokens JWT persistidos em LocalStorage no navegador",
        rationale: "O fluxo PKCE combinado com cookies HTTP-only protege os tokens de sessão contra ataques XSS e permite renderização segura no servidor com verificação de papéis (admin).",
      },
    ],
    highlights: [
      {
        title: "Sincronização de Estoque Sub-Segundo",
        description:
          "Push instantâneo de alterações de inventário via Realtime Channels, desabilitando o botão de compra de itens esgotados em telas ativas sem recarregar a página.",
      },
      {
        title: "Defesa Ativa na Borda (Edge Defense)",
        description:
          "Algoritmo Sliding Window Rate Limit no Upstash Redis protegendo rotas de autenticação, aplicação de cupons e submissão de checkout contra ataques de dicionário.",
      },
      {
        title: "Checkout Seguro com Validação Dual",
        description:
          "Validação algorítmica de CPF e sanitização de payloads executada no front-end para feedback imediato e revalidada estritamente no servidor.",
      },
      {
        title: "Painel Administrativo & Disparo Serverless",
        description:
          "Gestão operacional de pedidos, métricas e cupons de desconto, integrada a Edge Functions para envio automatizado de e-mails transacionais.",
      },
    ],
    features: [
      "Inventário sincronizado em tempo real via Supabase Realtime Channels",
      "Proteção de checkout e autenticação via Edge Middleware com Upstash Redis",
      "Consistência transacional atômica para prevenção de overselling",
      "Autenticação corporativa com Supabase Auth PKCE e Server Actions",
      "Dashboard administrativo para controle de catálogo, pedidos e cupons",
      "Interface fluida com Tailwind CSS, motion e design responsivo",
    ],
    stack: [
      "Next.js App Router",
      "TypeScript",
      "Supabase (PostgreSQL / Realtime / Auth)",
      "Upstash Redis",
      "Tailwind CSS",
      "Motion",
    ],
    links: [
      { label: "Ver demonstração", href: "https://bonds-agence.vercel.app" },
      { label: "Repositório GitHub", href: "https://github.com/gomeslxy/bonds-agence" },
    ],
    metrics: [
      { value: "Sync", label: "Supabase Realtime" },
      { value: "Edge", label: "Redis Rate Limit" },
      { value: "Zero", label: "Overselling Risk" },
    ],
  },
];

export type Capability = {
  index: string;
  title: string;
  lead: string;
  items: string[];
};

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "Front-End & Creative UI",
    lead: "Interfaces rápidas, responsivas e com movimento que tem intenção.",
    items: [
      "Next.js 15 (App Router)",
      "React 19",
      "TypeScript",
      "JavaScript ES6+",
      "Tailwind CSS v4",
      "Framer Motion",
      "HTML5 / CSS3",
      "UI/UX Mobile-First",
    ],
  },
  {
    index: "02",
    title: "Back-End, Dados & Cloud",
    lead: "Modelagem de dados, isolamento por tenant e integração de pagamentos.",
    items: [
      "Node.js",
      "Supabase",
      "PostgreSQL + RLS",
      "PLpgSQL Triggers",
      "Upstash Redis",
      "REST APIs",
      "Stripe + Webhooks",
      "GitHub Actions CI/CD",
    ],
  },
  {
    index: "03",
    title: "IA Aplicada & Omnichannel",
    lead: "Integração de modelos, recuperação de contexto e revisão humana de respostas.",
    items: [
      "Multi-LLM Circuit Breaker",
      "pgvector & HNSW",
      "Groq Whisper & Cerebras",
      "Gemini Vision & Flash",
      "WhatsApp Cloud API",
      "Google Calendar OAuth2",
      "pg_cron Background Jobs",
      "Classificação de conversas",
    ],
  },
  {
    index: "04",
    title: "Arquitetura de Segurança & Edge",
    lead: "Proteção contra força bruta, autenticação PKCE e controle transacional na borda.",
    items: [
      "Next.js Server Actions",
      "Supabase Auth PKCE",
      "Upstash Redis Rate Limit",
      "Supabase Realtime Channels",
      "Edge Middleware",
      "PostgreSQL RLS",
      "Row Level Concurrency",
      "Deploy Seguro & Vercel Edge",
    ],
  },
  {
    index: "05",
    title: "Dados, Negócios & Operações",
    lead: "Entendo o balcão, o estoque e a planilha — não só o deploy.",
    items: [
      "Excel Avançado (PROCV, Dinâmicas)",
      "Dashboards gerenciais",
      "Google Workspace",
      "Operação de E-Commerce",
      "Vendas consultivas",
      "Negociação",
    ],
  },
];

export const interests = [
  "Engenharia de software",
  "Arquitetura de sistemas",
  "IA aplicada & RAG",
  "Musculação",
  "Games de estratégia",
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
  skills: string[];
};

export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  place: string;
  detail: string;
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
      "Formação técnica presencial em JavaScript moderno, lógica estruturada, manipulação de DOM, requisições assíncronas e arquitetura de interfaces interativas.",
    category: "Software & Web",
    previewImageUrl: "/certificates/certificado-senai-javascript.webp",
    downloadUrl: "/certificates/certificado-senai-javascript.png",
    downloadLabel: "Download PNG",
    skills: ["JavaScript ES6+", "DOM & Eventos", "Lógica Assíncrona", "Git & Deploy"],
  },
  {
    id: "senai-ia-mkt",
    title: "Marketing Digital com Inteligência Artificial",
    issuer: 'Escola SENAI "Comendador Santoro Mirone"',
    workload: "30 horas",
    date: "Agosto 2026",
    description:
      "Aplicações comerciais de IA generativa em prospecção, esteiras de conversão, automação de comunicação comercial e estratégias de crescimento orientado a dados.",
    category: "Inteligência Artificial",
    previewImageUrl: "/certificates/certificado-senai-marketing-digital-ia.webp",
    downloadUrl: "/certificates/certificado-senai-marketing-digital-ia.png",
    downloadLabel: "Download PNG",
    skills: ["IA Generativa", "Prompt Engineering", "Funis de Conversão", "Automação Comercial"],
  },
  {
    id: "callan-english",
    title: "Callan Method General English — Stage 10 (CEFR B2)",
    issuer: "BC English School · Callan Method International",
    workload: "4+ anos de imersão",
    date: "Julho 2026",
    description:
      "Conclusão do Stage 10 do Método Callan, com nível B2 informado no certificado. Prática de conversação e leitura em inglês.",
    category: "Idiomas",
    previewImageUrl: "/certificates/certificado-ingles-callan-method.webp",
    downloadUrl: "/certificates/certificado-ingles-callan-method.pdf",
    downloadLabel: "Baixar PDF Original",
    skills: ["Inglês B2", "Comunicação em Inglês", "Compreensão Oral"],
  },
  {
    id: "excel-prof",
    title: "Microsoft Excel Profissional",
    issuer: "Global Training Technology",
    workload: "28 horas",
    date: "Maio 2026",
    description:
      "Do básico ao avançado: fórmulas lógicas e de busca (PROCV/XLOOKUP), modelagem de planilhas de estoque e custos, tabelas dinâmicas e apresentação gerencial com Dashboards interativos.",
    category: "Dados & Business",
    previewImageUrl: "/certificates/certificado-excel-profissional.webp",
    downloadUrl: "/certificates/certificado-excel-profissional.jpg",
    downloadLabel: "Download JPG",
    skills: ["PROCV / Fórmulas Complexas", "Tabelas Dinâmicas", "Dashboards Gerenciais", "Controle de Estoque"],
  },
];

export const experience: TimelineItem[] = [
  {
    period: "Set 2026 — Hoje",
    title: "Auxiliar de Atendimento ao Público, Vendas e Estoque",
    org: "Loja Física / Varejo (Contratado via Nexa Soluções)",
    place: "Centro · Indaiatuba, SP",
    detail:
      "Atendimento presencial consultivo direto ao público no balcão, negociação com clientes, operação de caixa, controle de inventário físico e reposição de estoque na loja.",
    tag: "Presencial",
  },
  {
    period: "2025 — Hoje",
    title: "Desenvolvedor & Consultor de Automação Digital",
    org: "Autônomo / Freelance",
    place: "Indaiatuba, SP",
    detail:
      "Mapeamento de gargalos em operações comerciais e criação de soluções de ponta a ponta: sistemas web, e-commerce full-stack e automação de atendimento em tempo real via WhatsApp.",
    tag: "Freelance",
  },
  {
    period: "2025 — 2026",
    title: "Engenharia de Performance & Otimização Web",
    org: "Projetos próprios e clientes",
    place: "Indaiatuba, SP",
    detail:
      "Auditoria de Core Web Vitals, otimização de bundle Next.js, arquitetura de cache na Edge e segurança anti-brute force com Upstash Redis.",
    tag: "Performance",
  },
];

export const education: TimelineItem[] = [
  {
    period: "2026",
    title: "Desenvolvimento em JavaScript",
    org: 'SENAI "Comendador Santoro Mirone"',
    place: "60h · Certificado Comprovado",
    detail:
      "Formação prática em JavaScript, interfaces modernas, validação de fluxos e arquitetura web.",
    tag: "Certificado",
  },
  {
    period: "2026",
    title: "Marketing Digital com Inteligência Artificial",
    org: 'SENAI "Comendador Santoro Mirone"',
    place: "30h · Certificado Comprovado",
    detail:
      "IA generativa aplicada a funis de venda, posicionamento comercial e esteiras de automação.",
    tag: "Certificado",
  },
  {
    period: "2022 — 2026",
    title: "General English — Método Callan (Stage 10 · B2)",
    org: "BC English School",
    place: "4+ anos · Certificado Internacional",
    detail:
      "Formação em inglês com prática de conversação, compreensão oral e leitura. Nível B2 indicado no certificado.",
    tag: "Idioma",
  },
  {
    period: "2026",
    title: "Microsoft Excel Profissional & Dashboards",
    org: "Global Training Technology",
    place: "28h · Certificado Comprovado",
    detail:
      "Do básico ao avançado: PROCV, fórmulas complexas, tabelas dinâmicas e dashboards para tomada de decisão.",
    tag: "Certificado",
  },
  {
    period: "Dez 2027",
    title: "Ensino Médio — 2ª Série",
    org: "E.E. Profª Helena de Campos Camargo",
    place: "Indaiatuba, SP",
    detail: "Cursando no período matutino. Conclusão prevista para dezembro de 2027.",
    tag: "Cursando",
  },
];

export const marqueeA = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Supabase",
  "PostgreSQL RLS",
  "Multi-LLM Circuit Breaker",
  "pgvector & HNSW",
  "Upstash Redis",
  "WhatsApp Cloud API",
  "Stripe & PIX",
];

export const marqueeB = [
  "Arquitetura Multi-Tenant",
  "Realtime Channels",
  "IA aplicada",
  "Supabase Auth PKCE",
  "Edge Rate Limiting",
  "Sportlife VFX",
  "Indaiatuba — SP",
];
