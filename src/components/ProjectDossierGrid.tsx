"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context";
import { ProjectData, ProjectModal } from "./ProjectModal";
import {
  TerminalIcon,
  ExternalLinkIcon,
  GithubIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "./Icons";

export function ProjectDossierGrid() {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isCollapsing, setIsCollapsing] = useState<boolean>(false);
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
      titleEn: "POKÉDEX",
      titlePt: "POKÉDEX",
      category: "frontend",
      clearance: "CLEARANCE LEVEL A-02",
      shortDescEn: "Modern biometric Pokédex featuring all 1,025 Pokémon (Gen I-IX), Multi-Console sprite engines (HD, 3D, DS, GBA), official Cries, encounter radar, and evolutionary tree.",
      shortDescPt: "Pokédex biométrica moderna com todos os 1.025 Pokémon (Gen I-IX), Multi-Console sprites (HD, 3D, DS, GBA), áudios oficiais (Cries), radar de captura e cadeia evolutiva.",
      fullDescEn: "Modern web application inspired by Silph Co. hardware aesthetics featuring complete coverage of all 1,025 Pokémon (Kanto through Paldea and DLCs). Features real-time switching across 4 console sprite engines (Official HD, Showdown 3D, animated Gen 5 DS, and pixel-perfect 16-bit GBA), alternative form detection (Mega Evolutions, Gigantamax, Regional, Primal), official Cry sound playback with audio visualizer, Base Stat Total (BST) radar, game-version encounter locations, persistent favorites system with celebratory confetti, and infinite scroll telemetry.",
      fullDescPt: "Aplicação web moderna inspirada no chassi de hardware da Silph Co. com indexação integral de todos os 1.025 Pokémon (Kanto até Paldea e DLCs). Apresenta alternância em tempo real entre 4 estilos de sprites de consoles (Oficial HD, Showdown 3D, Nintendo DS animados e GBA 16-bit com renderização pixel-perfect), suporte a formas alternativas (Mega, Gigantamax, Regionais, Primal), reprodução de áudio oficial (Cries) com equalizador visual, matriz de status base (BST), radar de locais de captura por versão do jogo, sistema de favoritos persistente com chuva de confetes e carregamento infinito (Infinite Scroll).",
      techStack: ["React 19", "TypeScript", "Vite", "PokéAPI v2", "Tailwind CSS", "Canvas Confetti", "Web Audio API"],
      liveUrl: "https://pokedex-lucas-gabriel.vercel.app/",
      repoUrl: "https://github.com/Lucas-Github-23/pokedex",
      status: "COMPLETED",
      isPlaceholder: false,
    },
    {
      id: "OPERATION-04",
      titleEn: "SHEET CUTTING OPTIMIZER",
      titlePt: "OTIMIZADOR DE CORTES DE CHAPAS",
      category: "frontend",
      clearance: "CLEARANCE LEVEL A-03",
      shortDescEn: "Algorithmic 2D cutting stock optimization engine for raw sheet materials (ACM, MDF, glass) featuring real-time vector rendering, DXF (CAD/CNC) generation, and paginated PDF reports.",
      shortDescPt: "Motor algorítmico de otimização de corte 2D para chapas (ACM, MDF, vidro e metais) com renderização vetorial em tempo real, exportação DXF para CNC/CAD e relatórios em PDF.",
      fullDescEn: "Engineered a production-ready 2D bin packing & cutting stock optimization platform used to minimize raw material waste in industrial sheet cutting (ACM, MDF, glass, and metals). Implements 3 specialized heuristic algorithms: Bottom-left Decreasing, MaxRects Smallest-Side-Fit, and Skyline Bottom-left. Features interactive SVG vector layout visualization, smart dimensional constraint validation, browser auto-save state persistence, paginated PDF cutting map generation via jsPDF, and native DXF export ready for AutoCAD, CAM workflows, and CNC routers.",
      fullDescPt: "Desenvolvido como uma ferramenta de produção para cálculo e aproveitamento de chapas industriais (ACM, MDF, vidro e metais), reduzindo drasticamente o desperdício de matéria-prima. Implementa 3 algoritmos de empacotamento 2D (Cutting Stock Problem): Bottom-left Decreasing, MaxRects Smallest-Side-Fit e Skyline Bottom-left. Conta com renderização vetorial SVG interativa em tempo real, validação paramétrica de dimensões, persistência automática de dados no navegador, geração de mapas de corte paginados em PDF via jsPDF e exportação direta em DXF para softwares CAD (AutoCAD) e máquinas de corte CNC.",
      techStack: ["React", "TypeScript", "Vite", "2D Bin Packing", "jsPDF", "DXF CAD Export", "Tailwind CSS"],
      liveUrl: "https://otimizador-cortes-chapas.vercel.app",
      repoUrl: "https://github.com/Lucas-Github-23/otimizador-cortes-chapas",
      status: "COMPLETED",
      isPlaceholder: false,
    },
    {
      id: "OPERATION-05",
      titleEn: "dotMSG — .MSG EMAIL DASHBOARD",
      titlePt: "dotMSG — DASHBOARD DE ARQUIVOS .MSG",
      category: "fullstack",
      clearance: "CLEARANCE LEVEL B-02",
      shortDescEn: "Fullstack analytics & parsing dashboard for Outlook .msg files combining a .NET (C#) Web API with a React 19 interface for automated message ingestion and metadata extraction.",
      shortDescPt: "Dashboard fullstack para processamento e visualização de e-mails do Outlook (.msg), combinando Web API em .NET (C#) com interface em React 19 para extração automatizada de dados.",
      fullDescEn: "Engineered a unified fullstack software solution for parsing, organizing, and visualizing Microsoft Outlook .msg binary email files without requiring desktop Outlook installations. The backend (.NET / C# Web API) executes automated batch ingestion, multipart stream extraction, header analysis, sender/receiver telemetry, and timestamp parsing. The frontend (React 19, Vite, Modern CSS) presents an interactive administrative dashboard with real-time payload filtering, detailed inspection views, search capabilities, and tabular data mapping.",
      fullDescPt: "Solução de software fullstack unificada para leitura, extração e visualização de arquivos de e-mail do Microsoft Outlook (.msg) sem necessidade de instalação local do cliente de e-mail. O backend (.NET / C# Web API) realiza a ingestão e parsing automatizado dos arquivos binários de e-mail, decodificando metadados, anexos, cabeçalhos, remetentes, destinatários e corpos de mensagem via REST. O frontend (React 19, Vite) fornece uma interface gráfica moderna e responsiva com filtragem de mensagens em tempo real, painel de métricas, busca avançada e visualização limpa de conteúdos.",
      techStack: [".NET (C#)", "Web API", "React 19", "JavaScript", "Vite", "Outlook .MSG Parsing", "REST API"],
      repoFrontendUrl: "https://github.com/Lucas-Github-23/msg-dashboard-front-end",
      repoBackendUrl: "https://github.com/Lucas-Github-23/msg-dashboard-back-end",
      status: "IN DEVELOPMENT",
      statusEn: "IN DEVELOPMENT",
      statusPt: "EM DESENVOLVIMENTO",
      isPlaceholder: false,
    },
  ];

  const handleToggleExpand = () => {
    if (isCollapsing) return;
    if (isExpanded) {
      setIsCollapsing(true);
      setTimeout(() => {
        setIsExpanded(false);
        setIsCollapsing(false);
        // Smooth scroll back to projects section if user was scrolled past
        const el = document.getElementById("projects");
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 70;
          if (window.scrollY > top) {
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      }, 280);
    } else {
      setIsExpanded(true);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === "all") return true;
    return p.category === activeFilter;
  });

  const displayedProjects =
    isExpanded || isCollapsing
      ? filteredProjects
      : filteredProjects.slice(0, 4);

  return (
    <section id="projects" className="py-12 sm:py-16">
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
              onClick={() => {
                setActiveFilter(filter.id);
              }}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase hud-button transition-all cursor-pointer ${
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
          {displayedProjects.map((project, index) => {
            const title = language === "pt" ? project.titlePt : project.titleEn;
            const shortDesc = language === "pt" ? project.shortDescPt : project.shortDescEn;
            const statusText =
              language === "pt"
                ? project.statusPt || project.status
                : project.statusEn || project.status;
            const isCompletedOrActive =
              project.status === "COMPLETED" || project.status === "ACTIVE";
            const isExtraCard = index >= 4;

            const animClass =
              isCollapsing && isExtraCard
                ? "dossier-card-collapsing"
                : isExtraCard
                ? "dossier-card-reveal"
                : "";

            return (
              <div
                key={project.id}
                style={
                  isExtraCard && !isCollapsing
                    ? { animationDelay: `${(index - 4) * 100}ms` }
                    : undefined
                }
                className={`bg-[var(--surface-panel)] border-2 border-[var(--border-grid)] p-4 sm:p-6 hud-panel relative flex flex-col justify-between hover:border-[var(--accent-orange)] transition-all group shadow-md ${animClass}`}
              >
                {/* Laser scanline on card entrance */}
                {isExtraCard && !isCollapsing && <div className="card-scanline-sweep" />}

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
                    <span
                      className={`px-2 py-0.5 border text-[9px] sm:text-[10px] font-bold font-mono uppercase self-start shrink-0 flex items-center gap-1.5 ${
                        isCompletedOrActive
                          ? "bg-[var(--accent-green-glow)] text-[var(--accent-green)] border-[var(--accent-green)]"
                          : "bg-amber-500/15 text-amber-400 border-amber-500/50"
                      }`}
                    >
                      {!isCompletedOrActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      )}
                      {statusText}
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
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-5 mt-4 border-t border-[var(--border-grid)] font-mono">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-4 py-2 bg-[var(--accent-orange)] text-black font-extrabold text-xs uppercase hud-button hover:bg-orange-600 transition-all shadow-[0_0_10px_var(--accent-orange-glow)] active:scale-95 cursor-pointer"
                  >
                    {t.projects.viewDetails}
                  </button>

                  <div className="flex items-center gap-2 flex-wrap">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-[var(--bg-main)] border-2 border-[var(--accent-green)] text-[var(--accent-green)] hover:bg-[var(--accent-green)] hover:text-black font-extrabold text-[11px] uppercase hud-panel-sm transition-all flex items-center gap-1.5 shadow-[0_0_8px_var(--accent-green-glow)] cursor-pointer"
                        title={t.projects.liveDemo}
                      >
                        <ExternalLinkIcon className="w-3.5 h-3.5" />
                        <span>{language === "pt" ? "ONLINE" : "LIVE"}</span>
                      </a>
                    )}

                    {project.repoFrontendUrl && project.repoBackendUrl ? (
                      <>
                        <a
                          href={project.repoFrontendUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-[var(--bg-main)] border-2 border-[var(--accent-orange)] text-[var(--accent-orange)] hover:bg-[var(--accent-orange)] hover:text-black font-extrabold text-[10px] uppercase hud-panel-sm transition-all flex items-center gap-1 shadow-[0_0_8px_var(--accent-orange-glow)] cursor-pointer"
                          title="Frontend Repository"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>FRONT</span>
                        </a>
                        <a
                          href={project.repoBackendUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-[var(--bg-main)] border-2 border-[var(--accent-green)] text-[var(--accent-green)] hover:bg-[var(--accent-green)] hover:text-black font-extrabold text-[10px] uppercase hud-panel-sm transition-all flex items-center gap-1 shadow-[0_0_8px_var(--accent-green-glow)] cursor-pointer"
                          title="Backend Repository"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>BACK</span>
                        </a>
                      </>
                    ) : project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-[var(--bg-main)] border-2 border-[var(--border-bright)] text-[var(--text-primary)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] font-extrabold text-[11px] uppercase hud-panel-sm transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                        title={t.projects.sourceCode}
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>CODE</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expand / Collapse Button with Animated Rotation & Pulse */}
        {filteredProjects.length > 4 && (
          <div className="mt-10 flex flex-col items-center justify-center font-mono">
            <div className="w-full flex items-center gap-3 my-2">
              <div className="h-[1px] bg-[var(--border-grid)] flex-1" />
              <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest transition-opacity">
                ARCHIVE CAPACITY: {filteredProjects.length} DOSSIERS {isExpanded && !isCollapsing ? `// ALL DEPLOYED` : `// 4 SHOWN`}
              </span>
              <div className="h-[1px] bg-[var(--border-grid)] flex-1" />
            </div>

            <button
              onClick={handleToggleExpand}
              disabled={isCollapsing}
              className="px-6 py-3 mt-3 bg-[var(--surface-panel)] border-2 border-[var(--border-grid)] hover:border-[var(--accent-orange)] text-[var(--text-primary)] hover:text-[var(--accent-orange)] font-black text-xs uppercase tracking-wider hud-button transition-all duration-300 flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_var(--accent-orange-glow)] active:scale-95 group cursor-pointer disabled:opacity-50"
            >
              <span className="relative flex items-center justify-center w-4 h-4">
                <ChevronDownIcon
                  className={`w-4 h-4 text-[var(--accent-orange)] transition-transform duration-300 ease-out ${
                    isExpanded && !isCollapsing ? "rotate-180" : "rotate-0"
                  }`}
                />
              </span>
              <span className="transition-colors duration-200">
                {isExpanded && !isCollapsing
                  ? t.projects.viewLess
                  : language === "pt"
                  ? `VER MAIS PROJETOS (+${filteredProjects.length - 4})`
                  : `VIEW MORE PROJECTS (+${filteredProjects.length - 4})`}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Dossier Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
