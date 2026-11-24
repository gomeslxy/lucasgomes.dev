import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lucas (@gomeslxy) — Desenvolvedor Full-Stack",
    short_name: "Lucas",
    description:
      "Desenvolvedor Full-Stack em Indaiatuba, SP. Aplicações web com Next.js, TypeScript, PostgreSQL, Supabase, Redis e IA aplicada: Agendra e Bonds Agence.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    lang: "pt-BR",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
