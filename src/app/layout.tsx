import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/data";
import { getIntroBootstrapScript } from "@/lib/intro-bootstrap";

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
const introBootstrapScript = getIntroBootstrapScript();

export const metadata: Metadata = {
  metadataBase: new URL("https://lucasgomes.dev"),
  alternates: {
    canonical: "/",
  },
  title: "Lucas — Desenvolvedor Full-Stack | Indaiatuba, SP",
  description:
    "Lucas, desenvolvedor Full-Stack com foco em Next.js, React, TypeScript e PostgreSQL. Projetos com RLS, tempo real, rate limiting na Edge e integrações de IA: Agendra e BONDS AGENCE.",
  keywords: [
    "Lucas",
    "Desenvolvedor Full-Stack",
    "Next.js 15",
    "React 19",
    "TypeScript",
    "PostgreSQL RLS",
    "Arquitetura Multi-Tenant",
    "Agendra",
    "BONDS AGENCE",
    "Supabase Realtime",
    "Upstash Redis",
    "Indaiatuba",
    "Campinas",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    locale: "pt_BR",
    url: "/",
    title: "Lucas — Desenvolvedor Full-Stack",
    description:
      "Projetos Full-Stack com Next.js, TypeScript, PostgreSQL (RLS), tempo real e IA aplicada: Agendra e BONDS AGENCE.",
    siteName: "Lucas — Portfólio",
    images: [{ url: "/work/agendra.jpg", width: 1024, height: 464, alt: "Agendra — plataforma multi-tenant com IA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas — Desenvolvedor Full-Stack",
    description:
      "Projetos Full-Stack com Next.js, TypeScript, PostgreSQL (RLS), tempo real e IA aplicada.",
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
  telephone: profile.phoneE164,
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

const serializedJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${anton.variable} ${instrument.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootstrapScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializedJsonLd }}
        />
        {children}
      </body>
    </html>
  );
}
