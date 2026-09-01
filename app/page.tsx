"use client";

import React from "react";
import { HUDHeader } from "@/components/HUDHeader";
import { HeroSection } from "@/components/HeroSection";
import { MagiSystemMonitor } from "@/components/MagiSystemMonitor";
import { ProjectDossierGrid } from "@/components/ProjectDossierGrid";
import { SkillsMatrix } from "@/components/SkillsMatrix";
import { MissionLogTimeline } from "@/components/MissionLogTimeline";
import { SignalTransmissionForm } from "@/components/SignalTransmissionForm";
import { Footer } from "@/components/Footer";
import { TacticalCanvasBackground } from "@/components/TacticalCanvasBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-[var(--accent-orange)] selection:text-black">
      <TacticalCanvasBackground />
      <HUDHeader />

      <main className="flex-1 relative z-10 space-y-16 py-6">
        <section id="status" className="scroll-mt-24 transition-all duration-300">
          <HeroSection />
        </section>

        <section id="magi" className="scroll-mt-24 transition-all duration-300">
          <MagiSystemMonitor />
        </section>

        <section id="projects" className="scroll-mt-24 transition-all duration-300">
          <ProjectDossierGrid />
        </section>

        <section id="skills" className="scroll-mt-24 transition-all duration-300">
          <SkillsMatrix />
        </section>

        <section id="experience" className="scroll-mt-24 transition-all duration-300">
          <MissionLogTimeline />
        </section>

        <section id="contact" className="scroll-mt-24 transition-all duration-300">
          <SignalTransmissionForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}
