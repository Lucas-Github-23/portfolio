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
    "Lucas Gabriel's Software Engineering Portfolio. Building high-performance web applications with React, Next.js, TypeScript, .NET, and SQL.",
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
    "Desenvolvedor Full Stack",
    "Full-Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "C#",
    ".NET",
    "SQL",
    "lucasgo.dev",
  ],
  icons: {
    icon: [
      { url: "/icons/icon-tactical-l.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/icon-tactical-l.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "pt_BR",
    url: siteUrl,
    siteName: "Lucas Gabriel",
    title: "Lucas Gabriel | Software Engineer",
    description:
      "Lucas Gabriel's Software Engineering Portfolio. Building high-performance web applications with React, Next.js, TypeScript, .NET, and SQL.",
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
      "Lucas Gabriel's Software Engineering Portfolio. Building high-performance web applications with React, Next.js, TypeScript, .NET, and SQL.",
    images: ["/og-image.jpg"],
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
      sameAs: [
        "https://github.com/Lucas-Github-23",
        "https://www.linkedin.com/in/lucas-pereira-521082279/",
      ],
      knowsAbout: ["React", "Next.js", "TypeScript", ".NET", "C#", "SQL", "Software Engineering"],
    },
    {
      "@type": "WebSite",
      "@id": "https://lucasgo.dev/#website",
      url: "https://lucasgo.dev",
      name: "Lucas Gabriel",
      alternateName: "Lucas Gabriel | Software Engineer",
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
      lang="en"
      data-eva="eva-01"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
