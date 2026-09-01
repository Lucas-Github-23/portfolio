"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { SunIcon, MoonIcon, ShieldAlertIcon, MonitorIcon } from "./Icons";

export function HUDHeader() {
  const {
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    crtEnabled,
    toggleCrt,
    emergencyActive,
    toggleEmergency,
    activeSection,
    setActiveSection,
  } = useLanguage();

  const [timeString, setTimeString] = useState<string>("");
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks >= 5) {
      window.dispatchEvent(new CustomEvent("nerv_angel_attack"));
      setLogoClicks(0);
    }
  };

  const handleNavClick = (id: (typeof navItems)[number]["id"]) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
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

  const navItems = [
    { id: "status", label: t.nav.status },
    { id: "magi", label: "MAGI" },
    { id: "projects", label: t.nav.projects },
    { id: "skills", label: t.nav.skills },
    { id: "experience", label: t.nav.experience },
    { id: "contact", label: t.nav.contact },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border-grid)] shadow-md transition-colors">
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
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2.5 min-h-[60px] md:min-h-[64px] flex items-center justify-between gap-2 md:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div
            onClick={handleLogoClick}
            className="w-8 h-8 bg-[var(--accent-orange)] text-black font-black text-xs flex items-center justify-center hud-panel-sm font-mono shadow-[0_0_10px_var(--accent-orange-glow)] cursor-pointer select-none hover:scale-105 active:scale-95 transition-transform shrink-0"
            title="NERV HQ LOGO (Secret Click x5)"
          >
            NERV
          </div>
          <div>
            <div className="font-mono text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-[var(--text-primary)] flex items-center gap-1.5 whitespace-nowrap">
              DEV-02
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent-green)] animate-ping" />
            </div>
            <div className="font-mono text-[9px] sm:text-[10px] text-[var(--text-secondary)] tracking-widest uppercase whitespace-nowrap">
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

        {/* Controls: Language, Theme, CRT & Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs shrink-0 whitespace-nowrap">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden px-2.5 py-1.5 border border-[var(--accent-orange)] bg-[var(--surface-panel)] text-[var(--accent-orange)] font-mono text-xs font-extrabold hud-panel-sm flex items-center gap-1.5 hover:bg-[var(--accent-orange)] hover:text-black transition-all shadow-[0_0_8px_var(--accent-orange-glow)]"
            aria-label="Toggle Mobile HUD Menu"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] animate-pulse" />
            <span>{mobileMenuOpen ? "CLOSE" : "MENU"}</span>
          </button>

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
            className="p-1.5 border border-[var(--border-grid)] bg-[var(--surface-panel)] text-[var(--text-secondary)] hover:text-[var(--accent-orange)] transition-colors hud-panel-sm"
            title={theme === "dark" ? t.hud.themeLight : t.hud.themeDark}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* CRT Overlay Toggle (Desktop) */}
          <button
            onClick={toggleCrt}
            className={`hidden sm:flex p-1.5 border hud-panel-sm transition-colors ${
              crtEnabled
                ? "border-[var(--accent-green)] text-[var(--accent-green)] bg-[var(--accent-green-glow)]"
                : "border-[var(--border-grid)] bg-[var(--surface-panel)] text-[var(--text-secondary)]"
            }`}
            title={t.hud.crtScanlines}
          >
            <MonitorIcon />
          </button>

          {/* Emergency Alert Button (Desktop) */}
          <button
            onClick={toggleEmergency}
            className="hidden sm:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[var(--accent-red)] text-black font-extrabold text-[10px] tracking-wider uppercase hud-button hover:opacity-90 transition-opacity shadow-[0_0_10px_var(--accent-red-glow)]"
          >
            <ShieldAlertIcon className="w-3.5 h-3.5" />
            <span>{t.hud.emergency}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-main)]/95 backdrop-blur-xl border-b-2 border-[var(--accent-orange)] p-3 sm:p-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 space-y-3">
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-2.5 sm:p-3 text-left transition-all uppercase hud-button flex items-center justify-between text-xs ${
                    isActive
                      ? "bg-[var(--accent-orange)] text-black font-black shadow-[0_0_10px_var(--accent-orange-glow)]"
                      : "bg-[var(--surface-panel)] text-[var(--text-secondary)] border border-[var(--border-grid)] hover:text-[var(--accent-orange)]"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {isActive && <span className="text-[10px] font-black shrink-0 ml-1">●</span>}
                </button>
              );
            })}
          </div>

          {/* Mobile Secondary Tactical Actions */}
          <div className="flex sm:hidden items-center gap-2 pt-2 border-t border-[var(--border-grid)] font-mono text-xs">
            <button
              onClick={toggleCrt}
              className={`flex-1 py-2 px-3 border hud-button flex items-center justify-center gap-1.5 text-xs font-bold uppercase transition-colors ${
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
                toggleEmergency();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 bg-[var(--accent-red)] text-black font-black text-xs uppercase hud-button flex items-center justify-center gap-1.5 shadow-[0_0_10px_var(--accent-red-glow)]"
            >
              <ShieldAlertIcon className="w-3.5 h-3.5" />
              <span>{t.hud.emergency}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
