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
    default: "Lucas // Software Engineer • NERV Tactical HUD Portfolio",
    template: "%s | Lucas // DEV-02",
  },
  description:
    "Software Engineering portfolio designed in Evangelion NERV / MAGI tactical interface style. Full-Stack, React, Next.js, TypeScript, and Data Systems.",
  applicationName: "NERV HUD // LUCAS DEV-02",
  authors: [{ name: "Lucas", url: "https://github.com/Lucas-Github-23" }],
  creator: "Lucas",
  publisher: "Lucas",
  keywords: [
    "Lucas",
    "Software Engineer",
    "Engenheiro de Software",
    "Desenvolvedor Full Stack",
    "Frontend Developer",
    "Backend Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "SQL",
    "NERV",
    "MAGI",
    "Evangelion Portfolio",
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
    siteName: "LUCAS // DEV-02 • NERV HQ GEOFRONT",
    title: "Lucas // Software Engineer • NERV Tactical HUD Portfolio",
    description:
      "Interactive Software Engineering portfolio inspired by Evangelion NERV / MAGI tactical interface. Full-Stack applications, telemetry and diagnostics.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Lucas // Software Engineer - NERV Tactical HUD Interface Social Preview Card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas // Software Engineer • NERV Tactical HUD Portfolio",
    description:
      "Interactive Software Engineering portfolio inspired by Evangelion NERV / MAGI tactical interface. Full-Stack applications, telemetry and diagnostics.",
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
