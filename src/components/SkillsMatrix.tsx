"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CpuIcon } from "./Icons";

interface SkillItem {
  name: string;
  level: number; // percentage
  status: string;
}

export function SkillsMatrix() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("frontend");

  const skillData: Record<string, SkillItem[]> = {
    frontend: [
      { name: "Next.js", level: 95, status: "OPTIMAL" },
      { name: "React (Vite)", level: 92, status: "OPTIMAL" },
      { name: "TypeScript", level: 90, status: "OPTIMAL" },
      { name: "HTML5 & Web APIs", level: 95, status: "MAX SYNC" },
    ],
    backend: [
      { name: "SQL (SQL Server, MySQL & MongoDB)", level: 88, status: "OPTIMAL" },
      { name: "VBA (Excel, PowerPoint & MS Office)", level: 85, status: "OPTIMAL" },
      { name: "Node.js", level: 75, status: "STABLE" },
      { name: "REST & GraphQL APIs", level: 68, status: "DEVELOPING" },
    ],
    devops: [
      { name: "Docker & Containerization", level: 90, status: "OPTIMAL" },
      { name: "CI/CD (GitHub Actions)", level: 92, status: "OPTIMAL" },
      { name: "Cloud & Vercel Deployments", level: 95, status: "MAX SYNC" },
      { name: "Linux System Admin", level: 86, status: "STABLE" },
    ],
    tools: [
      { name: "Git & Version Control", level: 95, status: "MAX SYNC" },
      { name: "Power BI (Dashboards & DAX)", level: 90, status: "OPTIMAL" },
      { name: "Linguagem M (Power Query ETL)", level: 88, status: "OPTIMAL" },
    ],
  };

  return (
    <section id="skills" className="py-16 border-b border-[var(--border-grid)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent-green)] tracking-widest uppercase mb-2">
            <CpuIcon className="w-4 h-4 text-[var(--accent-green)]" />
            HARMONIC DIAGNOSTICS
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-tight text-[var(--text-primary)]">
            {t.skills.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-mono mt-2">
            {t.skills.subtitle}
          </p>
        </div>

        {/* Subsystem Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 font-mono">
          {Object.keys(t.skills.categories).map((catKey) => {
            const label = t.skills.categories[catKey as keyof typeof t.skills.categories];
            const isActive = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold tracking-wider uppercase hud-button transition-all ${
                  isActive
                    ? "bg-[var(--accent-orange)] text-black shadow-[0_0_15px_var(--accent-orange-glow)]"
                    : "bg-[var(--surface-panel)] text-[var(--text-secondary)] border border-[var(--border-grid)] hover:text-[var(--text-primary)] hover:border-[var(--accent-orange)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Skill Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {skillData[selectedCategory].map((skill) => (
            <div
              key={skill.name}
              className="bg-[var(--surface-panel)] border border-[var(--border-grid)] p-4 sm:p-5 hud-panel-sm space-y-3 hover:border-[var(--accent-green)] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 font-mono">
                <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] tracking-wide">
                  {skill.name}
                </span>
                <span className="text-[10px] sm:text-xs text-[var(--accent-green)] font-extrabold px-2 py-0.5 bg-[var(--accent-green-glow)] border border-[var(--accent-green)] self-start sm:self-auto">
                  {skill.status} // {skill.level}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[var(--bg-main)] h-2.5 border border-[var(--border-grid)] p-0.5">
                <div
                  className="bg-[var(--accent-green)] h-full transition-all duration-500 shadow-[0_0_8px_var(--accent-green-glow)]"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
