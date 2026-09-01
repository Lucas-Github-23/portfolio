import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import { AngelAttackOverlay } from "@/components/AngelAttackOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lucas | NERV Tactical Interface Portfolio",
  description: "Full-Stack Software Engineer portfolio designed in Evangelion NERV / MAGI tactical interface style.",
  keywords: ["Software Engineer", "Next.js", "React", "TypeScript", "Tailwind CSS", "Developer Portfolio", "NERV", "MAGI"],
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
          <ScanlineOverlay />
          <AngelAttackOverlay />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
