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
      return urlLang as Language;
    }
  } catch {
    // Ignore URL parse errors
  }

  // 2. Saved user preference in storage (only if user explicitly clicked EN or PT)
  const saved = safeGetItem("nerv_lang") as Language;
  if (saved === "en" || saved === "pt") {
    return saved;
  }

  // 3. Check browser language list (navigator.languages and navigator.language)
  const rawLangs: string[] = [];
  if (typeof navigator !== "undefined") {
    if (navigator.language) rawLangs.push(navigator.language);
    if (Array.isArray(navigator.languages)) rawLangs.push(...navigator.languages);
    if ((navigator as unknown as { userLanguage?: string }).userLanguage) {
      rawLangs.push((navigator as unknown as { userLanguage: string }).userLanguage);
    }
  }

  const langs = rawLangs.filter(Boolean).map((l) => l.toLowerCase());

  // Priority 1: If primary language or any preferred language starts with 'pt' -> return 'pt'
  if (langs.some((l) => l.startsWith("pt"))) {
    return "pt";
  }

  // Priority 2: If primary language starts with 'en' -> return 'en'
  if (langs.some((l) => l.startsWith("en"))) {
    return "en";
  }

  // Priority 3: Check Brazilian timezone as a strong geographic indicator
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

    if (typeof window !== "undefined") {
      console.log("[NERV HUD] Language initialized:", {
        detected: initialLang,
        browserLang: typeof navigator !== "undefined" ? navigator.language : null,
        browserLanguages: typeof navigator !== "undefined" ? navigator.languages : null,
        savedPreference: safeGetItem("nerv_lang", "none"),
      });
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
