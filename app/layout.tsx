import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/context";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import { AngelAttackOverlay } from "@/components/AngelAttackOverlay";
import { DynamicFavicon } from "@/components/DynamicFavicon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://lucasgo.dev";

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lucas Gabriel | Software Engineer",
    template: "%s | Lucas Gabriel",
  },
  description:
    "Portfólio de Engenharia de Software de Lucas Gabriel. Soluções em backend, análise de dados, automação de processos e aplicações web completas.",
  applicationName: "Lucas Gabriel",
  authors: [{ name: "Lucas Gabriel", url: "https://github.com/Lucas-Github-23" }],
  creator: "Lucas Gabriel",
  publisher: "Lucas Gabriel",
  keywords: [
    "Lucas Gabriel",
    "Lucas Gabriel Pereira",
    "Lucas Gabriel Oliveira Pereira",
    "Lucas Pereira",
    "Software Engineer",
    "Engenheiro de Software",
    "Desenvolvedor Backend",
    "Backend Developer",
    "Análise de Dados",
    "Data Analytics",
    "Desenvolvedor Full Stack",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "C#",
    ".NET",
    "SQL",
    "Python",
    "lucasgo.dev",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon-tactical-l.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "Lucas Gabriel",
    title: "Lucas Gabriel | Software Engineer",
    description:
      "Portfólio de Engenharia de Software de Lucas Gabriel. Soluções em backend, análise de dados, automação de processos e aplicações web completas.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Lucas Gabriel - Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Gabriel | Software Engineer",
    description:
      "Portfólio de Engenharia de Software de Lucas Gabriel. Soluções em backend, análise de dados, automação de processos e aplicações web completas.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
      "en-US": "/?lang=en",
      "x-default": "/",
    },
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
  other: {
    google: "notranslate",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://lucasgo.dev/#person",
      name: "Lucas Gabriel",
      alternateName: ["Lucas Gabriel Oliveira Pereira", "Lucas Pereira", "Lucas Gabriel Pereira"],
      url: "https://lucasgo.dev",
      jobTitle: "Software Engineer",
      description:
        "Engenheiro de Software com foco em backend, análise de dados, automação de processos e desenvolvimento de software.",
      sameAs: [
        "https://github.com/Lucas-Github-23",
        "https://www.linkedin.com/in/lucas-pereira-521082279/",
      ],
      knowsAbout: [
        "Software Engineering",
        "Backend Development",
        "Data Analytics",
        ".NET",
        "C#",
        "SQL",
        "Python",
        "TypeScript",
        "React",
        "Next.js",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://lucasgo.dev/#website",
      url: "https://lucasgo.dev",
      name: "Lucas Gabriel",
      alternateName: "Lucas Gabriel | Software Engineer",
      description:
        "Portfólio de Engenharia de Software de Lucas Gabriel. Soluções em backend, análise de dados, automação de processos e aplicações web completas.",
      publisher: {
        "@id": "https://lucasgo.dev/#person",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      translate="no"
      data-eva="nerv"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased notranslate`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col nerv-grid-bg">
        <AppProviders>
          <DynamicFavicon />
          <ScanlineOverlay />
          <AngelAttackOverlay />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
