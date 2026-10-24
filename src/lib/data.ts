export const profile = {
  name: "Lucas Gomes do Amaral",
  signature: "Lucas Gomes",
  short: "Gomes",
  age: 16,
  city: "Indaiatuba, SP",
  country: "Brasil",
  region: "Região Metropolitana de Campinas",
  coords: "23°05′S — 47°13′W",
  role: "Full-Stack & AI Developer",
  positioning: "Full-Stack & AI Developer — Criador de SaaS Multi-Tenant & E-Commerce de Alta Performance",
  status: "Disponível para projetos, freelas e oportunidades",
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
  { id: "manifesto", index: "01", label: "Manifesto" },
  { id: "work", index: "02", label: "Trabalhos" },
  { id: "stack", index: "03", label: "Stack" },
  { id: "trajetoria", index: "04", label: "Trajetória" },
  { id: "contato", index: "05", label: "Contato" },
];

export type ProjectLink = { label: string; href: string };

export type ProjectMetric = { value: string; label: string };

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
  highlights: EngineeringHighlight[];
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
    title: "Agendra — SaaS Multi-Tenant de Atendimento e Agendamento com IA",
    kicker: "SaaS B2B · AI Agents & Omnichannel Automation",
    tagline: "Plataforma SaaS multi-tenant com agentes de IA em tempo real que atendem, qualificam leads, negociam horários e processam pagamentos diretamente pelo WhatsApp e Instagram Direct.",
    role: "Founder & Lead Developer",
    period: "2025 — Presente",
    category: "SaaS B2B · AI Agents & Omnichannel Automation",
    image: "/work/agendra.jpg",
    imageAlt: "Painel escuro do Agendra com inbox de WhatsApp, funil de vendas e calendário de reuniões",
    summary:
      "Plataforma SaaS multi-tenant com agentes de IA em tempo real que atendem, qualificam leads, negociam horários e processam pagamentos diretamente pelo WhatsApp e Instagram Direct.",
    technicalDescription:
      "Arquitetura full-stack construída em Next.js 15 (App Router), React 19 e Supabase (PostgreSQL + PLpgSQL) para automação comercial de ponta a ponta. Conta com um roteador Multi-LLM resiliente (padrão Circuit Breaker) que alterna automaticamente entre provedores para garantir alta disponibilidade, motor RAG vetorial para leitura de documentos da empresa e sincronização bidirecional em tempo real com Google Calendar.",
    highlights: [
      {
        title: "Multi-Provider AI Router (Circuit Breaker)",
        description:
          "Roteamento inteligente e fallback automático entre Gemini Flash, Groq, Cerebras e SambaNova, além de transcrição nativa de notas de voz (Groq Whisper) e análise de imagens enviadas no chat (Gemini Vision).",
      },
      {
        title: "RAG Vetorial (pgvector HNSW 788D)",
        description:
          "Ingestão e indexação semântica de documentos (PDF/DOCX) para respostas baseadas na base de conhecimento específica de cada empresa.",
      },
      {
        title: "Omnichannel & Smart Scheduling",
        description:
          "Integração oficial com WhatsApp Cloud API e Instagram Direct + sincronização bidirecional via OAuth2 com Google Calendar (verificação de conflitos, alinhamento de fuso horário e reagendamento automático).",
      },
      {
        title: "Copilot Mode (Shadow Mode) & Lead Scoring",
        description:
          "Classificação automática de conversas por sentimento e urgência em Quente (🔥), Morno (🟡) ou Frio (❄️), motor de reengajamento automático em background (pg_cron) para leads inativos e modo copiloto para revisão/edição humana antes do envio.",
      },
      {
        title: "Conversational Fintech & Billing",
        description:
          "Geração e verificação instantânea de cobranças PIX dentro do próprio chat do WhatsApp e controle de planos/limites de uso por assinatura via Stripe Webhooks.",
      },
      {
        title: "Isolamento Multi-Tenant & Concorrência",
        description:
          "Isolamento rigoroso de dados por tenant no banco via PostgreSQL Row Level Security (RLS), migrações/triggers em PLpgSQL e debouncing/locks atômicos com Upstash Redis.",
      },
    ],
    features: [
      "Multi-Provider AI Router com Circuit Breaker (Gemini, Groq, Cerebras, SambaNova)",
      "Motor RAG Vetorial com pgvector HNSW 788D para base de conhecimento documental",
      "Omnichannel oficial (WhatsApp Cloud API + Instagram Direct) e Sync Google Calendar OAuth2",
      "Lead Scoring preditivo (Quente/Morno/Frio), pg_cron para reengajamento e Modo Copiloto",
      "Fintech conversacional com PIX instantâneo no chat e assinaturas via Stripe Webhooks",
      "Isolamento Multi-Tenant estrito via PostgreSQL RLS e debouncing com Upstash Redis",
    ],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "TailwindCSS v4",
      "Supabase (PostgreSQL / pgvector / Edge Functions)",
      "Upstash Redis",
      "Multi-LLM (Gemini / Groq / Cerebras / SambaNova)",
      "WhatsApp Cloud API",
      "Google Calendar OAuth2",
      "Stripe & PIX",
      "Framer Motion 12",
    ],
    links: [
      { label: "Live Demo", href: "https://agendra.site" },
      { label: "Repositório GitHub", href: "https://github.com/gomeslxy/Agendra" },
    ],
    metrics: [
      { value: "24/7", label: "Automação Omnichannel" },
      { value: "788D", label: "pgvector HNSW Index" },
      { value: "0", label: "Conflitos de Agenda" },
    ],
  },
  {
    slug: "bonds",
    index: "02",
    shortTitle: "BONDS AGENCE V4",
    title: "BONDS AGENCE V4 — E-Commerce Streetwear de Alta Performance",
    kicker: "Full-Stack E-Commerce · Sportlife VFX & Realtime Inventory",
    tagline: "Plataforma de e-commerce full-stack para marcas de streetwear com linguagem visual \"Sportlife VFX\", sincronização de estoque em tempo real, checkout inteligente e segurança reforçada na borda (Edge).",
    role: "Full-Stack Developer & Architect",
    period: "2025",
    category: "Full-Stack E-Commerce · Sportlife VFX & Realtime Inventory",
    image: "/work/bonds.jpg",
    imageAlt: "Interface de e-commerce streetwear BONDS AGENCE V4 com visual Sportlife VFX em tons escuros",
    summary:
      "Plataforma de e-commerce full-stack para marcas de streetwear com linguagem visual \"Sportlife VFX\", sincronização de estoque em tempo real, checkout inteligente e segurança reforçada na borda (Edge).",
    technicalDescription:
      "O BONDS AGENCE V4 é uma plataforma completa de e-commerce construída com Next.js 14 (App Router), TypeScript e Supabase. Une animações fluidas (Framer Motion) e design de alta conversão com controle transacional de estoque em tempo real, painel administrativo completo e proteção serverless contra ataques de força bruta.",
    highlights: [
      {
        title: "Realtime Inventory & Order Sync",
        description:
          "Uso de Supabase Realtime Channels para atualização imediata de níveis de estoque e status de pedidos na interface sem recarregar a página.",
      },
      {
        title: "Smart Checkout",
        description:
          "Fluxo de checkout otimizado com validação matemática de CPF (client-side e server-side) e máscaras dinâmicas de autoformatação.",
      },
      {
        title: "Hardened Security & Rate Limiting",
        description:
          "Autenticação Supabase Auth com fluxo PKCE e sessão SSR via Next.js Server Actions, políticas estritas de PostgreSQL Row Level Security (RLS), middleware de verificação de sessão administrativa na Edge e rate limiting / bloqueio de IP anti-brute force com Upstash Redis nos endpoints críticos (Login, Signup, Admin e Verificação).",
      },
      {
        title: "Admin Dashboard & Automação de E-mails",
        description:
          "Painel de controle centralizado para gestão de estoque, monitoramento de pedidos em tempo real, criação de cupons promocionais e disparo automatizado de e-mails transacionais (status do pedido e recuperação de conta) via Supabase Edge Functions.",
      },
    ],
    features: [
      "Realtime Inventory com Supabase Channels para atualização instantânea sem reload",
      "Checkout inteligente com validação matemática de CPF e máscaras dinâmicas",
      "Segurança na Edge: Supabase Auth PKCE, SSR Server Actions e Upstash Redis Rate Limiting",
      "Painel administrativo centralizado com gestão de estoque, métricas e cupons",
      "Disparo de e-mails transacionais serverless via Supabase Edge Functions",
      "Design de alta conversão com animações fluidas Framer Motion e estética Sportlife VFX",
    ],
    stack: [
      "Next.js 14 (App Router)",
      "TypeScript",
      "Supabase (PostgreSQL / Realtime / Auth PKCE / Edge Functions)",
      "Upstash Redis",
      "TailwindCSS",
      "Framer Motion",
      "Lucide Icons",
    ],
    links: [
      { label: "Live Demo", href: "https://bonds-agence.vercel.app" },
      { label: "Repositório GitHub", href: "https://github.com/gomeslxy/bonds-agence" },
    ],
    metrics: [
      { value: "<100ms", label: "Sync Realtime Supabase" },
      { value: "PKCE", label: "Auth & SSR Security" },
      { value: "Edge", label: "Redis Rate Limiting" },
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
    lead: "Arquitetura multi-tenant, segurança no banco e pagamentos que não falham.",
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
    lead: "Roteador Multi-LLM, RAG vetorial e integrações com canais comerciais reais.",
    items: [
      "Multi-LLM Circuit Breaker",
      "pgvector HNSW 788D",
      "Groq Whisper & Cerebras",
      "Gemini Vision & Flash",
      "WhatsApp Cloud API",
      "Google Calendar OAuth2",
      "pg_cron Background Jobs",
      "Lead Scoring Preditivo",
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
      "Conclusão com aproveitamento do Stage 10 do Método Callan (equivalente ao Nível B2 no Quadro Comum Europeu de Referência para Línguas). Fluência oral imediata e proficiência em documentação técnica.",
    category: "Idiomas",
    previewImageUrl: "/certificates/certificado-ingles-callan-method.webp",
    downloadUrl: "/certificates/certificado-ingles-callan-method.pdf",
    downloadLabel: "Baixar PDF Original",
    skills: ["Inglês Fluente B2", "Comunicação Técnica Internacional", "Escuta & Resposta Rápida"],
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
      "Fluência conversacional, leitura técnica imediata e capacidade de atuar em projetos internacionais.",
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
  "pgvector HNSW 788D",
  "Upstash Redis",
  "WhatsApp Cloud API",
  "Stripe & PIX",
];

export const marqueeB = [
  "SaaS Multi-Tenant",
  "Realtime Channels",
  "Automação 24/7",
  "Supabase Auth PKCE",
  "Edge Rate Limiting",
  "Sportlife VFX",
  "Indaiatuba — SP",
];
