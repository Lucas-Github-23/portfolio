"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ICON_VARIANTS, IconInfo, IconVariant } from "./DynamicFavicon";
import { ShuffleIcon, CheckIcon, TargetIcon, XIcon } from "./Icons";

interface IconPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IconPreviewModal({ isOpen, onClose }: IconPreviewModalProps) {
  const { language } = useLanguage();
  const [currentMode, setCurrentMode] = useState<IconVariant>("random");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = (localStorage.getItem("nerv_fav_variant") as IconVariant) || "random";
      setCurrentMode(saved);
    }
  }, [isOpen]);

  const selectVariant = (variant: IconVariant, name: string) => {
    setCurrentMode(variant);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nerv_change_icon", { detail: variant }));
    }
    
    const msg = language === "pt" 
      ? `Ícone atualizado: ${name} ${variant === "random" ? "(Modo Aleatório Ativo)" : ""}`
      : `Icon updated: ${name} ${variant === "random" ? "(Random Mode Active)" : ""}`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div 
        className="w-full max-w-3xl bg-[var(--surface-panel)] border-2 border-[var(--accent-orange)] hud-panel shadow-[0_0_30px_var(--accent-orange-glow)] p-4 sm:p-6 space-y-5 text-[var(--text-primary)] font-mono overflow-y-auto max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-grid)] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 bg-[var(--accent-orange)] rotate-45 inline-block" />
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider text-[var(--accent-orange)] uppercase">
                {language === "pt" ? "SELETOR & PREVIEW DE ÍCONES HUD" : "HUD ICON SELECTOR & PREVIEW"}
              </h2>
              <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">
                {language === "pt"
                  ? "Selecione o ícone da aba ou ative a rotação aleatória a cada acesso"
                  : "Select browser tab favicon or enable random rotation on each visit"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs border border-[var(--border-grid)] hover:border-[var(--accent-red)] hover:bg-[var(--accent-red)] hover:text-black font-bold uppercase transition-colors flex items-center gap-1.5"
          >
            <XIcon className="w-3.5 h-3.5" />
            <span>{language === "pt" ? "FECHAR" : "CLOSE"}</span>
          </button>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="p-2.5 bg-[var(--accent-green)]/15 border border-[var(--accent-green)] text-[var(--accent-green)] text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Quick Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-black/40 border border-[var(--border-grid)] hud-panel-sm">
          <div className="text-xs flex items-center gap-1.5 flex-wrap">
            <span className="text-[var(--text-secondary)]">
              {language === "pt" ? "MODO ATUAL:" : "CURRENT MODE:"}
            </span>{" "}
            <span className="font-extrabold text-[var(--accent-orange)] uppercase flex items-center gap-1">
              {currentMode === "random" ? (
                <>
                  <ShuffleIcon className="w-3.5 h-3.5 text-[var(--accent-green)] inline" />
                  <span>{language === "pt" ? "Aleatório (Rotaciona a cada visita)" : "Random (Rotates on each visit)"}</span>
                </>
              ) : (
                <>
                  <TargetIcon className="w-3.5 h-3.5 text-[var(--accent-orange)] inline" />
                  <span>{language === "pt" ? `Fixo (${currentMode})` : `Fixed (${currentMode})`}</span>
                </>
              )}
            </span>
          </div>
          
          <button
            onClick={() => selectVariant("random", language === "pt" ? "Modo Aleatório" : "Random Mode")}
            className={`px-3 py-1.5 text-xs font-black uppercase transition-all hud-button flex items-center gap-1.5 ${
              currentMode === "random"
                ? "bg-[var(--accent-green)] text-black shadow-[0_0_10px_var(--accent-green-glow)]"
                : "border border-[var(--accent-green)] text-[var(--accent-green)] hover:bg-[var(--accent-green)] hover:text-black"
            }`}
          >
            <ShuffleIcon className="w-3.5 h-3.5" />
            <span>{language === "pt" ? "ATIVAR MODO ALEATÓRIO" : "ENABLE RANDOM MODE"}</span>
          </button>
        </div>

        {/* 3 Icons Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ICON_VARIANTS.map((icon: IconInfo, index: number) => {
            const isSelected = currentMode === icon.id;
            return (
              <div
                key={icon.id}
                className={`relative flex flex-col justify-between p-4 border hud-panel-sm transition-all bg-black/50 ${
                  isSelected
                    ? "border-[var(--accent-orange)] shadow-[0_0_15px_var(--accent-orange-glow)] scale-[1.02]"
                    : "border-[var(--border-grid)] hover:border-[var(--text-secondary)] hover:bg-black/70"
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3 text-[10px]">
                  <span className="px-1.5 py-0.5 font-extrabold bg-[var(--surface-dark)] border border-[var(--border-grid)] text-[var(--text-secondary)]">
                    #0{index + 1}
                  </span>
                  <span 
                    className="font-bold tracking-widest text-[9px] px-1.5 py-0.5 rounded"
                    style={{ color: icon.themeColor, backgroundColor: `${icon.themeColor}15`, border: `1px solid ${icon.themeColor}40` }}
                  >
                    {icon.badge}
                  </span>
                </div>

                {/* Big Preview Area */}
                <div className="my-2 p-4 bg-[#0a0a0d] border border-[var(--border-grid)] rounded flex flex-col items-center justify-center group relative overflow-hidden">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center p-1 transition-transform group-hover:scale-110 duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={icon.path}
                      alt={icon.name}
                      className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,69,0,0.3)]"
                    />
                  </div>
                  <span className="text-[9px] text-[var(--text-secondary)] font-mono mt-2 tracking-widest">
                    {icon.path}
                  </span>
                </div>

                {/* Info & Description */}
                <div className="mt-2 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)]">
                    {language === "pt" ? icon.namePt : icon.name}
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed min-h-[40px]">
                    {language === "pt" ? icon.descriptionPt : icon.description}
                  </p>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => selectVariant(icon.id, language === "pt" ? icon.namePt : icon.name)}
                  className={`mt-4 w-full py-2 text-xs font-black uppercase transition-all hud-button flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-[var(--accent-orange)] text-black shadow-[0_0_10px_var(--accent-orange-glow)]"
                      : "border border-[var(--border-grid)] text-[var(--text-primary)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckIcon className="w-3.5 h-3.5 text-black stroke-[3]" />
                      <span>{language === "pt" ? "ATIVO NA ABA" : "ACTIVE IN TAB"}</span>
                    </>
                  ) : (
                    <span>{language === "pt" ? "USAR ESTE ÍCONE" : "USE THIS ICON"}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-[var(--border-grid)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[var(--text-secondary)]">
          <div>
            <span>NERV HUD // FAVICON RESOLUTION: 128x128 SCALABLE VECTOR SVG</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[var(--surface-dark)] border border-[var(--border-grid)] text-[var(--text-primary)] hover:bg-[var(--surface-panel)] text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
            >
              <CheckIcon className="w-3.5 h-3.5 text-[var(--accent-green)]" />
              <span>{language === "pt" ? "CONCLUIR" : "DONE"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
