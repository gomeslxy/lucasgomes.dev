import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile, SITE_URL } from "@/lib/data";
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
  style: ["italic"],
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

const introBootstrapScript = getIntroBootstrapScript();

const PAGE_TITLE = "Lucas (@gomeslxy) — Desenvolvedor Full-Stack | Next.js & TypeScript";
const PAGE_DESCRIPTION =
  "Desenvolvedor Full-Stack em Indaiatuba, SP. Aplicações web com Next.js, TypeScript, PostgreSQL, Supabase, Redis e IA aplicada: Agendra e Bonds Agence.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Lucas",
    "Lucas Gomes",
    "@gomeslxy",
    "Desenvolvedor Full-Stack",
    "Next.js",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Supabase",
    "Redis",
    "Stripe",
    "Resend",
    "WhatsApp Cloud API",
    "Agendra",
    "Bonds Agence",
    "Indaiatuba",
    "Campinas",
  ],
  authors: [{ name: profile.fullName, url: profile.github }],
  creator: `${profile.fullName} (${profile.githubHandle})`,
  publisher: profile.fullName,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: "Lucas (@gomeslxy) — Portfólio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: PAGE_TITLE,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    creator: profile.githubHandle,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.fullName,
      alternateName: [profile.name, profile.githubHandle],
      jobTitle: profile.role,
      email: `mailto:${profile.email}`,
      url: SITE_URL,
      image: `${SITE_URL}/profile/avatar.webp`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Indaiatuba",
        addressRegion: "SP",
        addressCountry: "BR",
      },
      sameAs: [profile.github, profile.linkedin],
      knowsAbout: [
        "Next.js",
        "React",
        "TypeScript",
        "PostgreSQL",
        "Row Level Security (RLS)",
        "Supabase",
        "Upstash Redis",
        "Stripe",
        "Resend",
        "WhatsApp Cloud API",
        "IA Aplicada",
      ],
      knowsLanguage: ["pt-BR", "en"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Lucas (@gomeslxy) — Portfólio",
      url: SITE_URL,
      description: PAGE_DESCRIPTION,
      inLanguage: "pt-BR",
      author: {
        "@id": `${SITE_URL}/#person`,
      },
    },
  ],
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
        <link rel="author" href="/humans.txt" />
        <script dangerouslySetInnerHTML={{ __html: introBootstrapScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializedJsonLd }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
