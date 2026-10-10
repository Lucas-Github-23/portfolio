"use client";

import React from "react";
import { useLanguage } from "@/context";
import { CpuIcon } from "./Icons";

export function MagiSystemMonitor() {
  const { t } = useLanguage();

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

        {/* 3 LLM Consensus Cores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["melchior", "balthasar", "caspar"] as const).map((coreKey) => {
            const core = coreData[coreKey];

            return (
              <div
                key={coreKey}
                className="text-left p-6 hud-panel border-2 bg-[var(--surface-panel)] border-[var(--border-grid)] hover:border-[var(--accent-orange)] hover:shadow-[0_0_20px_var(--accent-orange-glow)] transition-all relative group"
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
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent-orange)] opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-orange)]" />
                  </div>
                </div>

                {/* Consensus Verdict Badge */}
                <div className="inline-block px-3 py-1 bg-[var(--accent-orange-glow)] border border-[var(--accent-orange)] text-[var(--accent-orange)] font-mono text-[10px] font-extrabold uppercase tracking-widest mb-3">
                  {core.verdict}
                </div>

                {/* Detail snippet */}
                <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                  {core.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

