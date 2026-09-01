"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export function ScanlineOverlay() {
  const { crtEnabled, emergencyActive, toggleEmergency, t } = useLanguage();

  return (
    <>
      {crtEnabled && <div className="crt-overlay crt-flicker" />}

      {/* Emergency Emergency Mode Banner & Modal */}
      {emergencyActive && (
        <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 border-8 border-[var(--accent-red)] animate-pulse">
          <div className="bg-[var(--accent-red)] text-black font-black tracking-widest text-xs md:text-sm px-6 py-1 mb-6 uppercase hud-panel shadow-lg">
            NERV EMERGENCY SYSTEM ACTIVATED // LEVEL 1 DEFENSE CODE RED
          </div>

          <div className="text-[var(--accent-red)] font-mono text-center max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase text-glow-red">
              EMERGENCY LOCKDOWN
            </h2>
            <p className="text-sm md:text-base text-gray-300 mb-8 leading-relaxed">
              MAGI supercomputer consensus overridden. Emergency containment protocols active. Operative Lucas core functions remain 100% operational.
            </p>

            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 text-xs font-mono">
              <div className="p-3 bg-[var(--surface-panel)] border border-[var(--accent-red)]">
                <span className="block text-[var(--accent-orange)]">MELCHIOR-1</span>
                <span className="text-[var(--accent-red)] font-bold">LOCKED</span>
              </div>
              <div className="p-3 bg-[var(--surface-panel)] border border-[var(--accent-red)]">
                <span className="block text-[var(--accent-orange)]">BALTHASAR-2</span>
                <span className="text-[var(--accent-red)] font-bold">LOCKED</span>
              </div>
              <div className="p-3 bg-[var(--surface-panel)] border border-[var(--accent-red)]">
                <span className="block text-[var(--accent-orange)]">CASPAR-3</span>
                <span className="text-[var(--accent-red)] font-bold">LOCKED</span>
              </div>
            </div>

            <button
              onClick={toggleEmergency}
              className="px-8 py-3 bg-[var(--accent-red)] text-black font-extrabold tracking-wider uppercase hud-button hover:bg-red-600 transition-colors shadow-[0_0_20px_var(--accent-red-glow)]"
            >
              DISMISS EMERGENCY PROTOCOL
            </button>
          </div>
        </div>
      )}
    </>
  );
}
