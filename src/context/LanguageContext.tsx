"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/data/translations";

export type SectionId = "status" | "magi" | "projects" | "skills" | "experience" | "contact";

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
  isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [activeSection, setActiveSectionState] = useState<SectionId>("status");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("nerv_lang") as Language;
    if (savedLang === "en" || savedLang === "pt") {
      setLanguageState(savedLang);
    }

    const savedTheme = localStorage.getItem("nerv_theme") as "dark" | "light";
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.add("light");
      }
    }

    const savedCrt = localStorage.getItem("nerv_crt");
    if (savedCrt !== null) {
      setCrtEnabled(savedCrt === "true");
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
    localStorage.setItem("nerv_lang", lang);
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

      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("nerv_theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const toggleCrt = () => {
    const nextCrt = !crtEnabled;
    setCrtEnabled(nextCrt);
    localStorage.setItem("nerv_crt", String(nextCrt));
  };

  const toggleEmergency = () => {
    setEmergencyActive((prev) => !prev);
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
