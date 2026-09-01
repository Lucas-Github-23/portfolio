"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 bg-[var(--bg-main)] border-t border-[var(--border-grid)] font-mono text-xs text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)]" />
          <span>{t.footer.copyright}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] text-[var(--accent-green)] font-bold px-2 py-0.5 border border-[var(--accent-green)] uppercase">
            {t.footer.status}
          </span>
          <span>GEOFRONT / HQ-01</span>
        </div>
      </div>
    </footer>
  );
}
