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
    <div className="relative min-h-screen flex flex-col selection:bg-[var(--accent-orange)] selection:text-black overflow-x-hidden">
      <TacticalCanvasBackground />
      <HUDHeader />

      <main className="flex-1 relative z-10 space-y-12 sm:space-y-16 py-4 sm:py-6">
        <HeroSection />
        <MagiSystemMonitor />
        <ProjectDossierGrid />
        <SkillsMatrix />
        <MissionLogTimeline />
        <SignalTransmissionForm />
      </main>

      <Footer />
    </div>
  );
}
