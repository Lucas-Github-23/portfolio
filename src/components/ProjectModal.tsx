"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ExternalLinkIcon, GithubIcon, ShieldAlertIcon } from "./Icons";

export interface ProjectData {
  id: string;
  titleEn: string;
  titlePt: string;
  category: "fullstack" | "frontend" | "backend";
  clearance: string;
  shortDescEn: string;
  shortDescPt: string;
  fullDescEn: string;
  fullDescPt: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  status: string;
  isPlaceholder?: boolean;
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectData | null;
  onClose: () => void;
}) {
  const { language, t } = useLanguage();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [project, onClose]);

  if (!project) return null;

  const title = language === "pt" ? project.titlePt : project.titleEn;
  const description = language === "pt" ? project.fullDescPt : project.fullDescEn;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 hud-backdrop-animate flex items-center justify-center p-3 sm:p-4 select-none"
    >
      <div className="w-full max-w-2xl hud-modal-wrapper">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[var(--surface-panel)] border-2 border-[var(--accent-orange)] w-full max-h-[90vh] overflow-y-auto hud-panel p-4 sm:p-6 md:p-8 relative shadow-[0_0_35px_var(--accent-orange-glow)]"
        >
          <div className="hud-modal-content space-y-5 sm:space-y-6">
            {/* Header Ribbon */}
          <div className="flex justify-between items-start sm:items-center border-b border-[var(--border-grid)] pb-4 font-mono gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-[var(--accent-orange)] font-bold tracking-widest uppercase flex items-center gap-1.5 flex-wrap">
                <ShieldAlertIcon className="w-4 h-4 text-[var(--accent-orange)] shrink-0" />
                <span>{project.clearance}</span>
                {project.isPlaceholder && (
                  <span className="placeholder-tag">
                    {t.projects.placeholderTagFull}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mt-1 font-mono break-words">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[var(--accent-orange)] text-black font-extrabold text-xs tracking-wider uppercase hud-button hover:bg-orange-600 transition-colors shrink-0"
            >
              {t.projects.closeModal}
            </button>
          </div>

          {/* Status Tag & Category */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-2.5 py-0.5 bg-[var(--accent-green-glow)] text-[var(--accent-green)] border border-[var(--accent-green)] font-bold uppercase">
              STATUS: {project.status}
            </span>
            <span className="text-[var(--text-secondary)] uppercase">
              CATEGORY: {project.category}
            </span>
          </div>

          {/* Detailed Narrative */}
          <div className="space-y-3 font-mono text-sm text-[var(--text-primary)] leading-relaxed">
            <p className="border-l-2 border-[var(--accent-orange)] pl-3 italic text-[var(--text-secondary)]">
              &quot;Classified operational dossier details for deployment {project.id}. All technical specifications verified.&quot;
            </p>
            <p>{description}</p>
          </div>

          {/* Tech Stack Matrix */}
          <div className="space-y-2 font-mono">
            <span className="text-xs text-[var(--text-secondary)] tracking-widest uppercase block">
              TECHNOLOGY STACK INTEGRATION:
            </span>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-[var(--bg-main)] border border-[var(--border-grid)] text-[var(--accent-orange)] text-xs font-bold uppercase"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--border-grid)] font-mono">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[var(--accent-orange)] text-black font-extrabold text-xs uppercase hud-button flex items-center gap-2 hover:bg-orange-600 transition-all shadow-[0_0_15px_var(--accent-orange-glow)] active:scale-95"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                <span>{t.projects.liveDemo}</span>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[var(--bg-main)] border-2 border-[var(--accent-green)] text-[var(--accent-green)] hover:bg-[var(--accent-green)] hover:text-black font-extrabold text-xs uppercase hud-button flex items-center gap-2 transition-all shadow-[0_0_10px_var(--accent-green-glow)] active:scale-95"
              >
                <GithubIcon className="w-4 h-4" />
                <span>{t.projects.sourceCode}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
