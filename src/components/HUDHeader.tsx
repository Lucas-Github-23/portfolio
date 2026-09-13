"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage, useTheme, useTactical } from "@/context";
import { SunIcon, MoonIcon, ShieldAlertIcon, MonitorIcon, LayersIcon, TerminalIcon } from "./Icons";
import { IconPreviewModal } from "./IconPreviewModal";
import { EvaSyncModal } from "./EvaSyncModal";
import { IconVariant } from "./DynamicFavicon";
import { safeGetItem } from "@/utils/storage";

export function HUDHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, crtEnabled, toggleCrt, evaUnit } = useTheme();
  const { activeSection, setActiveSection, toggleEmergency } = useTactical();

  const [timeString, setTimeString] = useState<string>("");
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isMenuClosing, setIsMenuClosing] = useState<boolean>(false);
  const [iconModalOpen, setIconModalOpen] = useState<boolean>(false);
  const [evaModalOpen, setEvaModalOpen] = useState<boolean>(false);
  const [iconVariant, setIconVariant] = useState<IconVariant>("random");
  const [systemMenuOpen, setSystemMenuOpen] = useState<boolean>(false);
  const [isSystemMenuClosing, setIsSystemMenuClosing] = useState<boolean>(false);
  const systemMenuRef = useRef<HTMLDivElement>(null);

  const closeSystemMenu = (callback?: () => void) => {
    if (isSystemMenuClosing) return;
    if (!systemMenuOpen) {
      if (callback) callback();
      return;
    }
    setIsSystemMenuClosing(true);
    setTimeout(() => {
      setSystemMenuOpen(false);
      setIsSystemMenuClosing(false);
      if (callback) callback();
    }, 350);
  };

  const toggleSystemMenu = () => {
    if (systemMenuOpen) {
      closeSystemMenu();
    } else {
      setSystemMenuOpen(true);
    }
  };

  const [headerVisible, setHeaderVisible] = useState<boolean>(true);
  const lastScrollY = useRef<number>(0);
  const scrollLockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close desktop system menu on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (systemMenuRef.current && !systemMenuRef.current.contains(e.target as Node)) {
        closeSystemMenu();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSystemMenu();
    };

    if (systemMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [systemMenuOpen, isSystemMenuClosing]);

  // Lock body scroll when mobile menu is open so interacting with menu doesn't scroll page underneath
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Smart Header Scroll: appears on scroll up, hides on scroll down, always visible at top or when menu is open
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0);

      // Keep header visible when mobile menu is active
      if (mobileMenuOpen || isMenuClosing) {
        setHeaderVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Always visible near the top
      if (currentScrollY <= 40) {
        setHeaderVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;

      // Scrolling down significantly -> hide header
      if (delta > 6 && currentScrollY > 70) {
        setHeaderVisible(false);
      }
      // Scrolling up -> reveal header immediately!
      else if (delta < -6) {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen, isMenuClosing]);

  const closeMobileMenu = (callback?: () => void) => {
    if (isMenuClosing) return;
    if (!mobileMenuOpen) {
      if (callback) callback();
      return;
    }
    setIsMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsMenuClosing(false);
      if (callback) callback();
    }, 350);
  };

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      setHeaderVisible(true);
      setMobileMenuOpen(true);
    }
  };

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks >= 5) {
      window.dispatchEvent(new CustomEvent("nerv_angel_attack"));
      setLogoClicks(0);
    }
  };

  const handleNavClick = (id: (typeof navItems)[number]["id"]) => {
    setHeaderVisible(true);
    closeMobileMenu(() => {
      setActiveSection(id);
      setHeaderVisible(true);
      if (scrollLockTimeoutRef.current) clearTimeout(scrollLockTimeoutRef.current);
      scrollLockTimeoutRef.current = setTimeout(() => {
        lastScrollY.current = Math.max(0, window.scrollY || 0);
      }, 1000);
    });
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toISOString().replace("T", " // ").substring(0, 22) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = safeGetItem("nerv_fav_variant", "random") as IconVariant;
    setIconVariant(saved);

    const handleIconChange = (e: CustomEvent<IconVariant>) => {
      setIconVariant(e.detail);
    };

    window.addEventListener("nerv_change_icon" as never, handleIconChange as never);
    return () => {
      window.removeEventListener("nerv_change_icon" as never, handleIconChange as never);
    };
  }, []);

  const navItems = [
    { id: "status", label: t.nav.status },
    { id: "magi", label: "MAGI" },
    { id: "projects", label: t.nav.projects },
    { id: "skills", label: t.nav.skills },
    { id: "experience", label: t.nav.experience },
    { id: "contact", label: t.nav.contact },
  ] as const;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border-grid)] shadow-md transition-transform duration-300 ease-in-out ${
          headerVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Top Warning Ribbon */}
        <div className="w-full bg-[var(--accent-orange)] text-black font-mono text-[10px] md:text-xs py-0.5 px-3 md:px-4 flex justify-between items-center font-bold tracking-widest uppercase overflow-hidden">
          <span className="truncate pr-2">
            NERV HQ SECURITY // MAGI-01
          </span>
          <span className="hidden md:inline whitespace-nowrap">
            {timeString || "2026-08-31 // 20:00:00 UTC"}
          </span>
          <span className="whitespace-nowrap shrink-0 text-[9px] md:text-[10px]">TOP SECRET</span>
        </div>

        {/* Main HUD Bar */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-3 md:px-4 py-2 min-h-[56px] sm:min-h-[60px] md:min-h-[64px] flex items-center justify-between gap-2 md:gap-4">
          {/* Brand / Logo */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0 shrink">
            <div
              onClick={handleLogoClick}
              className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--accent-orange)] text-black font-black text-xs flex items-center justify-center hud-panel-sm font-mono shadow-[0_0_10px_var(--accent-orange-glow)] cursor-pointer select-none hover:scale-105 active:scale-95 transition-transform shrink-0"
              title="NERV HQ LOGO (Secret Click x5)"
            >
              NERV
            </div>
            <div className="min-w-0">
              <div className="font-mono text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-[var(--text-primary)] flex items-center gap-1 sm:gap-1.5 whitespace-nowrap truncate">
                <span className="truncate">LUCAS // {evaUnit === "nerv" ? "DEV-02" : evaUnit.toUpperCase()}</span>
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--accent-green)] animate-ping shrink-0" />
              </div>
              <div className="font-mono text-[8px] sm:text-[9px] md:text-[10px] text-[var(--text-secondary)] tracking-widest uppercase whitespace-nowrap truncate">
                {t.hud.location}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links / Section Switcher Tabs */}
          <nav className="hidden lg:flex items-center gap-3 font-mono text-xs font-bold tracking-wider whitespace-nowrap">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3 py-1.5 transition-all uppercase hud-button ${
                    isActive
                      ? "bg-[var(--accent-orange)] text-black font-black shadow-[0_0_10px_var(--accent-orange-glow)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--accent-orange)] hover:bg-[var(--surface-panel)] border border-transparent hover:border-[var(--border-grid)]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Controls: Language, Theme & Desktop Tactical System Menu (or Mobile Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs shrink-0 whitespace-nowrap">
            {/* Language Switcher */}
            <div className="flex border border-[var(--border-grid)] p-0.5 hud-panel-sm bg-[var(--surface-panel)]">
              <button
                onClick={() => setLanguage("en")}
                className={`px-1.5 sm:px-2 py-1 font-bold text-[9px] sm:text-[10px] transition-colors ${
                  language === "en"
                    ? "bg-[var(--accent-orange)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("pt")}
                className={`px-1.5 sm:px-2 py-1 font-bold text-[9px] sm:text-[10px] transition-colors ${
                  language === "pt"
                    ? "bg-[var(--accent-orange)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                PT
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 border border-[var(--border-grid)] bg-[var(--surface-panel)] text-[var(--text-secondary)] hover:text-[var(--accent-orange)] transition-colors hud-panel-sm cursor-pointer"
              title={theme === "dark" ? t.hud.themeLight : t.hud.themeDark}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Desktop Tactical System Menu (EVA, Icons, CRT, Emergency Compressed) */}
            <div className="relative hidden lg:block" ref={systemMenuRef}>
              <button
                onClick={toggleSystemMenu}
                className={`p-1.5 px-2.5 border hud-panel-sm flex items-center gap-2 text-[11px] font-bold transition-all cursor-pointer select-none ${
                  systemMenuOpen
                    ? "border-[var(--accent-orange)] text-[var(--accent-orange)] bg-[var(--surface-panel)] shadow-[0_0_12px_var(--accent-orange-glow)]"
                    : "border-[var(--border-grid)] bg-[var(--surface-panel)] text-[var(--text-secondary)] hover:text-[var(--accent-orange)] hover:border-[var(--accent-orange)]"
                }`}
                title={language === "pt" ? "Menu Tático (Cores, Ícones, CRT, Emergência)" : "Tactical Menu (Colors, Icons, CRT, Emergency)"}
                aria-expanded={systemMenuOpen}
              >
                <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] animate-pulse" />
                <span className="tracking-wider">MENU</span>
                <span className="px-1 py-0.2 bg-[var(--accent-orange)] text-black text-[8px] font-black rounded-sm uppercase">
                  {evaUnit === "nerv" ? "NERV" : evaUnit.replace("eva-", "0")}
                </span>
                <span className="text-[9px] text-[var(--text-secondary)]">
                  {systemMenuOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Tactical Dropdown Menu with Sci-Fi Laser Unfold & Reverse Collapse */}
              {(systemMenuOpen || isSystemMenuClosing) && (
                <div className={`absolute right-0 top-full mt-2 w-72 z-50 shadow-2xl ${isSystemMenuClosing ? "hud-laser-closing" : ""}`}>
                  {/* Dual split laser lines */}
                  <div className="hud-laser-line hud-laser-line-left" />
                  <div className="hud-laser-line hud-laser-line-right" />

                  {/* 2-Phase laser expand body */}
                  <div className="hud-laser-expand w-full">
                    <div className="bg-[var(--bg-main)]/98 backdrop-blur-xl border-2 border-[var(--accent-orange)] hud-panel p-3.5 space-y-2.5 shadow-2xl font-mono">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-[var(--border-grid)] pb-2 text-[10px]">
                        <span className="text-[var(--accent-orange)] font-bold tracking-widest uppercase flex items-center gap-1.5">
                          <TerminalIcon className="w-3.5 h-3.5" />
                          TACTICAL MENU
                        </span>
                        <span className="text-[var(--text-secondary)] text-[8px]">SYS-OP // 01</span>
                      </div>

                      {/* 1. EVA Unit Neural Sync */}
                      <button
                        onClick={() => {
                          closeSystemMenu(() => setEvaModalOpen(true));
                        }}
                        className="w-full p-2.5 bg-[var(--surface-panel)] border border-[var(--border-grid)] hover:border-[var(--accent-orange)] transition-colors hud-panel-sm flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)] animate-pulse shrink-0" />
                          <div>
                            <span className="block text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors">
                              {t.hud.evaSync}
                            </span>
                            <span className="text-[9px] text-[var(--text-secondary)]">
                              {language === "pt" ? "Alterar cores do tema (EVA)" : "Switch theme colors (EVA)"}
                            </span>
                          </div>
                        </div>
                        <span className="px-1.5 py-0.5 bg-[var(--accent-orange)] text-black text-[9px] font-black uppercase rounded-sm shrink-0">
                          {evaUnit === "nerv" ? "NERV HQ" : evaUnit.toUpperCase()}
                        </span>
                      </button>

                      {/* 2. HUD Favicon / Icon Matrix */}
                      <button
                        onClick={() => {
                          closeSystemMenu(() => setIconModalOpen(true));
                        }}
                        className="w-full p-2.5 bg-[var(--surface-panel)] border border-[var(--border-grid)] hover:border-[var(--accent-orange)] transition-colors hud-panel-sm flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <LayersIcon className="w-4 h-4 text-[var(--accent-orange)] shrink-0" />
                          <div>
                            <span className="block text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors">
                              {language === "pt" ? "SELETOR DE ÍCONES" : "ICONS PREVIEW"}
                            </span>
                            <span className="text-[9px] text-[var(--text-secondary)]">
                              {language === "pt" ? "Visualizar e alternar ícones" : "Preview & switch icons"}
                            </span>
                          </div>
                        </div>
                        {iconVariant === "random" ? (
                          <span className="px-1.5 py-0.5 bg-[var(--accent-green)] text-black text-[9px] font-black uppercase rounded-sm shadow-[0_0_6px_var(--accent-green-glow)] shrink-0">
                            RANDOM
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-[var(--accent-orange)] text-black text-[9px] font-black uppercase rounded-sm shrink-0">
                            {iconVariant.toUpperCase()}
                          </span>
                        )}
                      </button>

                      {/* 3. CRT Scanlines Overlay Toggle */}
                      <button
                        onClick={toggleCrt}
                        className={`w-full p-2.5 border hud-panel-sm flex items-center justify-between text-left transition-all cursor-pointer ${
                          crtEnabled
                            ? "border-[var(--accent-green)] bg-[var(--accent-green-glow)]/15 text-[var(--text-primary)]"
                            : "border-[var(--border-grid)] bg-[var(--surface-panel)] text-[var(--text-secondary)] hover:border-[var(--accent-orange)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <MonitorIcon className={`w-4 h-4 shrink-0 ${crtEnabled ? "text-[var(--accent-green)]" : "text-[var(--text-secondary)]"}`} />
                          <div>
                            <span className="block text-xs font-bold">
                              {t.hud.crtScanlines}
                            </span>
                            <span className="text-[9px] text-[var(--text-secondary)]">
                              {language === "pt" ? "Filtro retrô de fósforo CRT" : "Retro CRT phosphor overlay"}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-black uppercase rounded-sm border shrink-0 ${
                            crtEnabled
                              ? "bg-[var(--accent-green)] text-black border-[var(--accent-green)] shadow-[0_0_6px_var(--accent-green-glow)]"
                              : "bg-[var(--surface-panel)] text-[var(--text-secondary)] border-[var(--border-grid)]"
                          }`}
                        >
                          {crtEnabled ? "ON" : "OFF"}
                        </span>
                      </button>

                      {/* 4. Emergency Alert Protocol */}
                      <button
                        onClick={() => {
                          closeSystemMenu(() => toggleEmergency());
                        }}
                        className="w-full py-2.5 px-3 bg-[var(--accent-red)] text-black font-extrabold text-xs tracking-wider uppercase hud-button hover:opacity-90 transition-opacity shadow-[0_0_12px_var(--accent-red-glow)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShieldAlertIcon className="w-4 h-4 shrink-0" />
                        <span>{t.hud.emergency}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button (Rightmost on Mobile) */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden px-2.5 py-1.5 bg-[var(--surface-panel)] border border-[var(--border-grid)] text-[var(--accent-orange)] font-bold text-xs uppercase hud-panel-sm hover:border-[var(--accent-orange)] transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
              aria-label="Toggle Mobile Navigation"
            >
              <span className="text-[10px]">{mobileMenuOpen ? "✕" : "☰"}</span>
              <span>MENU</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {(mobileMenuOpen || isMenuClosing) && (
          <>
            {/* Backdrop for outside click */}
            <div
              onClick={() => closeMobileMenu()}
              className={`lg:hidden fixed inset-0 top-[76px] bg-black/75 backdrop-blur-sm z-40 ${
                isMenuClosing ? "hud-backdrop-closing" : "hud-backdrop-animate"
              }`}
            />

            <div className={`absolute top-full left-0 right-0 w-full z-50 lg:hidden shadow-2xl ${isMenuClosing ? "hud-laser-closing" : ""}`}>
              {/* Dual split laser lines: start merged at center, grow up & down, split outwards tracking the borders */}
              <div className="hud-laser-line hud-laser-line-left" />
              <div className="hud-laser-line hud-laser-line-right" />

              {/* Menu body: expands sideways only after 0.3s */}
              <div className="hud-laser-expand w-full">
                <div className="bg-[var(--bg-main)]/98 backdrop-blur-xl border-2 border-[var(--accent-orange)] hud-panel p-3 sm:p-4 space-y-3 max-h-[calc(100vh-85px)] max-h-[calc(100lvh-85px)] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`p-2.5 sm:p-3 text-left transition-all uppercase hud-button flex items-center justify-between text-xs active:scale-95 ${
                          isActive
                            ? "bg-[var(--accent-orange)] text-black font-black shadow-[0_0_12px_var(--accent-orange-glow)]"
                            : "bg-[var(--surface-panel)] text-[var(--text-secondary)] border border-[var(--border-grid)] hover:text-[var(--accent-orange)] hover:border-[var(--accent-orange)]/50"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {isActive && <span className="text-[10px] font-black shrink-0 ml-1">●</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Secondary Tactical Actions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-grid)] font-mono text-xs">
                  {/* EVA Unit Sync Selector Button (Mobile) */}
                  <button
                    onClick={() => {
                      closeMobileMenu(() => setEvaModalOpen(true));
                    }}
                    className="w-full py-2.5 px-3 border border-[var(--accent-orange)] bg-[var(--surface-panel)] text-[var(--text-primary)] font-bold text-xs uppercase hud-button flex items-center justify-between gap-2 active:scale-95 transition-transform"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-orange)] animate-pulse" />
                      <span>{t.hud.evaSync}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-[var(--accent-orange)] text-black text-[9px] font-black tracking-wider uppercase rounded-sm">
                      {evaUnit === "nerv" ? "NERV HQ" : evaUnit.toUpperCase()}
                    </span>
                  </button>

                  {/* Icon Selector Button with Active Status Visibility */}
                  <button
                    onClick={() => {
                      closeMobileMenu(() => setIconModalOpen(true));
                    }}
                    className="w-full py-2.5 px-3 border border-[var(--accent-orange)] bg-[var(--surface-panel)] text-[var(--text-primary)] font-bold text-xs uppercase hud-button flex items-center justify-between gap-2 active:scale-95 transition-transform"
                  >
                    <div className="flex items-center gap-2">
                      <LayersIcon className="w-4 h-4 text-[var(--accent-orange)] shrink-0" />
                      <span>{language === "pt" ? "SELETOR DE ÍCONES" : "ICONS PREVIEW"}</span>
                    </div>
                    {iconVariant === "random" ? (
                      <span className="px-2 py-0.5 bg-[var(--accent-green)] text-black text-[9px] font-black tracking-wider flex items-center gap-1.5 rounded-sm shadow-[0_0_8px_var(--accent-green-glow)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                        {language === "pt" ? "ALEATÓRIO: ON" : "RANDOM: ON"}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[var(--accent-orange)] text-black text-[9px] font-black tracking-wider uppercase rounded-sm">
                        {language === "pt" ? `FIXO: ${iconVariant.toUpperCase()}` : `FIXED: ${iconVariant.toUpperCase()}`}
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleCrt}
                      className={`flex-1 py-2 px-3 border hud-button flex items-center justify-center gap-1.5 text-xs font-bold uppercase transition-all active:scale-95 ${
                        crtEnabled
                          ? "border-[var(--accent-green)] text-[var(--accent-green)] bg-[var(--accent-green-glow)]"
                          : "border-[var(--border-grid)] bg-[var(--surface-panel)] text-[var(--text-secondary)]"
                      }`}
                    >
                      <MonitorIcon />
                      <span>CRT: {crtEnabled ? "ON" : "OFF"}</span>
                    </button>

                    <button
                      onClick={() => {
                        closeMobileMenu(() => toggleEmergency());
                      }}
                      className="flex-1 py-2 px-3 bg-[var(--accent-red)] text-black font-black text-xs uppercase hud-button flex items-center justify-center gap-1.5 shadow-[0_0_10px_var(--accent-red-glow)] active:scale-95 transition-transform"
                    >
                      <ShieldAlertIcon className="w-3.5 h-3.5" />
                      <span>{t.hud.emergency}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        )}
      </header>

      {/* Header Spacer to preserve natural flow layout and hero clearance */}
      <div className="h-[76px] sm:h-[80px] md:h-[84px] w-full shrink-0 pointer-events-none" aria-hidden="true" />

      {/* Interactive Icon Selector & Live Preview Modal */}
      <IconPreviewModal
        isOpen={iconModalOpen}
        onClose={() => setIconModalOpen(false)}
      />

      {/* EVA Unit Neural Synchronization Modal */}
      <EvaSyncModal
        isOpen={evaModalOpen}
        onClose={() => setEvaModalOpen(false)}
      />
    </>
  );
}
