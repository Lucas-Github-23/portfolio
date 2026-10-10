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

/**
 * Detects whether the visitor's environment points to Portuguese (Brazil) or International/English.
 * Checks URL parameter -> localStorage -> navigator.languages -> navigator.language -> Brazilian Timezone.
 */
function detectPreferredLanguage(): Language {
  if (typeof window === "undefined") return "pt";

  // 1. URL parameter override (?lang=en or ?lang=pt) for direct shared links (e.g., CVs, LinkedIn)
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang")?.toLowerCase();
    if (urlLang === "en" || urlLang === "pt") {
      safeSetItem("nerv_lang", urlLang);
      return urlLang as Language;
    }
  } catch {
    // Ignore URL parse errors
  }

  // 2. Saved user preference in storage
  const saved = safeGetItem("nerv_lang") as Language;
  if (saved === "en" || saved === "pt") {
    return saved;
  }

  // 3. Check browser language list (navigator.languages and navigator.language)
  const langs: string[] = [];
  if (typeof navigator !== "undefined") {
    if (navigator.language) langs.push(navigator.language);
    if (Array.isArray(navigator.languages)) langs.push(...navigator.languages);
    if ((navigator as unknown as { userLanguage?: string }).userLanguage) {
      langs.push((navigator as unknown as { userLanguage: string }).userLanguage);
    }
    if ((navigator as unknown as { browserLanguage?: string }).browserLanguage) {
      langs.push((navigator as unknown as { browserLanguage: string }).browserLanguage);
    }
  }

  const hasPt = langs.some(
    (l) => typeof l === "string" && l.toLowerCase().startsWith("pt")
  );

  // If Portuguese is present anywhere in user's browser language list, use pt
  if (hasPt) {
    return "pt";
  }

  // 4. Check Brazilian timezone as a strong geographic indicator
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (
      tz.includes("Sao_Paulo") ||
      tz.includes("Fortaleza") ||
      tz.includes("Recife") ||
      tz.includes("Belem") ||
      tz.includes("Manaus") ||
      tz.includes("Cuiaba") ||
      tz.includes("Porto_Velho") ||
      tz.includes("Boa_Vista") ||
      tz.includes("Campo_Grande") ||
      tz.includes("Maceio") ||
      tz.includes("Bahia") ||
      tz.includes("Noronha")
    ) {
      return "pt";
    }
  } catch {
    // Ignore timezone detection errors
  }

  // 5. If visitor explicitly has English or international language without Portuguese, use en
  const isEnglishOrOther = langs.some(
    (l) => typeof l === "string" && !l.toLowerCase().startsWith("pt")
  );
  if (isEnglishOrOther) {
    return "en";
  }

  return "pt";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Start with 'pt' as default so Brazilian visitors and SSR default to Portuguese
  const [language, setLanguageState] = useState<Language>("pt");

  useEffect(() => {
    const initialLang = detectPreferredLanguage();
    setLanguageState(initialLang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = initialLang === "pt" ? "pt-BR" : "en";
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
