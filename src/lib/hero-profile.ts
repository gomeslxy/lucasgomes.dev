import { profile } from "@/lib/data";

/** Structured content for the hero profile card. */
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
      detail: "Qualificação e agenda com IA · Supabase · Redis · WhatsApp API",
      href: "#case-agendra",
      tag: "Projeto de estudo",
      tone: "default" as const,
    },
    {
      id: "bonds",
      label: "Bonds Agence",
      detail: "E-commerce Next.js · Stripe · Supabase Realtime · Resend",
      href: "#case-bonds",
      tag: "Finalizado",
      tone: "completed" as const,
    },
    {
      id: "background",
      label: "Experiência e formação",
      detail: "Full-Stack autônomo · Cursos SENAI · Inglês B2 (Callan)",
      href: "#trajetoria",
      tag: "Perfil",
      tone: "default" as const,
    },
  ],
} as const;
