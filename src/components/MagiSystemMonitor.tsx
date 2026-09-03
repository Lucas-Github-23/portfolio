"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CpuIcon } from "./Icons";

export function MagiSystemMonitor() {
  const { t } = useLanguage();
  const [activeCore, setActiveCore] = useState<"melchior" | "balthasar" | "caspar">("melchior");

  const coreData = {
    melchior: t.magi.cores.melchior,
    balthasar: t.magi.cores.balthasar,
    caspar: t.magi.cores.caspar,
  };

  return (
    <section id="magi" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent-orange)] tracking-widest uppercase mb-2">
            <CpuIcon className="w-4 h-4" />
            SUPERCOMPUTER ARCHITECTURE
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-tight text-[var(--text-primary)]">
            {t.magi.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-mono mt-2">
            {t.magi.subtitle}
          </p>
        </div>

        {/* 3 MAGI Cores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(["melchior", "balthasar", "caspar"] as const).map((coreKey) => {
            const core = coreData[coreKey];
            const isActive = activeCore === coreKey;

            return (
              <button
                key={coreKey}
                onClick={() => setActiveCore(coreKey)}
                className={`text-left p-6 hud-panel border-2 transition-all relative cursor-pointer ${
                  isActive
                    ? "bg-[var(--surface-panel)] border-[var(--accent-orange)] shadow-[0_0_20px_var(--accent-orange-glow)]"
                    : "bg-[var(--surface-panel)]/50 border-[var(--border-grid)] hover:border-[var(--border-bright)]"
                }`}
              >
                {/* Core Header */}
                <div className="flex justify-between items-start mb-4 font-mono">
                  <div>
                    <span className="text-xs font-bold text-[var(--accent-orange)] tracking-widest block uppercase">
                      {core.name}
                    </span>
                    <h3 className="text-lg font-black text-[var(--text-primary)] uppercase">
                      {core.role}
                    </h3>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-[var(--accent-orange)] animate-ping" />
                </div>

                {/* Consensus Verdict Badge */}
                <div className="inline-block px-3 py-1 bg-[var(--accent-orange-glow)] border border-[var(--accent-orange)] text-[var(--accent-orange)] font-mono text-[10px] font-extrabold uppercase tracking-widest mb-3">
                  {core.verdict}
                </div>

                {/* Detail snippet */}
                <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                  {core.detail}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Core Detailed Diagnostic Panel */}
        <div className="bg-[var(--surface-panel)] border-2 border-[var(--accent-orange)] p-4 sm:p-6 hud-panel relative font-mono shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-[var(--border-grid)] pb-3 mb-4">
            <span className="text-xs font-extrabold text-[var(--accent-orange)] tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--accent-orange)] shrink-0" />
              <span className="truncate">DIAGNOSTIC LOG // {coreData[activeCore].name}</span>
            </span>
            <span className="text-[10px] text-[var(--text-secondary)]">STATUS: 100% OPERATIONAL</span>
          </div>

          <div className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed space-y-2">
            <p className="font-bold text-[var(--accent-green)]">
              &gt; {coreData[activeCore].role}
            </p>
            <p className="text-[var(--text-secondary)]">
              {coreData[activeCore].detail}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
