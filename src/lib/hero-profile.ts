import { profile } from "@/lib/data";

/** Content for the hero profile card. Scannable technical identity and direct proof links. */
export const heroProfile = {
  displayName: "Lucas",
  handle: profile.githubHandle,
  avatarSrc: "/profile/avatar.webp" as string,
  bannerSrc: "/profile/banner.webp",
  bannerAlt: "Banner de Lucas — Desenvolvedor Full-Stack",
  initials: "LG",
  status: profile.status,
  role: profile.role,
  headline: "Full-Stack com Next.js, TypeScript e PostgreSQL",
  bio: "Desenvolvo aplicações web do front-end ao banco de dados, com foco em tempo real, segurança e integrações de IA. Busco uma oportunidade para atuar em um time de desenvolvimento.",
  proofs: [
    {
      id: "agendra",
      label: "Agendra",
      detail: "Multi-tenant RLS · RAG pgvector · Fallback multi-LLM",
      href: "#case-agendra",
      tag: "Estudo técnico",
    },
    {
      id: "bonds",
      label: "BONDS AGENCE",
      detail: "E-commerce realtime · Baixa atômica SQL · Rate limit na Edge",
      href: "#case-bonds",
      tag: "Em produção",
    },
    {
      id: "background",
      label: "Experiência e formação",
      detail: "Inglês B2 (Callan) · Cursos SENAI · Experiência no varejo",
      href: "#trajetoria",
      tag: "Perfil",
    },
  ],
} as const;
