"use client";

import React, { useState, useEffect } from "react";
import { useLanguage, EvaUnit } from "@/context/LanguageContext";
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

interface PilotInfo {
  name: string;
  unit: string;
  sync: string;
}

const THEMED_PILOTS: Record<Exclude<EvaUnit, "nerv">, PilotInfo> = {
  "eva-01": { name: "SHINJI IKARI", unit: "EVA-01 TEST TYPE", sync: "99.8%" },
  "eva-02": { name: "ASUKA LANGLEY", unit: "EVA-02 PRODUCTION", sync: "102.4%" },
  "eva-00": { name: "REI AYANAMI", unit: "EVA-00 PROTOTYPE", sync: "89.5%" },
};

const RANDOM_NERV_PILOTS: PilotInfo[] = [
  { name: "SHINJI IKARI", unit: "EVA-01 TEST TYPE", sync: "99.8%" },
  { name: "ASUKA LANGLEY", unit: "EVA-02 PRODUCTION", sync: "102.4%" },
  { name: "REI AYANAMI", unit: "EVA-00 PROTOTYPE", sync: "89.5%" },
  { name: "KAWORU NAGISA", unit: "EVA MARK.06", sync: "100.0%" },
  { name: "MARI MAKINAMI", unit: "EVA-08 PRODUCTION", sync: "95.2%" },
  { name: "TOJI SUZUHARA", unit: "EVA-03 ARMED", sync: "64.1%" },
];

function getPilotForTheme(unit: EvaUnit): PilotInfo {
  if (unit !== "nerv" && THEMED_PILOTS[unit]) {
    return THEMED_PILOTS[unit];
  }
  const randomIndex = Math.floor(Math.random() * RANDOM_NERV_PILOTS.length);
  return RANDOM_NERV_PILOTS[randomIndex];
}

export function AngelAttackOverlay() {
  const { language, evaUnit } = useLanguage();
  const [active, setActive] = useState<boolean>(false);
  const [konamiIndex, setKonamiIndex] = useState<number>(0);
  const [currentPilot, setCurrentPilot] = useState<PilotInfo>(() => getPilotForTheme(evaUnit));

  // Update or randomize pilot whenever overlay activates or theme changes
  useEffect(() => {
    if (active) {
      setCurrentPilot(getPilotForTheme(evaUnit));
    }
  }, [active, evaUnit]);

  // Listen for Konami Code sequence and secret triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const expectedKey = KONAMI_CODE[konamiIndex];
      if (e.key === "Escape" && active) {
        setActive(false);
        return;
      }
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
  }, [konamiIndex, active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 overflow-hidden border-8 border-[var(--accent-red)] hud-backdrop-animate select-none">
      {/* Top Banner Scrolling Warning */}
      <div className="w-full bg-[var(--accent-red)] text-black font-black font-mono text-xs sm:text-sm md:text-base py-2 px-4 flex justify-between items-center tracking-widest uppercase shadow-lg">
        <span className="animate-pulse">EMERGENCY ALERT // MAGI SYSTEM</span>
        <span className="hidden sm:inline">PATTERN BLUE IDENTIFIED</span>
        <span>NERV HQ LEVEL 1 LOCKDOWN</span>
      </div>

      {/* Center Tactical Warning Display */}
      <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 font-mono text-[var(--accent-red)] my-auto p-4 sm:p-6 bg-[var(--surface-panel)] border-2 border-[var(--accent-red)] hud-panel shadow-[0_0_50px_var(--accent-red-glow)] max-h-[80vh] overflow-y-auto hud-modal-animate">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 bg-[var(--accent-red)] text-black font-black text-[10px] sm:text-xs uppercase hud-panel-sm tracking-widest">
          <ShieldAlertIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="truncate">BLOOD TYPE: BLUE // ANGEL DETECTED</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-glow-red leading-none">
          ANGEL ATTACK
        </h1>

        <p className="text-sm md:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
          {language === "pt"
            ? `ALERTA MÁXIMO! Objeto não identificado cruzando a barreira de defesa do Geofront. Barreira de AT-Field ativada pelo Comando NERV. Piloto designado: ${currentPilot.name} (${currentPilot.unit}).`
            : `MAXIMUM ALERT! Unidentified object penetrating Geofront defense barrier. AT-Field containment activated by NERV Command. Designated pilot: ${currentPilot.name} (${currentPilot.unit}).`}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-black">
          <div className="p-2.5 sm:p-3 bg-[var(--accent-red)] hud-panel-sm truncate">
            {language === "pt" ? "ALVO: RAMIEL" : "TARGET: RAMIEL"}
          </div>
          <div className="p-2.5 sm:p-3 bg-[var(--accent-orange)] hud-panel-sm truncate">
            {language === "pt" ? "CÓDIGO: PADRÃO AZUL" : "CODE: PATTERN BLUE"}
          </div>
          <div className="p-2.5 sm:p-3 bg-[var(--accent-green)] hud-panel-sm truncate">
            {language === "pt" ? `SINCRO: ${currentPilot.sync} PRONTO` : `SYNC: ${currentPilot.sync} READY`}
          </div>
          <div className="p-2.5 sm:p-3 bg-yellow-400 hud-panel-sm truncate" title={currentPilot.name}>
            {language === "pt" ? `PILOTO: ${currentPilot.name}` : `PILOT: ${currentPilot.name}`}
          </div>
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
      <div className="w-full bg-[var(--accent-red)] text-black font-black font-mono text-[10px] sm:text-xs py-1.5 px-4 flex justify-between items-center tracking-widest uppercase">
        <span>NERV SECRET PROTOCOL UNLOCKED</span>
        <span className="hidden sm:inline">UNIT INTERFACE: {currentPilot.unit}</span>
        <span>EASTER EGG ACTIVATED</span>
      </div>
    </div>
  );
}
