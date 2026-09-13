"use client";

import React from "react";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider } from "./ThemeContext";
import { TacticalProvider } from "./TacticalContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <TacticalProvider>{children}</TacticalProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
