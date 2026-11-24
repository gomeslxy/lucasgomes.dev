import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/data";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = "https://github.com/gomeslxy";

export const metadata: Metadata = {
  metadataBase: new URL("https://lucasgomes.dev"),
  title: "Lucas — Desenvolvedor Full-Stack & IA | Indaiatuba, SP",
  description:
    "Lucas, desenvolvedor Full-Stack com foco em interfaces modernas, performance e IA aplicada. Conheça o Agendra, um case de engenharia multi-tenant construído de ponta a ponta, e meus projetos web.",
  keywords: [
    "Lucas",
    "Full-Stack Developer",
    "AI Developer",
    "Next.js 15",
    "React 19",
    "Arquitetura Multi-Tenant",
    "Agendra",
    "BONDS AGENCE V4",
    "Supabase Realtime",
    "Indaiatuba",
    "Campinas",
    "Desenvolvedor",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    locale: "pt_BR",
    title: "Lucas — Desenvolvedor Full-Stack & IA",
    description:
      "Interfaces modernas, aplicações com IA e engenharia de ponta a ponta. Explore projetos, decisões técnicas e o Agendra, meu case de estudo em arquitetura multi-tenant.",
    siteName: "Lucas — Portfólio",
    images: [{ url: "/work/agendra.jpg", width: 896, height: 1200, alt: "Agendra — case de engenharia multi-tenant com IA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas — Desenvolvedor Full-Stack & IA",
    description: "Projetos full-stack com interfaces modernas, foco em performance e IA aplicada. Agendra: case de engenharia e estudo multi-tenant.",
    images: ["/work/agendra.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.signature,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  telephone: "+5511989940080",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Indaiatuba",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: [
    "Next.js 15",
    "React 19",
    "TypeScript",
    "Supabase",
    "PostgreSQL RLS",
    "Large Language Models",
    "WhatsApp Cloud API",
    "E-Commerce Architecture",
    "Supabase Realtime",
    "Upstash Redis Rate Limiting",
  ],
  knowsLanguage: ["pt-BR", "en"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${anton.variable} ${instrument.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
