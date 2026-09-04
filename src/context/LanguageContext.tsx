"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/data/translations";
import { safeGetItem, safeSetItem } from "@/utils/storage";

export type SectionId = "status" | "magi" | "projects" | "skills" | "experience" | "contact";
export type EvaUnit = "nerv" | "eva-01" | "eva-02" | "eva-00";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  theme: "dark" | "light";
  toggleTheme: () => void;
  crtEnabled: boolean;
  toggleCrt: () => void;
  emergencyActive: boolean;
  toggleEmergency: () => void;
  activeSection: SectionId;
  setActiveSection: (sec: SectionId) => void;
  evaUnit: EvaUnit;
  setEvaUnit: (unit: EvaUnit) => void;
  isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [crtEnabled, setCrtEnabled] = useState<boolean>(false);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [activeSection, setActiveSectionState] = useState<SectionId>("status");
  const [evaUnit, setEvaUnitState] = useState<EvaUnit>("nerv");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    const savedLang = safeGetItem("nerv_lang") as Language;
    if (savedLang === "en" || savedLang === "pt") {
      setLanguageState(savedLang);
    }

    const savedTheme = safeGetItem("nerv_theme") as "dark" | "light";
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.add("light");
      }
    }

    const savedCrt = safeGetItem("nerv_crt");
    if (savedCrt) {
      setCrtEnabled(savedCrt === "true");
    }

    const savedEva = safeGetItem("nerv_eva_unit") as EvaUnit;
    if (savedEva && ["nerv", "eva-01", "eva-02", "eva-00"].includes(savedEva)) {
      setEvaUnitState(savedEva);
      document.documentElement.setAttribute("data-eva", savedEva);
    } else {
      document.documentElement.setAttribute("data-eva", "nerv");
    }

    // Auto-update activeSection on manual scroll via IntersectionObserver
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id as SectionId;
          if (["status", "magi", "projects", "skills", "experience", "contact"].includes(id)) {
            setActiveSectionState(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0.1,
    });

    const sections = ["status", "magi", "projects", "skills", "experience", "contact"];
    sections.forEach((secId) => {
      const el = document.getElementById(secId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    safeSetItem("nerv_lang", lang);
  };

  const setActiveSection = (sec: SectionId) => {
    setActiveSectionState(sec);
    window.history.replaceState(null, "", `#${sec}`);

    const element = document.getElementById(sec);
    if (element) {
      element.classList.remove("tactical-section-pulse");
      void element.offsetWidth;
      element.classList.add("tactical-section-pulse");
      setTimeout(() => {
        element.classList.remove("tactical-section-pulse");
      }, 1200);

      const headerElement = document.querySelector("header");
      const headerOffset = headerElement ? Math.max(headerElement.offsetHeight, 80) + 16 : 85;
      const elementPosition = element.getBoundingClientRect().top;
      const currentScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
      const offsetPosition = elementPosition + currentScroll - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    safeSetItem("nerv_theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const toggleCrt = () => {
    const nextCrt = !crtEnabled;
    setCrtEnabled(nextCrt);
    safeSetItem("nerv_crt", String(nextCrt));
  };

  const toggleEmergency = () => {
    setEmergencyActive((prev) => !prev);
  };

  const setEvaUnit = (unit: EvaUnit) => {
    setEvaUnitState(unit);
    safeSetItem("nerv_eva_unit", unit);
    document.documentElement.setAttribute("data-eva", unit);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nerv_eva_change", { detail: unit }));
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        crtEnabled,
        toggleCrt,
        emergencyActive,
        toggleEmergency,
        activeSection,
        setActiveSection,
        evaUnit,
        setEvaUnit,
        isTransitioning,
      }}
    >
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
