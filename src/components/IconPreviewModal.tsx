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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 hud-backdrop-animate select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[var(--surface-panel)] border-2 border-[var(--accent-orange)] hud-panel shadow-[0_0_35px_var(--accent-orange-glow)] p-4 sm:p-6 relative text-[var(--text-primary)] font-mono overflow-y-auto max-h-[90vh] hud-modal-animate hud-glow-pulse"
        role="dialog"
        aria-modal="true"
      >
        <div className="hud-modal-content space-y-5">
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
              className="p-1.5 border border-[var(--border-grid)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] transition-colors hud-panel-sm"
              aria-label="Close icon modal"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Toast feedback */}
          {toastMessage && (
            <div className="p-2.5 bg-[var(--accent-green-glow)] border border-[var(--accent-green)] text-[var(--accent-green)] text-xs font-bold tracking-wider uppercase text-center animate-in fade-in slide-in-from-top-1 duration-150">
              {toastMessage}
            </div>
          )}

          {/* Global Mode Option: Random Rotation */}
          <div className="p-3.5 bg-[var(--bg-main)] border border-[var(--border-grid)] hud-panel-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[var(--surface-panel)] border border-[var(--border-grid)] flex items-center justify-center shrink-0">
                <ShuffleIcon className="w-4 h-4 text-[var(--accent-orange)]" />
              </div>
              <div>
                <span className="font-bold text-xs block text-[var(--text-primary)]">
                  {language === "pt" ? "MODO ROTAÇÃO DINÂMICA (ALEATÓRIA)" : "DYNAMIC RANDOM ROTATION"}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  {language === "pt"
                    ? "Sorteia automaticamente um dos 3 ícones táticos a cada carregamento de página"
                    : "Automatically picks one of the 3 tactical icons on every page refresh"}
                </span>
              </div>
            </div>
            <button
              onClick={() => selectVariant("random", language === "pt" ? "Modo Aleatório" : "Random Mode")}
              className={`px-3.5 py-1.5 text-xs font-black uppercase hud-button transition-all shrink-0 ${
                currentMode === "random"
                  ? "bg-[var(--accent-green)] text-black shadow-[0_0_10px_var(--accent-green-glow)]"
                  : "bg-[var(--surface-panel)] text-[var(--text-primary)] border border-[var(--border-grid)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)]"
              }`}
            >
              {currentMode === "random" ? (
                <span className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5" />
                  {language === "pt" ? "ATIVO" : "ACTIVE"}
                </span>
              ) : (
                <span>{language === "pt" ? "ATIVAR MODO" : "ENABLE"}</span>
              )}
            </button>
          </div>

          {/* Icon Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ICON_VARIANTS.map((icon: IconInfo) => {
              const isSelected = currentMode === icon.id;
              const name = language === "pt" ? icon.namePt : icon.name;
              const desc = language === "pt" ? icon.descriptionPt : icon.description;

              return (
                <div
                  key={icon.id}
                  className={`bg-[var(--bg-main)] border-2 p-4 hud-panel space-y-3 transition-all ${
                    isSelected
                      ? "border-[var(--accent-orange)] shadow-[0_0_15px_var(--accent-orange-glow)] bg-[var(--surface-panel)]"
                      : "border-[var(--border-grid)] hover:border-[var(--border-bright)]"
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-[var(--accent-orange)]">{icon.id.toUpperCase()}</span>
                    {isSelected && (
                      <span className="px-1.5 py-0.5 bg-[var(--accent-orange)] text-black font-black text-[9px] hud-panel-sm">
                        {language === "pt" ? "SELECIONADO" : "SELECTED"}
                      </span>
                    )}
                  </div>

                  {/* SVG Icon Visual Preview Container */}
                  <div className="h-28 bg-[var(--surface-panel)] border border-[var(--border-grid)] flex flex-col items-center justify-center p-3 relative overflow-hidden group">
                    <div className="w-16 h-16 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={icon.path}
                        alt={name}
                        className="w-14 h-14 object-contain drop-shadow-[0_0_8px_rgba(255,69,0,0.4)]"
                      />
                    </div>
                    <span className="absolute bottom-1 right-2 text-[8px] text-[var(--text-secondary)] font-mono">
                      SVG // 128px
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="font-black text-xs text-[var(--text-primary)] uppercase tracking-wide">
                      {name}
                    </h3>
                    <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed h-12 overflow-hidden">
                      {desc}
                    </p>
                  </div>

                  {/* Selection Button */}
                  <button
                    onClick={() => selectVariant(icon.id, name)}
                    className={`w-full py-2 text-xs font-black uppercase hud-button transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-[var(--accent-orange)] text-black shadow-[0_0_10px_var(--accent-orange-glow)]"
                        : "bg-[var(--surface-panel)] text-[var(--text-primary)] border border-[var(--border-grid)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <TargetIcon className="w-3.5 h-3.5" />
                        <span>{language === "pt" ? "ÍCONE FIXADO" : "ACTIVE ICON"}</span>
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
    </div>
  );
}
