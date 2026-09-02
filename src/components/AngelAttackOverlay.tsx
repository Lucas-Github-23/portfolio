"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldAlertIcon } from "./Icons";

// Konami Code sequence: Up, Up, Down, Down, Left, Right, Left, Right, b, a
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function AngelAttackOverlay() {
  const { language } = useLanguage();
  const [active, setActive] = useState<boolean>(false);
  const [konamiIndex, setKonamiIndex] = useState<number>(0);

  // Listen for Konami Code sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const expectedKey = KONAMI_CODE[konamiIndex];
      if (e.key.toLowerCase() === expectedKey.toLowerCase()) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === KONAMI_CODE.length) {
          setActive(true);
          setKonamiIndex(0);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    // Listen for custom trigger event (e.g. secret click on NERV logo in HUD)
    const handleSecretTrigger = () => {
      setActive(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("nerv_angel_attack", handleSecretTrigger);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("nerv_angel_attack", handleSecretTrigger);
    };
  }, [konamiIndex]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 overflow-hidden border-8 border-[var(--accent-red)] animate-pulse">
      {/* Top Banner Scrolling Warning */}
      <div className="w-full bg-[var(--accent-red)] text-black font-black font-mono text-sm md:text-base py-2 px-4 flex justify-between items-center tracking-widest uppercase shadow-lg">
        <span className="animate-pulse">EMERGENCY ALERT // MAGI SYSTEM</span>
        <span>PATTERN BLUE IDENTIFIED</span>
        <span className="hidden sm:inline">NERV HQ LEVEL 1 LOCKDOWN</span>
      </div>

      {/* Center Tactical Warning Display */}
      <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 font-mono text-[var(--accent-red)] my-auto p-4 sm:p-6 bg-[var(--surface-panel)] border-2 border-[var(--accent-red)] hud-panel shadow-[0_0_50px_var(--accent-red-glow)] max-h-[80vh] overflow-y-auto">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 bg-[var(--accent-red)] text-black font-black text-[10px] sm:text-xs uppercase hud-panel-sm tracking-widest">
          <ShieldAlertIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="truncate">BLOOD TYPE: BLUE // ANGEL DETECTED</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-glow-red leading-none">
          ANGEL ATTACK
        </h1>

        <p className="text-sm md:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
          {language === "pt"
            ? "ALERTA MÁXIMO! Objeto não identificado cruzando a barreira de defesa do Geofront. Barreira de AT-Field ativada pelo Comando NERV."
            : "MAXIMUM ALERT! Unidentified object penetrating Geofront defense barrier. AT-Field containment activated by NERV Command."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 text-xs font-bold text-black">
          <div className="p-3 bg-[var(--accent-red)] hud-panel-sm">TARGET: RAMIEL</div>
          <div className="p-3 bg-[var(--accent-orange)] hud-panel-sm">CODE: PATTERN BLUE</div>
          <div className="p-3 bg-[var(--accent-green)] hud-panel-sm">SYNC: 99.8% READY</div>
          <div className="p-3 bg-yellow-400 hud-panel-sm">PILOT: SHINJI</div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setActive(false)}
            className="px-8 py-3.5 bg-[var(--accent-red)] text-black font-black text-sm tracking-widest uppercase hud-button hover:bg-red-600 transition-colors shadow-[0_0_25px_var(--accent-red-glow)]"
          >
            {language === "pt" ? "DESTRANCAR COMANDO NERV" : "DISMISS CONTAINMENT"}
          </button>
        </div>
      </div>

      {/* Bottom Banner Warning */}
      <div className="w-full bg-[var(--accent-red)] text-black font-black font-mono text-xs py-1.5 px-4 flex justify-between items-center tracking-widest uppercase">
        <span>NERV SECRET PROTOCOL UNLOCKED</span>
        <span>EASTER EGG ACTIVATED</span>
      </div>
    </div>
  );
}
