"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/data/translations";
import { safeGetItem, safeSetItem } from "@/utils/storage";

export type { Language };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // 0. Check URL query param (?lang=en or ?lang=pt) for direct shared links (e.g., CVs, LinkedIn)
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get("lang")?.toLowerCase();
        if (urlLang === "en" || urlLang === "pt") {
          setLanguageState(urlLang as Language);
          safeSetItem("nerv_lang", urlLang);
          if (typeof document !== "undefined") {
            document.documentElement.lang = urlLang === "pt" ? "pt-BR" : "en";
          }
          return;
        }
      } catch {
        // Fall through to storage check
      }
    }

    // 1. Check saved user preference if present
    const savedLang = safeGetItem("nerv_lang") as Language;
    if (savedLang === "en" || savedLang === "pt") {
      setLanguageState(savedLang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = savedLang === "pt" ? "pt-BR" : "en";
      }
      return;
    }

    // 2. Auto-detect browser language for first-time visitors:
    // Portuguese browsers -> pt, International/other browsers -> en
    if (typeof navigator !== "undefined" && navigator.language) {
      const isPt = navigator.language.toLowerCase().startsWith("pt");
      const detected: Language = isPt ? "pt" : "en";
      setLanguageState(detected);
      if (typeof document !== "undefined") {
        document.documentElement.lang = detected === "pt" ? "pt-BR" : "en";
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    safeSetItem("nerv_lang", lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
