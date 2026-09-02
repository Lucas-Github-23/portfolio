"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CpuIcon, ActivityIcon, TerminalIcon } from "./Icons";

export function HeroSection() {
  const { t } = useLanguage();
  const [syncRate, setSyncRate] = useState<number>(98.4);

  useEffect(() => {
    // Subtle organic fluctuation in sync rate for tactical feel
    const interval = setInterval(() => {
      const variation = (Math.random() * 0.4 - 0.2);
      setSyncRate((prev) => Math.min(99.9, Math.max(97.5, Number((prev + variation).toFixed(1)))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="status" className="relative py-12 sm:py-16 md:py-24 border-b border-[var(--border-grid)] overflow-hidden select-none">
      {/* Decorative Grid Lines & NERV Stamps */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 font-mono text-[9px] sm:text-[10px] text-[var(--text-secondary)] tracking-widest pointer-events-none opacity-40 select-none text-right">
        <div>SYS_ID: EVA-01 // MAGI-LINK</div>
        <div>PILOT_STATUS: READY</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Main Text Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Security Clearance Tag */}
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-[var(--surface-panel)] border border-[var(--accent-orange)] text-[var(--accent-orange)] font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase hud-panel-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] animate-pulse" />
            {t.hero.clearance}
          </div>

          {/* Pilot Codename & Title */}
          <div>
            <div className="font-mono text-xs text-[var(--accent-green)] tracking-widest uppercase mb-1 flex items-center gap-2">
              <TerminalIcon className="w-4 h-4" />
              {t.hero.codeName}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] uppercase leading-tight sm:leading-none font-mono text-glow-orange break-words">
              {t.hero.title}
            </h1>
          </div>

          {/* Subtitle / Bio */}
          <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] font-mono max-w-2xl leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 font-mono">
            <a
              href="#projects"
              className="w-full sm:w-auto px-6 py-3.5 bg-[var(--accent-orange)] text-black font-extrabold text-xs md:text-sm tracking-wider uppercase hud-button hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_var(--accent-orange-glow)] text-center"
            >
              <CpuIcon className="w-4 h-4" />
              {t.hero.ctaProjects}
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto px-6 py-3.5 bg-[var(--surface-panel)] border border-[var(--border-bright)] text-[var(--text-primary)] font-bold text-xs md:text-sm tracking-wider uppercase hud-button hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] transition-all flex items-center justify-center gap-2 text-center"
            >
              <TerminalIcon className="w-4 h-4" />
              {t.hero.ctaContact}
            </a>
          </div>
        </div>

        {/* Tactical Synchronicity Ratio Widget */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-full max-w-sm bg-[var(--surface-panel)] border-2 border-[var(--border-grid)] p-6 hud-panel relative space-y-4 hover:border-[var(--accent-orange)] transition-colors shadow-lg">
            <div className="flex justify-between items-center border-b border-[var(--border-grid)] pb-3">
              <span className="font-mono text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase flex items-center gap-1.5">
                <ActivityIcon className="w-4 h-4 text-[var(--accent-green)]" />
                {t.hero.syncRatioLabel}
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 bg-[var(--accent-green-glow)] text-[var(--accent-green)] border border-[var(--accent-green)] font-bold uppercase">
                STABLE
              </span>
            </div>

            {/* Sync Gauge Value */}
            <div className="text-center py-4">
              <div className="text-5xl md:text-6xl font-black font-mono text-[var(--accent-green)] tracking-tighter text-glow-green">
                {syncRate.toFixed(1)}%
              </div>
              <div className="font-mono text-[11px] text-[var(--text-secondary)] tracking-widest uppercase mt-2">
                {t.hero.syncStatus}
              </div>
            </div>

            {/* Tactical Bar Progress */}
            <div className="w-full bg-[var(--bg-main)] h-3 border border-[var(--border-grid)] p-0.5 overflow-hidden">
              <div
                className="bg-[var(--accent-green)] h-full transition-all duration-700 ease-out shadow-[0_0_10px_var(--accent-green-glow)]"
                style={{ width: `${syncRate}%` }}
              />
            </div>

            <div className="pt-2 text-[10px] font-mono text-[var(--text-secondary)] flex justify-between uppercase">
              <span>HARMONIC HARMONY: HIGH</span>
              <span>A-10 NERVE CELL LINK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
