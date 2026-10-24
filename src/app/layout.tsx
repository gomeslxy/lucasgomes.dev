import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
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
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = "https://github.com/gomeslxy";

export const metadata: Metadata = {
  metadataBase: new URL("https://lucasgomes.dev"),
  title: "Lucas Gomes — Full-Stack & AI Developer | Indaiatuba, SP",
  description:
    "Portfólio de Lucas Gomes, 16 anos, desenvolvedor Full-Stack & AI em Indaiatuba/SP. Fundador do Agendra (SaaS multi-tenant com IA) e BONDS AGENCE V4 (e-commerce streetwear de alta performance).",
  keywords: [
    "Lucas Gomes",
    "Lucas Gomes do Amaral",
    "Full-Stack Developer",
    "AI Developer",
    "Next.js 15",
    "React 19",
    "SaaS Multi-Tenant",
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
    title: "Lucas Gomes — Full-Stack & AI Developer",
    description:
      "Software que vende, atende e escala operações em tempo real. SaaS multi-tenant, IA aplicada e e-commerce full-stack — de Indaiatuba para o mundo.",
    siteName: "Lucas Gomes — Portfolio",
    images: [{ url: "/work/agendra.jpg", width: 896, height: 1200, alt: "Agendra — painel de automação comercial com IA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Gomes — Full-Stack & AI Developer",
    description: "SaaS multi-tenant, IA aplicada e e-commerce de alta performance.",
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
  sameAs: [profile.github, profile.linkedin, profile.agendra],
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
      className={`${anton.variable} ${instrument.variable} ${interTight.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
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
