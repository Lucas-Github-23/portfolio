"use client";

import React from "react";
import { useLanguage } from "@/context";

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-[var(--bg-main)] border-t border-[var(--border-grid)] font-mono text-xs text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)]" />
            <span>
              © {currentYear} {t.footer.copyright}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] text-[var(--accent-green)] font-bold px-2 py-0.5 border border-[var(--accent-green)] uppercase">
              {t.footer.status}
            </span>
            <span>GEOFRONT / HQ-01</span>
          </div>
        </div>

        {/* Non-commercial Fair Use & Trademark Disclaimer */}
        <div className="pt-3 border-t border-[var(--border-grid)]/60 text-center sm:text-left text-[10px] text-[var(--text-secondary)] opacity-70 leading-relaxed">
          <p>{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
