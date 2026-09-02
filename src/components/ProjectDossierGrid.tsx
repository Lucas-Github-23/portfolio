"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ProjectData, ProjectModal } from "./ProjectModal";
import { TerminalIcon, ExternalLinkIcon, GithubIcon } from "./Icons";

export function ProjectDossierGrid() {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const projects: ProjectData[] = [
    {
      id: "OPERATION-01",
      titleEn: "NERV TACTICAL HUD PORTFOLIO",
      titlePt: "PORTFÓLIO HUD TÁTICO NERV",
      category: "fullstack",
      clearance: "CLEARANCE LEVEL A-01",
      shortDescEn: "Next.js 16 tactical developer interface with dual-language i18n, MAGI supercomputer diagnostic widgets, and CRT scanlines.",
      shortDescPt: "Interface tática Next.js 16 para desenvolvedor com i18n bilíngue, widgets de diagnóstico do supercomputador MAGI e scanlines CRT.",
      fullDescEn: "Architected a custom Evangelion NERV / MAGI command interface using Next.js App Router, Tailwind CSS design tokens, and stateful language/theme controls. Features modular architecture, zero runtime bloat, and dynamic sync status monitoring.",
      fullDescPt: "Arquitetado uma interface de comando Evangelion NERV / MAGI customizada usando Next.js App Router, design tokens em Tailwind CSS e controles de estado para idioma e tema. Inclui arquitetura modular, alta performance e monitoramento dinâmico de taxa de sincronia.",
      techStack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"],
      liveUrl: "https://github.com/Lucas-Github-23/portfolio",
      repoUrl: "https://github.com/Lucas-Github-23/portfolio",
      status: "ACTIVE",
      isPlaceholder: false,
    },
    {
      id: "OPERATION-02",
      titleEn: "PIXEL ADVENTURE (AGRINHO 2022)",
      titlePt: "PIXEL ADVENTURE (AGRINHO 2022)",
      category: "frontend",
      clearance: "AWARD RECOGNITION // 3RD PLACE",
      shortDescEn: "[3RD PLACE] NRE Maringá (Agrinho Program). 2D Pixel Art platformer game developed in HTML5/JS featuring classic physics, boss encounters, PWA offline support, and direct browser execution.",
      shortDescPt: "[3º LUGAR] NRE Maringá (Programa Agrinho). Jogo de plataforma 2D em Pixel Art desenvolvido em HTML5/JS com física clássica, chefões, suporte PWA offline e execução direta no navegador.",
      fullDescEn: "Awarded 3rd place in NRE Maringá by the Agrinho Program, combining educational environmental awareness with classic 8/16-bit 2D platforming mechanics. Features responsive running and double-jump physics, enemies and boss battles with health bars and attack patterns, moving traps and springboards, collectible-driven scoring, stage padlock progression, dynamic soundtrack via Web Audio API, and full offline PWA execution via Service Workers.",
      fullDescPt: "Premiado com o 3º lugar no NRE Maringá pelo Programa Agrinho, unindo a nostalgia dos jogos clássicos de plataforma 2D em 8/16-bits a mensagens educativas de conscientização ambiental, ética e cidadania. Conta com movimentação fluida (corrida, pulo duplo e física), inteligência de inimigos e chefões com barra de vida e padrões de ataque, armadilhas dinâmicas, sistema de pontuação com coletáveis, progressão de fases destraváveis (Padlock System), trilha sonora dinâmica via Web Audio API e suporte completo a PWA offline com Service Workers.",
      techStack: ["HTML5", "JavaScript (ES6)", "Canvas API", "Web Audio API", "PWA / Service Worker", "Construct Engine", "CSS3"],
      liveUrl: "https://Lucas-Github-23.github.io/Pixel-Adventure-Agrinho/",
      repoUrl: "https://github.com/Lucas-Github-23/Pixel-Adventure-Agrinho",
      status: "COMPLETED",
      isPlaceholder: false,
    },
    {
      id: "OPERATION-03",
      titleEn: "[PLACEHOLDER] YOUR PROJECT 03",
      titlePt: "[PLACEHOLDER] SEU PROJETO 03",
      category: "frontend",
      clearance: "CLEARANCE LEVEL B-01",
      shortDescEn: "[PLACEHOLDER // FRONTEND DEMO] Template card for your upcoming React/Next.js frontend application or design system.",
      shortDescPt: "[PLACEHOLDER // FRONTEND DEMO] Card modelo para sua próxima aplicação frontend em React/Next.js ou design system.",
      fullDescEn: "[PLACEHOLDER DETAILS] Replace this text with UI/UX highlights, design system tokens, responsive layout features, and state management details.",
      fullDescPt: "[DETALHES DO PLACEHOLDER] Substitua este texto com destaques de UI/UX, tokens do design system, responsividade e gerenciamento de estado.",
      techStack: ["React 19", "Tailwind CSS", "TypeScript"],
      liveUrl: "https://github.com/your-username/repo-name",
      repoUrl: "https://github.com/your-username/repo-name",
      status: "TEMPLATE",
      isPlaceholder: true,
    },
    {
      id: "OPERATION-04",
      titleEn: "[PLACEHOLDER] YOUR PROJECT 04",
      titlePt: "[PLACEHOLDER] SEU PROJETO 04",
      category: "backend",
      clearance: "CLEARANCE LEVEL TOP SECRET",
      shortDescEn: "[PLACEHOLDER // BACKEND DEMO] Template card for API services, database integrations, or CLI automation tools.",
      shortDescPt: "[PLACEHOLDER // BACKEND DEMO] Card modelo para serviços de API, integrações de banco de dados ou ferramentas de automação.",
      fullDescEn: "[PLACEHOLDER DETAILS] Replace this text with API endpoint documentation, security protocols, database schemas, and performance benchmarks.",
      fullDescPt: "[DETALHES DO PLACEHOLDER] Substitua este texto com documentação de endpoints de API, protocolos de segurança, esquemas de banco de dados e benchmarks.",
      techStack: ["Node.js", "Express", "PostgreSQL", "Prisma"],
      liveUrl: "https://github.com/your-username/repo-name",
      repoUrl: "https://github.com/your-username/repo-name",
      status: "TEMPLATE",
      isPlaceholder: true,
    },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === "all") return true;
    return p.category === activeFilter;
  });

  return (
    <section id="projects" className="py-16 border-b border-[var(--border-grid)] bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent-orange)] tracking-widest uppercase mb-2">
            <TerminalIcon className="w-4 h-4 text-[var(--accent-orange)]" />
            OPERATIONAL RECORDS
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-tight text-[var(--text-primary)]">
            {t.projects.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-mono mt-2">
            {t.projects.subtitle}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 font-mono">
          {[
            { id: "all", label: t.projects.filterAll },
            { id: "fullstack", label: t.projects.filterFullstack },
            { id: "frontend", label: t.projects.filterFrontend },
            { id: "backend", label: t.projects.filterBackend },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase hud-button transition-all ${
                activeFilter === filter.id
                  ? "bg-[var(--accent-orange)] text-black shadow-[0_0_15px_var(--accent-orange-glow)]"
                  : "bg-[var(--surface-panel)] text-[var(--text-secondary)] border border-[var(--border-grid)] hover:text-[var(--text-primary)] hover:border-[var(--accent-orange)]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const title = language === "pt" ? project.titlePt : project.titleEn;
            const shortDesc = language === "pt" ? project.shortDescPt : project.shortDescEn;

            return (
              <div
                key={project.id}
                className="bg-[var(--surface-panel)] border-2 border-[var(--border-grid)] p-4 sm:p-6 hud-panel relative flex flex-col justify-between hover:border-[var(--accent-orange)] transition-all group shadow-md"
              >
                {/* Dossier Top Bar */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 border-b border-[var(--border-grid)] pb-3 font-mono">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[var(--accent-orange)] tracking-widest uppercase flex items-center gap-1.5 flex-wrap">
                        {project.id} {"//"} {project.clearance}
                        {project.isPlaceholder && (
                          <span className="placeholder-tag">{t.projects.placeholderTag}</span>
                        )}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-[var(--accent-orange)] transition-colors font-mono mt-0.5 break-words">
                        {title}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 bg-[var(--accent-green-glow)] text-[var(--accent-green)] border border-[var(--accent-green)] text-[9px] sm:text-[10px] font-bold font-mono uppercase self-start shrink-0">
                      {project.status}
                    </span>
                  </div>

                  {/* Short Narrative */}
                  <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                    {shortDesc}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 font-mono pt-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-[var(--bg-main)] border border-[var(--border-grid)] text-[var(--text-primary)] text-[10px] font-semibold uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-6 mt-4 border-t border-[var(--border-grid)] font-mono">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-4 py-2 bg-[var(--accent-orange)] text-black font-extrabold text-xs uppercase hud-button hover:bg-orange-600 transition-colors shadow-[0_0_10px_var(--accent-orange-glow)]"
                  >
                    {t.projects.viewDetails}
                  </button>

                  <div className="flex gap-2 text-[var(--text-secondary)]">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 border border-[var(--border-grid)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] transition-colors"
                        title={t.projects.liveDemo}
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 border border-[var(--border-grid)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] transition-colors"
                        title={t.projects.sourceCode}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dossier Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
