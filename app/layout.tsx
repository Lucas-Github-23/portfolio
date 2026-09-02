import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
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

export const metadata: Metadata = {
  title: "Lucas | Portfolio // DEV-02",
  description: "Software Engineer portfolio designed in Evangelion NERV / MAGI interface style.",
  keywords: ["Software Engineer", "Next.js", "React", "TypeScript", "Tailwind CSS", "Developer Portfolio", "NERV", "MAGI"],
  icons: {
    icon: [
      { url: "/icons/icon-tactical-l.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/icon-tactical-l.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col nerv-grid-bg">
        <LanguageProvider>
          <DynamicFavicon />
          <ScanlineOverlay />
          <AngelAttackOverlay />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
