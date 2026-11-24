import { profile } from "@/lib/data";

/** Content for the profile card. Activity is editorial, not a live device feed. */
export const heroProfile = {
  displayName: "Lucas",
  handle: profile.githubHandle,
  avatarSrc: "/profile/avatar.webp" as string,
  bannerSrc: "/profile/banner.webp",
  bannerAlt: "Banner de Lucas: Desenvolvedor Full-Stack & Creative Interaction Engineer",
  initials: "LG",
  status: "Disponível para contratação",
  role: "Desenvolvedor Full-Stack",
  bio: "Construo aplicações web de alto desempenho, unindo interfaces reativas modernas à arquitetura de backend resiliente e segura.",
  stack: ["Next.js", "TypeScript", "React", "PostgreSQL", "Tailwind CSS"],
  activities: [
    {
      id: "focus",
      label: "Foco",
      title: "Arquiteturas escaláveis e seguras.",
      detail: "Next.js 15 + TypeScript · do front à borda",
      icon: "terminal",
    },
    {
      id: "state",
      label: "Prática",
      title: "Concorrência, RLS & Sistemas em tempo real.",
      detail: "Isolamento no banco e tolerância a falhas",
      icon: "layers",
    },
    {
      id: "availability",
      label: "Status",
      title: "Pronto para integrar equipes técnicas.",
      detail: "Presencial (RMC), híbrido ou remoto",
      icon: "cpu",
    },
  ],
} as const;
