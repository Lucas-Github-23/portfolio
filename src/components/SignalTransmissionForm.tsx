"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context";
import {
  TerminalIcon,
  MailIcon,
  GithubIcon,
  LinkedinIcon,
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
} from "./Icons";

export function SignalTransmissionForm() {
  const { language, t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText("kukagabriel@hotmail.com");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = "kukagabriel@hotmail.com";
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        if (textArea.parentNode) {
          textArea.parentNode.removeChild(textArea);
        }
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent-orange)] tracking-widest uppercase mb-2">
            <TerminalIcon className="w-4 h-4 text-[var(--accent-orange)]" />
            {t.contact.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-tight text-[var(--text-primary)]">
            {t.contact.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-mono mt-2 leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {/* 3 Direct Channels Tactical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch font-mono">
          {/* 1. Direct Email Card */}
          <div
            className={`bg-[var(--surface-panel)] border-2 p-5 sm:p-6 hud-panel flex flex-col justify-between space-y-5 transition-all shadow-md ${
              copiedEmail
                ? "border-[var(--accent-green)] shadow-[0_0_20px_var(--accent-green-glow)]"
                : "border-[var(--border-grid)] hover:border-[var(--accent-orange)]"
            }`}
          >
            <div className="space-y-4">
              {/* Card Top Ribbon */}
              <div className="flex justify-between items-center border-b border-[var(--border-grid)] pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-orange)]">
                  <MailIcon className="w-5 h-5" />
                  <span className="tracking-wider">{t.contact.emailCard.title}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-[var(--accent-green-glow)] text-[var(--accent-green)] border border-[var(--accent-green)] font-extrabold uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-ping" />
                  {t.contact.emailCard.badge}
                </span>
              </div>

              {/* Email Address Display */}
              <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-grid)] rounded-sm">
                <span className="text-[10px] text-[var(--text-secondary)] block uppercase tracking-widest mb-0.5">
                  {language === "pt" ? "ENDEREÇO OFICIAL" : "OFFICIAL INBOX"}
                </span>
                <span className="text-sm sm:text-base font-bold text-[var(--accent-orange)] break-all select-all">
                  kukagabriel@hotmail.com
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.contact.emailCard.desc}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label={t.contact.emailCard.copyBtn}
                className={`flex-1 py-3 px-3 font-extrabold text-xs uppercase hud-button transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  copiedEmail
                    ? "bg-[var(--accent-green)] text-black shadow-[0_0_15px_var(--accent-green-glow)]"
                    : "bg-[var(--accent-orange)] text-black hover:bg-orange-600 shadow-[0_0_12px_var(--accent-orange-glow)]"
                }`}
              >
                {copiedEmail ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>{t.contact.emailCard.copiedBtn}</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4" />
                    <span>{t.contact.emailCard.copyBtn}</span>
                  </>
                )}
              </button>

              <a
                href="mailto:kukagabriel@hotmail.com?subject=Contato%20via%20Portfolio&body=Olá%20Lucas,"
                className="py-3 px-3 bg-[var(--bg-main)] border border-[var(--border-bright)] hover:border-[var(--accent-orange)] text-[var(--text-primary)] hover:text-[var(--accent-orange)] font-bold text-xs uppercase hud-button transition-colors flex items-center justify-center gap-1.5"
                title={t.contact.emailCard.openBtn}
              >
                <ExternalLinkIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === "pt" ? "APP" : "CLIENT"}</span>
                <span className="sm:hidden">{t.contact.emailCard.openBtn}</span>
              </a>
            </div>
          </div>

          {/* 2. LinkedIn Card */}
          <div className="bg-[var(--surface-panel)] border-2 border-[var(--border-grid)] hover:border-[var(--accent-orange)] p-5 sm:p-6 hud-panel flex flex-col justify-between space-y-5 transition-all shadow-md group">
            <div className="space-y-4">
              {/* Card Top Ribbon */}
              <div className="flex justify-between items-center border-b border-[var(--border-grid)] pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-orange)]">
                  <LinkedinIcon className="w-5 h-5" />
                  <span className="tracking-wider">{t.contact.linkedinCard.title}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-[var(--accent-green-glow)] text-[var(--accent-green)] border border-[var(--accent-green)] font-extrabold uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
                  {t.contact.linkedinCard.badge}
                </span>
              </div>

              {/* Profile Link Display */}
              <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-grid)] rounded-sm">
                <span className="text-[10px] text-[var(--text-secondary)] block uppercase tracking-widest mb-0.5">
                  {language === "pt" ? "PERFIL PROFISSIONAL" : "PROFESSIONAL PROFILE"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors break-all">
                  linkedin.com/in/lucas-pereira-521082279
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.contact.linkedinCard.desc}
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <a
                href="https://www.linkedin.com/in/lucas-pereira-521082279/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[var(--surface-panel)] border-2 border-[var(--border-bright)] hover:border-[var(--accent-orange)] text-[var(--text-primary)] hover:text-[var(--accent-orange)] font-extrabold text-xs uppercase hud-button transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <LinkedinIcon className="w-4 h-4 text-[var(--accent-orange)]" />
                <span>{t.contact.linkedinCard.openBtn}</span>
                <ExternalLinkIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 3. GitHub Card */}
          <div className="bg-[var(--surface-panel)] border-2 border-[var(--border-grid)] hover:border-[var(--accent-green)] p-5 sm:p-6 hud-panel flex flex-col justify-between space-y-5 transition-all shadow-md group">
            <div className="space-y-4">
              {/* Card Top Ribbon */}
              <div className="flex justify-between items-center border-b border-[var(--border-grid)] pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-green)]">
                  <GithubIcon className="w-5 h-5" />
                  <span className="tracking-wider">{t.contact.githubCard.title}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-[var(--accent-green-glow)] text-[var(--accent-green)] border border-[var(--accent-green)] font-extrabold uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-ping" />
                  {t.contact.githubCard.badge}
                </span>
              </div>

              {/* Repository Link Display */}
              <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-grid)] rounded-sm">
                <span className="text-[10px] text-[var(--text-secondary)] block uppercase tracking-widest mb-0.5">
                  {language === "pt" ? "REPOSITÓRIOS PÚBLICOS" : "PUBLIC REPOSITORIES"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-green)] transition-colors break-all">
                  github.com/Lucas-Github-23
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.contact.githubCard.desc}
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <a
                href="https://github.com/Lucas-Github-23"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[var(--surface-panel)] border-2 border-[var(--border-bright)] hover:border-[var(--accent-green)] text-[var(--text-primary)] hover:text-[var(--accent-green)] font-extrabold text-xs uppercase hud-button transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <GithubIcon className="w-4 h-4 text-[var(--accent-green)]" />
                <span>{t.contact.githubCard.openBtn}</span>
                <ExternalLinkIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Tactical Status Protocol Banner at Bottom */}
        <div className="mt-8 p-4 bg-[var(--surface-panel)]/60 border border-[var(--border-grid)] hud-panel-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-mono">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-orange)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse shrink-0" />
            <span>{t.contact.securityProtocolTitle}</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            {t.contact.securityProtocolDesc}
          </p>
        </div>
      </div>
    </section>
  );
}

