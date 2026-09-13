"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SectionId = "status" | "magi" | "projects" | "skills" | "experience" | "contact";

interface TacticalContextType {
  activeSection: SectionId;
  setActiveSection: (sec: SectionId) => void;
  emergencyActive: boolean;
  toggleEmergency: () => void;
}

const TacticalContext = createContext<TacticalContextType | undefined>(undefined);

export function TacticalProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<SectionId>("status");
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);

  useEffect(() => {
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

    const sections: SectionId[] = ["status", "magi", "projects", "skills", "experience", "contact"];
    sections.forEach((secId) => {
      const el = document.getElementById(secId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setActiveSection = (sec: SectionId) => {
    setActiveSectionState(sec);

    // Keep browser address bar clean without hash fragments (#)
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

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

  const toggleEmergency = () => {
    setEmergencyActive((prev) => !prev);
  };

  return (
    <TacticalContext.Provider
      value={{
        activeSection,
        setActiveSection,
        emergencyActive,
        toggleEmergency,
      }}
    >
      {children}
    </TacticalContext.Provider>
  );
}

export function useTactical() {
  const context = useContext(TacticalContext);
  if (!context) {
    throw new Error("useTactical must be used within a TacticalProvider");
  }
  return context;
}
