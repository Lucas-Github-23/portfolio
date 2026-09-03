"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { TerminalIcon, MailIcon, GithubIcon, LinkedinIcon } from "./Icons";

export function SignalTransmissionForm() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "transmitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("transmitting");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent-orange)] tracking-widest uppercase mb-2">
            <TerminalIcon className="w-4 h-4 text-[var(--accent-orange)]" />
            DIRECT COMM FREQUENCY
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-tight text-[var(--text-primary)]">
            {t.contact.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-mono mt-2">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Transmission Form */}
          <div className="lg:col-span-7 bg-[var(--surface-panel)] border-2 border-[var(--border-grid)] p-4 sm:p-6 hud-panel space-y-6 shadow-md">
            <div className="border-b border-[var(--border-grid)] pb-3">
              <span className="font-mono text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--accent-green)] animate-ping" />
                {t.contact.channelStatus}
              </span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[var(--accent-orange)] tracking-widest uppercase mb-1">
                  {t.contact.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.contact.namePlaceholder}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-grid)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none font-mono transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[var(--accent-orange)] tracking-widest uppercase mb-1">
                  {t.contact.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t.contact.emailPlaceholder}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-grid)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none font-mono transition-colors"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-[var(--accent-orange)] tracking-widest uppercase mb-1">
                  {t.contact.subjectLabel}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={t.contact.subjectPlaceholder}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-grid)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none font-mono transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-[var(--accent-orange)] tracking-widest uppercase mb-1">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-grid)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-orange)] outline-none font-mono transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "transmitting"}
                className="w-full py-3.5 bg-[var(--accent-orange)] text-black font-extrabold text-xs md:text-sm tracking-wider uppercase hud-button hover:bg-orange-600 transition-colors shadow-[0_0_15px_var(--accent-orange-glow)] disabled:opacity-50"
              >
                {status === "transmitting"
                  ? t.contact.transmitting
                  : t.contact.sendButton}
              </button>

              {/* Success Notification */}
              {status === "success" && (
                <div className="p-3 bg-[var(--accent-green-glow)] border border-[var(--accent-green)] text-[var(--accent-green)] text-xs font-bold text-center uppercase tracking-widest">
                  {t.contact.successMessage}
                </div>
              )}
            </form>
          </div>

          {/* Direct Frequency Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[var(--surface-panel)] border border-[var(--border-grid)] p-6 hud-panel-sm space-y-4">
              <span className="text-xs font-extrabold text-[var(--accent-orange)] tracking-widest uppercase block border-b border-[var(--border-grid)] pb-2">
                {t.contact.directChannels}
              </span>

              <div className="space-y-3">
                <a
                  href="https://github.com/Lucas-Github-23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[var(--bg-main)] border border-[var(--border-grid)] hover:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)]"
                >
                  <GithubIcon className="w-5 h-5 text-[var(--accent-orange)]" />
                  <div>
                    <span className="block text-xs font-bold">{t.contact.githubLabel}</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">github.com/Lucas-Github-23</span>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/lucas-pereira-521082279/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[var(--bg-main)] border border-[var(--border-grid)] hover:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)]"
                >
                  <LinkedinIcon className="w-5 h-5 text-[var(--accent-orange)]" />
                  <div>
                    <span className="block text-xs font-bold">{t.contact.linkedinLabel}</span>
                    <span className="text-[10px] text-[var(--accent-orange)] font-bold">
                      linkedin.com/in/lucas-pereira-521082279
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:kukagabriel@hotmail.com"
                  className="flex items-center gap-3 p-3 bg-[var(--bg-main)] border border-[var(--border-grid)] hover:border-[var(--accent-orange)] transition-colors text-[var(--text-primary)]"
                >
                  <MailIcon className="w-5 h-5 text-[var(--accent-orange)]" />
                  <div>
                    <span className="block text-xs font-bold">{t.contact.emailDirectLabel}</span>
                    <span className="text-[10px] text-[var(--accent-orange)] font-bold">
                      kukagabriel@hotmail.com
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Tactical Security Note */}
            <div className="p-4 bg-[var(--surface-panel)]/50 border border-[var(--border-grid)] text-[10px] text-[var(--text-secondary)] space-y-1">
              <span className="text-[var(--accent-orange)] font-bold block">
                {t.contact.securityProtocolTitle}
              </span>
              <p>
                {t.contact.securityProtocolDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
