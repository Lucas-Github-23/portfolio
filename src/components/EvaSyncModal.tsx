"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLanguage, EvaUnit } from "@/context/LanguageContext";
import { CheckIcon, TargetIcon, XIcon, ActivityIcon, CpuIcon } from "./Icons";

interface EvaSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EvaSyncModal({ isOpen, onClose }: EvaSyncModalProps) {
  const { language, t, evaUnit, setEvaUnit } = useLanguage();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 350);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  const selectUnit = (unit: EvaUnit, unitName: string) => {
    setEvaUnit(unit);
    const msg =
      language === "pt"
        ? `Sincronização estabelecida: ${unitName} // Taxa de Sincro: 100%`
        : `Neural link established: ${unitName} // Sync Rate: 100%`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if ((!isOpen && !isClosing) || !mounted) return null;

  const units: {
    id: EvaUnit;
    name: string;
    pilot: string;
    desc: string;
    modelTag: string;
    primaryHex: string;
    accentHex: string;
    bgHex: string;
  }[] = [
    {
      id: "nerv",
      name: t.hud.evaUnits.nerv.name,
      pilot: t.hud.evaUnits.nerv.pilot,
      desc: t.hud.evaUnits.nerv.desc,
      modelTag: "STANDARD // HQ-01",
      primaryHex: "#ff4500",
      accentHex: "#00ff66",
      bgHex: "#080808",
    },
    {
      id: "eva-01",
      name: t.hud.evaUnits.eva01.name,
      pilot: t.hud.evaUnits.eva01.pilot,
      desc: t.hud.evaUnits.eva01.desc,
      modelTag: "TEST TYPE // SYNC A-01",
      primaryHex: "#a855f7",
      accentHex: "#00ff66",
      bgHex: "#0b0714",
    },
    {
      id: "eva-02",
      name: t.hud.evaUnits.eva02.name,
      pilot: t.hud.evaUnits.eva02.pilot,
      desc: t.hud.evaUnits.eva02.desc,
      modelTag: "PRODUCTION // COMBAT",
      primaryHex: "#ff2238",
      accentHex: "#ffb703",
      bgHex: "#0e0506",
    },
    {
      id: "eva-00",
      name: t.hud.evaUnits.eva00.name,
      pilot: t.hud.evaUnits.eva00.pilot,
      desc: t.hud.evaUnits.eva00.desc,
      modelTag: "PROTOTYPE // RECON",
      primaryHex: "#00b4d8",
      accentHex: "#fbbf24",
      bgHex: "#050a14",
    },
  ];

  return createPortal(
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 select-none ${
        isClosing ? "hud-backdrop-closing" : "hud-backdrop-animate"
      }`}
    >
      <div className={`w-full max-w-3xl relative ${isClosing ? "hud-laser-closing" : ""}`}>
        {/* Dual split laser lines */}
        <div className="hud-laser-line hud-laser-line-left" />
        <div className="hud-laser-line hud-laser-line-right" />

        {/* Modal body */}
        <div className="hud-laser-expand w-full">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[var(--surface-panel)] border-2 border-[var(--accent-orange)] hud-panel shadow-[0_0_35px_var(--accent-orange-glow)] p-4 sm:p-6 relative text-[var(--text-primary)] font-mono overflow-y-auto max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-grid)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 bg-[var(--accent-orange)] rotate-45 inline-block" />
                  <div>
                    <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider text-[var(--accent-orange)] uppercase">
                      {t.hud.evaModalTitle}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">
                      {t.hud.evaModalSubtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 border border-[var(--border-grid)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] transition-colors hud-panel-sm"
                  aria-label="Close EVA modal"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Toast Feedback */}
              {toastMessage && (
                <div className="p-2.5 bg-[var(--accent-green-glow)] border border-[var(--accent-green)] text-[var(--accent-green)] text-xs font-bold tracking-wider uppercase text-center animate-in fade-in slide-in-from-top-1 duration-150">
                  {toastMessage}
                </div>
              )}

              {/* Units Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {units.map((unit) => {
                  const isSelected = evaUnit === unit.id;

                  return (
                    <div
                      key={unit.id}
                      className={`p-4 border-2 hud-panel space-y-3 transition-all relative ${
                        isSelected
                          ? "bg-[var(--surface-panel-hover)] border-[var(--accent-orange)] shadow-[0_0_20px_var(--accent-orange-glow)]"
                          : "bg-[var(--bg-main)] border-[var(--border-grid)] hover:border-[var(--border-bright)]"
                      }`}
                    >
                      {/* Top Bar: Model Badge & Status */}
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-[var(--text-secondary)] tracking-widest uppercase">
                          {unit.modelTag}
                        </span>
                        {isSelected ? (
                          <span className="px-2 py-0.5 bg-[var(--accent-green)] text-black font-black text-[9px] rounded-sm tracking-wider uppercase flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                            {language === "pt" ? "SINCRO 100%" : "ACTIVE 100%"}
                          </span>
                        ) : (
                          <span className="text-[9px] text-[var(--text-secondary)] font-mono">
                            STANDBY
                          </span>
                        )}
                      </div>

                      {/* Unit Title & Pilot */}
                      <div>
                        <h3 className="text-base font-black uppercase text-[var(--text-primary)] tracking-wide">
                          {unit.name}
                        </h3>
                        <div className="text-[10px] text-[var(--accent-orange)] font-bold tracking-wider mt-0.5 flex items-center gap-1.5">
                          <ActivityIcon className="w-3 h-3 shrink-0" />
                          <span>{unit.pilot}</span>
                        </div>
                      </div>

                      {/* Color Palette Swatches Preview */}
                      <div className="p-2.5 bg-[var(--surface-panel)] border border-[var(--border-grid)] flex items-center justify-between gap-2">
                        <span className="text-[9px] text-[var(--text-secondary)] uppercase">
                          PALETTE //
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[9px]">
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shadow-sm inline-block"
                              style={{ backgroundColor: unit.bgHex }}
                              title="Base Surface"
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shadow-sm inline-block"
                              style={{ backgroundColor: unit.primaryHex }}
                              title="Primary Neon Accent"
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shadow-sm inline-block"
                              style={{ backgroundColor: unit.accentHex }}
                              title="Secondary Neon Accent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed h-8 overflow-hidden">
                        {unit.desc}
                      </p>

                      {/* Action Button */}
                      <button
                        onClick={() => selectUnit(unit.id, unit.name)}
                        className={`w-full py-2 text-xs font-black uppercase hud-button transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? "bg-[var(--accent-orange)] text-black shadow-[0_0_12px_var(--accent-orange-glow)] cursor-default"
                            : "bg-[var(--surface-panel)] text-[var(--text-primary)] border border-[var(--border-grid)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] active:scale-95"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <TargetIcon className="w-3.5 h-3.5" />
                            <span>{language === "pt" ? "SISTEMA SINCRONIZADO" : "SYNCHRONIZED"}</span>
                          </>
                        ) : (
                          <>
                            <CpuIcon className="w-3.5 h-3.5" />
                            <span>{language === "pt" ? "SINCRONIZAR UNIDADE" : "SYNCHRONIZE UNIT"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer Note */}
              <div className="pt-2 border-t border-[var(--border-grid)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[var(--text-secondary)]">
                <div>
                  <span>EVA NEURAL LINK // REAL-TIME CSS MATRIX INJECTION</span>
                </div>
                <div>
                  <button
                    onClick={handleClose}
                    className="px-4 py-1.5 bg-[var(--surface-dark)] border border-[var(--border-grid)] text-[var(--text-primary)] hover:bg-[var(--surface-panel)] text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
                  >
                    <CheckIcon className="w-3.5 h-3.5 text-[var(--accent-green)]" />
                    <span>{language === "pt" ? "CONCLUIR" : "DONE"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
