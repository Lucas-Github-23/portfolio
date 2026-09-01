"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { TerminalIcon } from "./Icons";

interface TimelineItem {
  id: string;
  yearEn: string;
  yearPt: string;
  roleEn: string;
  rolePt: string;
  orgEn: string;
  orgPt: string;
  descEn: string;
  descPt: string;
  status: string;
}

export function MissionLogTimeline() {
  const { language, t } = useLanguage();

  const timelineData: TimelineItem[] = [
    {
      id: "LOG-CURRENT",
      yearEn: "IN PROGRESS",
      yearPt: "EM ANDAMENTO",
      roleEn: "Software Engineering Degree",
      rolePt: "Bacharelado em Engenharia de Software",
      orgEn: "UNIVERSITY // NERV ACADEMIC NODE",
      orgPt: "UNIVERSIDADE // NERV ACADEMIC NODE",
      descEn: "Currently studying core software engineering principles, data structures, algorithm complexity, object-oriented design, and database systems.",
      descPt: "Cursando Engenharia de Software com foco em princípios de arquitetura de software, estruturas de dados, orientação a objetos e bancos de dados.",
      status: "IN PROGRESS",
    },
    {
      id: "LOG-PLACEHOLDER-01",
      yearEn: "[PLACEHOLDER YEARS]",
      yearPt: "[PLACEHOLDER ANOS]",
      roleEn: "[PLACEHOLDER] Academic Project / Internship",
      rolePt: "[PLACEHOLDER] Estágio / Projeto Acadêmico",
      orgEn: "[COMPANY OR UNIVERSITY NAME]",
      orgPt: "[NOME DA EMPRESA OU UNIVERSIDADE]",
      descEn: "[PLACEHOLDER // YOUR TEXT HERE] Add your work experience, internship, or university research project details here.",
      descPt: "[PLACEHOLDER // SEU TEXTO AQUI] Adicione aqui detalhes da sua experiência de estágio, projeto universitário ou extensão.",
      status: "TEMPLATE",
    },
    {
      id: "LOG-AWARD-01",
      yearEn: "2022",
      yearPt: "2022",
      roleEn: "🥉 3rd Place — NRE Maringá (Agrinho Program)",
      rolePt: "🥉 3º Lugar — NRE Maringá (Programa Agrinho)",
      orgEn: "PROGRAMA AGRINHO // FAEP / SENAR-PR",
      orgPt: "PROGRAMA AGRINHO // FAEP / SENAR-PR",
      descEn: "Developed Pixel Adventure, an interactive educational 2D platformer in HTML5 promoting environmental awareness and citizenship, awarded 3rd place across the Maringá regional education sector.",
      descPt: "Desenvolveu o jogo Pixel Adventure, um jogo de plataforma 2D interativo em HTML5 promovendo sustentabilidade e cidadania, premiado com o 3º lugar na fase regional do NRE Maringá.",
      status: "AWARDED",
    },
  ];

  return (
    <section id="experience" className="py-16 border-b border-[var(--border-grid)] bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent-orange)] tracking-widest uppercase mb-2">
            <TerminalIcon className="w-4 h-4 text-[var(--accent-orange)]" />
            CHRONOLOGICAL RECONNAISSANCE
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-tight text-[var(--text-primary)]">
            {t.experience.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-mono mt-2">
            {t.experience.subtitle}
          </p>
        </div>

        {/* Vertical Tactical Timeline */}
        <div className="max-w-4xl mx-auto relative pl-5 sm:pl-6 md:pl-8 border-l-2 border-[var(--accent-orange)] space-y-8 sm:space-y-10 font-mono ml-3 sm:ml-auto">
          {timelineData.map((item) => {
            const year = language === "pt" ? item.yearPt : item.yearEn;
            const org = language === "pt" ? item.orgPt : item.orgEn;
            const role = language === "pt" ? item.rolePt : item.roleEn;
            const desc = language === "pt" ? item.descPt : item.descEn;

            return (
              <div key={item.id} className="relative group">
                {/* Timeline Marker Point */}
                <div className="absolute -left-[27px] sm:-left-[31px] md:-left-[39px] top-1.5 w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-[var(--bg-main)] border-2 border-[var(--accent-orange)] group-hover:bg-[var(--accent-orange)] transition-colors shadow-[0_0_10px_var(--accent-orange-glow)]" />

                <div className="bg-[var(--surface-panel)] border border-[var(--border-grid)] p-4 sm:p-6 hud-panel-sm hover:border-[var(--accent-orange)] transition-colors space-y-2.5 sm:space-y-3 shadow-sm">
                  {/* Top Bar */}
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[var(--border-grid)] pb-2 sm:pb-3">
                    <span className="text-[11px] sm:text-xs font-extrabold text-[var(--accent-orange)] tracking-widest uppercase">
                      {year} // {org}
                    </span>
                    <span className="px-2 py-0.5 bg-[var(--accent-green-glow)] text-[var(--accent-green)] border border-[var(--accent-green)] text-[9px] sm:text-[10px] font-bold uppercase">
                      {item.status}
                    </span>
                  </div>

                  {/* Role Title */}
                  <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">
                    {role}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
