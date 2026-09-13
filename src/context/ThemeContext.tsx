"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { safeGetItem, safeSetItem } from "@/utils/storage";

export type EvaUnit = "nerv" | "eva-01" | "eva-02" | "eva-00";

interface ThemeContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
  evaUnit: EvaUnit;
  setEvaUnit: (unit: EvaUnit) => void;
  crtEnabled: boolean;
  toggleCrt: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [evaUnit, setEvaUnitState] = useState<EvaUnit>("eva-01");
  const [crtEnabled, setCrtEnabled] = useState<boolean>(false);

  useEffect(() => {
    // 1. Theme: Check saved preference or fallback to OS / system preference
    const savedTheme = safeGetItem("nerv_theme") as "dark" | "light";
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    } else {
      const prefersLight =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches;
      const initialTheme = prefersLight ? "light" : "dark";
      setTheme(initialTheme);
      if (initialTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    }

    // 2. EVA Unit Palette: Default is 'eva-01', restore saved user choice if present
    const savedEva = safeGetItem("nerv_eva_unit") as EvaUnit;
    if (savedEva && ["nerv", "eva-01", "eva-02", "eva-00"].includes(savedEva)) {
      setEvaUnitState(savedEva);
      document.documentElement.setAttribute("data-eva", savedEva);
    } else {
      setEvaUnitState("eva-01");
      document.documentElement.setAttribute("data-eva", "eva-01");
    }

    // 3. CRT Scanlines
    const savedCrt = safeGetItem("nerv_crt");
    if (savedCrt) {
      setCrtEnabled(savedCrt === "true");
    }
  }, []);

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

  const setEvaUnit = (unit: EvaUnit) => {
    setEvaUnitState(unit);
    safeSetItem("nerv_eva_unit", unit);
    document.documentElement.setAttribute("data-eva", unit);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nerv_eva_change", { detail: unit }));
    }
  };

  const toggleCrt = () => {
    const nextCrt = !crtEnabled;
    setCrtEnabled(nextCrt);
    safeSetItem("nerv_crt", String(nextCrt));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        evaUnit,
        setEvaUnit,
        crtEnabled,
        toggleCrt,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
