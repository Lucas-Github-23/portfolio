import React, { useEffect, useRef } from "react";
import { useLanguage, SectionId } from "@/context/LanguageContext";

export function TacticalCanvasBackground() {
  const { activeSection, theme } = useLanguage();
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Store activeSection and theme in refs for animation frame loop
  const activeSectionRef = useRef<SectionId>(activeSection);
  const themeRef = useRef<"dark" | "light">(theme);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const bgCtx = bgCanvas.getContext("2d");
    const fgCtx = fgCanvas.getContext("2d");
    if (!bgCtx || !fgCtx) return;

    let animationFrameId: number;
    let dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.5);
    let width = typeof window !== "undefined" ? window.innerWidth : 1200;
    let height = typeof window !== "undefined" ? window.innerHeight : 800;

    const setupCanvasSize = () => {
      if (!bgCanvas || !fgCanvas || !bgCtx || !fgCtx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;

      bgCanvas.width = Math.floor(width * dpr);
      bgCanvas.height = Math.floor(height * dpr);
      fgCanvas.width = Math.floor(width * dpr);
      fgCanvas.height = Math.floor(height * dpr);

      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setupCanvasSize();

    let mouseX = -9999;
    let mouseY = -9999;
    let targetMouseX = -9999;
    let targetMouseY = -9999;

    let scrollY = window.scrollY || 0;

    // Handle Window Resize
    const handleResize = () => {
      setupCanvasSize();
    };

    // Handle Mouse Movement
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    // Handle Scroll
    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    };

    interface ATImpact {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      color: string;
      isTopArea: boolean;
    }

    const atImpacts: ATImpact[] = [];

    const spawnImpactRing = (x: number, y: number) => {
      const isTopArea = y < 85;
      const isLight = themeRef.current === "light";
      atImpacts.push({
        x,
        y,
        radius: isTopArea ? 4 : 8,
        maxRadius: isTopArea ? 32 + Math.random() * 12 : 75 + Math.random() * 35,
        opacity: isTopArea ? 0.45 : 0.9,
        color: isTopArea
          ? isLight ? "#008833" : "#00ff66"
          : Math.random() > 0.4
            ? isLight ? "#008833" : "#00ff66"
            : Math.random() > 0.5
              ? isLight ? "#d93b00" : "#ff4500"
              : isLight ? "#0044cc" : "#00ffff",
        isTopArea,
      });
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchMoved = false;
    let lastTouchTime = 0;

    const handleClick = (e: MouseEvent) => {
      // Ignore click if it was simulated from a mobile touch tap in the last 500ms
      if (Date.now() - lastTouchTime < 500) return;
      spawnImpactRing(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        touchMoved = false;
        targetMouseX = touch.clientX;
        targetMouseY = touch.clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetMouseX = touch.clientX;
        targetMouseY = touch.clientY;
        if (Math.hypot(touch.clientX - touchStartX, touch.clientY - touchStartY) > 10) {
          touchMoved = true;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      lastTouchTime = Date.now();
      const elapsed = Date.now() - touchStartTime;
      // Only spawn impact ring if user genuinely tapped without dragging or scrolling!
      if (!touchMoved && elapsed < 350) {
        if (e.changedTouches.length > 0) {
          const touch = e.changedTouches[0];
          spawnImpactRing(touch.clientX, touch.clientY);
        }
      }
      // Reset target coordinates away so Ramiel smoothly closes when finger lifts off the screen!
      targetMouseX = -9999;
      targetMouseY = -9999;
    };

    const handleTouchCancel = () => {
      targetMouseX = -9999;
      targetMouseY = -9999;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchCancel, { passive: true });
    window.addEventListener("mouseleave", handleTouchCancel);

    // Floating particles for background atmosphere
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedY: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? "#ff4500" : "#00ff66",
    }));

    let time = 0;
    let ramielMorph = 0; // Smooth morph state (0 = closed octahedron, 1 = open morph cannon form)

    // 3D Point Projection Helper
    const project3D = (x: number, y: number, z: number, angleX: number, angleY: number, fov: number, cx: number, cy: number) => {
      // Rotation Y
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // Rotation X
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      // Perspective projection
      const scale = fov / (fov + z2 + 300);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        scale,
        z: z2,
      };
    };

    let currentRatio = 0;

    // --- RENDER LOOP ---
    const render = () => {
      time += 0.015;
      const isLight = themeRef.current === "light";
      const isMobile = width < 768;

      // Smooth mouse position interpolation
      if (targetMouseX < -5000) {
        mouseX = -9999;
        mouseY = -9999;
      } else {
        if (mouseX < -5000) {
          mouseX = targetMouseX;
          mouseY = targetMouseY;
        } else {
          mouseX += (targetMouseX - mouseX) * 0.05;
          mouseY += (targetMouseY - mouseY) * 0.05;
        }
      }

      const hasActivePointer = targetMouseX > -5000 && mouseX > -5000;

      bgCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const actualRatio = Math.min(1, Math.max(0, scrollY / maxScroll));
      currentRatio += (actualRatio - currentRatio) * 0.08;
      const scrollRatio = currentRatio;

      // --- SECTION 1: RAMIEL (BACKGROUND CANVAS Z-0) ---
      const ramielOpacity = Math.max(0, 1 - scrollRatio * 2.5);
      if (ramielOpacity > 0.01) {
        bgCtx.save();
        bgCtx.globalAlpha = ramielOpacity * (isLight ? 0.95 : 0.9);

        // Position Ramiel on left-center side clear of Sync widget
        const cx = width > 1024 ? width * 0.32 : isMobile ? width * 0.50 : width * 0.40;
        const cy = width > 1024 ? height * 0.38 : isMobile ? height * 0.30 : height * 0.35;
        const radius = Math.min(width, height) * (width > 1024 ? 0.16 : isMobile ? 0.22 : 0.18);

        // Proximity / Hover Detection (Only when user pointer is actually active on screen)
        const distToMouse = hasActivePointer ? Math.hypot(mouseX - cx, mouseY - cy) : 99999;
        const isHovered = distToMouse < radius * 2.2;
        ramielMorph += ((isHovered ? 1 : 0) - ramielMorph) * 0.08;

        const mouseTiltX = hasActivePointer ? (mouseY - height / 2) * 0.0004 : 0;
        const mouseTiltY = hasActivePointer ? (mouseX - width / 2) * 0.0004 : 0;

        const morphOffset = ramielMorph * radius * 0.55;

        // Top Pyramid Vertices
        const topPyramidVertices = [
          [0, -radius - morphOffset, 0],
          [-radius - morphOffset * 0.3, -morphOffset * 0.2, 0],
          [radius + morphOffset * 0.3, -morphOffset * 0.2, 0],
          [0, -morphOffset * 0.2, -radius - morphOffset * 0.3],
          [0, -morphOffset * 0.2, radius + morphOffset * 0.3],
        ];

        // Bottom Pyramid Vertices
        const bottomPyramidVertices = [
          [0, radius + morphOffset, 0],
          [-radius - morphOffset * 0.3, morphOffset * 0.2, 0],
          [radius + morphOffset * 0.3, morphOffset * 0.2, 0],
          [0, morphOffset * 0.2, -radius - morphOffset * 0.3],
          [0, morphOffset * 0.2, radius + morphOffset * 0.3],
        ];

        const rotX = time * 0.35 + mouseTiltX;
        const rotY = time * 0.55 + mouseTiltY;

        const topProj = topPyramidVertices.map(([vx, vy, vz]) =>
          project3D(vx, vy, vz, rotX, rotY, 420, cx, cy)
        );

        const botProj = bottomPyramidVertices.map(([vx, vy, vz]) =>
          project3D(vx, vy, vz, rotX, rotY, 420, cx, cy)
        );

        const topFaces = [
          [0, 1, 4], [0, 4, 2], [0, 2, 3], [0, 3, 1]
        ];
        const botFaces = [
          [0, 1, 4], [0, 4, 2], [0, 2, 3], [0, 3, 1]
        ];

        // High contrast colors in Light Mode vs Dark Mode
        bgCtx.strokeStyle = isLight
          ? (ramielMorph > 0.3 ? "#0044cc" : "#0055d4")
          : (ramielMorph > 0.3 ? "#00ffff" : "#00f0ff");
        bgCtx.lineWidth = (isLight ? 2.8 : 2.4) + ramielMorph * 1.0;
        bgCtx.shadowColor = isLight ? "#0055d4" : (ramielMorph > 0.3 ? "#00ffff" : "#00f0ff");
        bgCtx.shadowBlur = isMobile ? 0 : (isLight ? 10 : (16 + ramielMorph * 15));

        const facetFillStyle = isLight
          ? (ramielMorph > 0.3 ? "rgba(0, 85, 212, 0.35)" : "rgba(0, 85, 212, 0.22)")
          : (ramielMorph > 0.3 ? "rgba(0, 255, 255, 0.30)" : "rgba(0, 240, 255, 0.18)");

        // Render Top Facets
        topFaces.forEach(([p1, p2, p3]) => {
          bgCtx.beginPath();
          bgCtx.moveTo(topProj[p1].x, topProj[p1].y);
          bgCtx.lineTo(topProj[p2].x, topProj[p2].y);
          bgCtx.lineTo(topProj[p3].x, topProj[p3].y);
          bgCtx.closePath();
          bgCtx.fillStyle = facetFillStyle;
          bgCtx.fill();
          bgCtx.stroke();
        });

        // Render Bottom Facets
        botFaces.forEach(([p1, p2, p3]) => {
          bgCtx.beginPath();
          bgCtx.moveTo(botProj[p1].x, botProj[p1].y);
          bgCtx.lineTo(botProj[p2].x, botProj[p2].y);
          bgCtx.lineTo(botProj[p3].x, botProj[p3].y);
          bgCtx.closePath();
          bgCtx.fillStyle = facetFillStyle;
          bgCtx.fill();
          bgCtx.stroke();
        });

        // Exposing Core
        const innerRadius = radius * (0.45 + ramielMorph * 0.25);
        const innerVertices = [
          [0, -innerRadius, 0], [0, innerRadius, 0],
          [-innerRadius, 0, 0], [innerRadius, 0, 0],
          [0, 0, -innerRadius], [0, 0, innerRadius],
        ];

        const innerProj = innerVertices.map(([vx, vy, vz]) =>
          project3D(vx, vy, vz, -time * 0.9, -time * 1.3, 420, cx, cy)
        );

        const faces = [
          [0, 2, 5], [0, 5, 3], [0, 3, 4], [0, 4, 2],
          [1, 2, 5], [1, 5, 3], [1, 3, 4], [1, 4, 2],
        ];

        bgCtx.strokeStyle = isLight
          ? (ramielMorph > 0.4 ? "#cc0033" : "#d93b00")
          : (ramielMorph > 0.4 ? "#ff0055" : "#ff4500");
        bgCtx.lineWidth = isLight ? 2.6 : 2.2;
        bgCtx.shadowColor = isLight ? "#cc0033" : (ramielMorph > 0.4 ? "#ff0055" : "#ff4500");
        bgCtx.shadowBlur = isMobile ? 0 : (20 + ramielMorph * 20);

        const coreFillStyle = isLight
          ? (ramielMorph > 0.4 ? "rgba(204, 0, 51, 0.45)" : "rgba(217, 59, 0, 0.30)")
          : (ramielMorph > 0.4 ? "rgba(255, 0, 85, 0.35)" : "rgba(255, 69, 0, 0.18)");

        faces.forEach(([p1, p2, p3]) => {
          bgCtx.beginPath();
          bgCtx.moveTo(innerProj[p1].x, innerProj[p1].y);
          bgCtx.lineTo(innerProj[p2].x, innerProj[p2].y);
          bgCtx.lineTo(innerProj[p3].x, innerProj[p3].y);
          bgCtx.closePath();
          bgCtx.fillStyle = coreFillStyle;
          bgCtx.fill();
          bgCtx.stroke();
        });

        // 4 Orbiting Mini-Diamond Satellites
        if (ramielMorph > 0.2) {
          bgCtx.save();
          bgCtx.globalAlpha = ramielMorph;
          for (let s = 0; s < 4; s++) {
            const orbitAngle = time * 2 + (s * Math.PI) / 2;
            const orbitDist = radius * (1.6 + ramielMorph * 0.4);
            const satX = cx + Math.cos(orbitAngle) * orbitDist;
            const satY = cy + Math.sin(orbitAngle) * orbitDist * 0.5;

            bgCtx.beginPath();
            bgCtx.arc(satX, satY, 5 + ramielMorph * 3, 0, Math.PI * 2);
            bgCtx.fillStyle = "#00ffff";
            bgCtx.shadowColor = "#00ffff";
            bgCtx.shadowBlur = isMobile ? 0 : 15;
            bgCtx.fill();
          }
          bgCtx.restore();
        }

        // Concentrated Laser Cannon Beam on Hover
        if (ramielMorph > 0.3) {
          bgCtx.save();
          bgCtx.globalAlpha = (ramielMorph - 0.3) * 1.4;

          bgCtx.strokeStyle = "#00ffff";
          bgCtx.lineWidth = 4 + Math.sin(time * 20) * 2;
          bgCtx.shadowColor = "#00ffff";
          bgCtx.shadowBlur = isMobile ? 0 : 25;

          bgCtx.beginPath();
          bgCtx.moveTo(cx, cy);
          bgCtx.lineTo(mouseX, mouseY);
          bgCtx.stroke();

          bgCtx.strokeStyle = "rgba(255, 0, 85, 0.6)";
          bgCtx.lineWidth = isMobile ? 5 : 10;
          bgCtx.shadowColor = "#ff0055";
          bgCtx.shadowBlur = isMobile ? 0 : 30;
          bgCtx.beginPath();
          bgCtx.moveTo(cx, cy);
          bgCtx.lineTo(mouseX, mouseY);
          bgCtx.stroke();

          bgCtx.beginPath();
          bgCtx.arc(mouseX, mouseY, 15 + Math.sin(time * 15) * 5, 0, Math.PI * 2);
          bgCtx.strokeStyle = "#00ffff";
          bgCtx.lineWidth = 2;
          bgCtx.stroke();

          bgCtx.restore();
        }

        // Energy Core Center Pulse
        bgCtx.beginPath();
        bgCtx.arc(cx, cy, (8 + Math.sin(time * 8) * 3) * (1 + ramielMorph * 0.8), 0, Math.PI * 2);
        bgCtx.fillStyle = ramielMorph > 0.4 ? "#ff0055" : "#ffcc00";
        bgCtx.shadowColor = ramielMorph > 0.4 ? "#ff0055" : "#ffcc00";
        bgCtx.shadowBlur = isMobile ? 0 : 25;
        bgCtx.fill();

        bgCtx.restore();
      }

      // --- MOUSE-FOLLOWING AT-FIELD RIPPLES (BACKGROUND CANVAS Z-0) ---
      if (hasActivePointer) {
        const atFieldOpacity = Math.max(0.15, 1 - scrollRatio * 0.5);
        bgCtx.save();
        bgCtx.globalAlpha = atFieldOpacity * 0.5;
        bgCtx.strokeStyle = isLight ? "#00aa44" : "#00ff66";
        bgCtx.shadowColor = isLight ? "#00aa44" : "#00ff66";
        bgCtx.shadowBlur = isMobile ? 0 : 10;

        const rippleCount = isMobile ? 1 : 3;
        for (let r = 1; r <= rippleCount; r++) {
          const atRadius = r * 50 + ((time * 25 + r * 20) % 70);
          bgCtx.lineWidth = 1.2;
          bgCtx.globalAlpha = atFieldOpacity * (1 - atRadius / 260) * 0.4;

          bgCtx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4 + time * 0.15;
            const px = mouseX + Math.cos(angle) * atRadius;
            const py = mouseY + Math.sin(angle) * atRadius;
            if (i === 0) bgCtx.moveTo(px, py);
            else bgCtx.lineTo(px, py);
          }
          bgCtx.closePath();
          bgCtx.stroke();
        }
        bgCtx.restore();
      }

      // --- MOON & SPEAR OF LONGINUS (BACKGROUND CANVAS Z-0) ---
      const moonOpacity = Math.max(0, (scrollRatio - 0.35) * 2);
      if (moonOpacity > 0.01) {
        bgCtx.save();
        bgCtx.globalAlpha = moonOpacity * 0.85;

        const isMobileScreen = width < 768;
        const moonX = width > 1024 ? width * 0.68 : isMobileScreen ? width * 0.50 : width * 0.55;
        const moonY = height * (isMobileScreen ? 0.65 : 0.60);
        const moonRadius = Math.min(width, height) * (isMobileScreen ? 0.25 : 0.22);

        bgCtx.beginPath();
        bgCtx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        bgCtx.fillStyle = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(232, 230, 225, 0.08)";
        bgCtx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.40)" : "rgba(255, 255, 255, 0.35)";
        bgCtx.lineWidth = 2.2;
        bgCtx.shadowColor = isLight ? "#333333" : "#e8e6e1";
        bgCtx.shadowBlur = isMobileScreen ? 0 : 25;
        bgCtx.fill();
        bgCtx.stroke();

        for (let i = 0; i < 6; i++) {
          const craterX = moonX + Math.cos(i * 1.1) * (moonRadius * 0.55);
          const craterY = moonY + Math.sin(i * 1.1) * (moonRadius * 0.55);
          bgCtx.beginPath();
          bgCtx.arc(craterX, craterY, 10 + i * 5, 0, Math.PI * 2);
          bgCtx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.1)";
          bgCtx.stroke();
        }

        // --- FULL 3D ROTATING CANONICAL SPEAR OF LONGINUS ---
        bgCtx.save();

        const spearAngle = -Math.PI / 4.1;
        const spearLength = moonRadius * 3.6;
        const startX = moonX - Math.cos(spearAngle) * (spearLength * 0.40);
        const startY = moonY - Math.sin(spearAngle) * (spearLength * 0.40);
        const dirX = Math.cos(spearAngle);
        const dirY = Math.sin(spearAngle);
        const perpX = -Math.sin(spearAngle);
        const perpY = Math.cos(spearAngle);

        // Continuous 3D rotation angle of the entire spear
        const spin = time * 1.5;
        const rotCos = Math.cos(spin);
        const rotSin = Math.sin(spin);

        // Coordinate projection helper along spear local axis
        const pt = (axialDist: number, perpOffset: number) => ({
          x: startX + dirX * axialDist + perpX * perpOffset,
          y: startY + dirY * axialDist + perpY * perpOffset,
        });

        // 1. Slender Tightly-Wound Double Helix Shaft (0 to 60% of length)
        const shaftEnd = spearLength * 0.60;
        const shaftSteps = isMobileScreen ? 36 : 80;
        const strandA: { x: number; y: number }[] = [];
        const strandB: { x: number; y: number }[] = [];

        for (let i = 0; i <= shaftSteps; i++) {
          const d = (i / shaftSteps) * shaftEnd;
          const phase = d * 0.22 + spin;
          const offsetA = Math.sin(phase) * 3.2;
          const offsetB = -Math.sin(phase) * 3.2;

          strandA.push(pt(d, offsetA));
          strandB.push(pt(d, offsetB));
        }

        // Fill Shaft Ribbon
        bgCtx.beginPath();
        strandA.forEach((p, i) => (i === 0 ? bgCtx.moveTo(p.x, p.y) : bgCtx.lineTo(p.x, p.y)));
        for (let i = strandB.length - 1; i >= 0; i--) bgCtx.lineTo(strandB[i].x, strandB[i].y);
        bgCtx.closePath();
        bgCtx.fillStyle = isLight ? "#cc0029" : "#e6002b";
        bgCtx.shadowColor = "#ff0033";
        bgCtx.shadowBlur = isMobileScreen ? 0 : 14;
        bgCtx.fill();

        // Shaft Helix Outer Outlines
        bgCtx.strokeStyle = "#ff2247";
        bgCtx.lineWidth = 1.8;
        bgCtx.beginPath();
        strandA.forEach((p, i) => (i === 0 ? bgCtx.moveTo(p.x, p.y) : bgCtx.lineTo(p.x, p.y)));
        bgCtx.stroke();

        bgCtx.beginPath();
        strandB.forEach((p, i) => (i === 0 ? bgCtx.moveTo(p.x, p.y) : bgCtx.lineTo(p.x, p.y)));
        bgCtx.stroke();

        // 2. Two Interlocking Open Eyelet Loops Rotating in 3D (60% to 76% of length)
        const l1Start = shaftEnd;
        const l1Mid = spearLength * 0.64;
        const l1End = spearLength * 0.68;
        const l2Mid = spearLength * 0.72;
        const l2End = spearLength * 0.76;

        // Loop 1 (3D perspective projected with rotCos)
        const loop1Spread = 7 * rotCos;
        const loop1Thickness = 2.5 * Math.abs(rotSin) + 1.2;

        bgCtx.beginPath();
        bgCtx.moveTo(pt(l1Start, 0).x, pt(l1Start, 0).y);
        bgCtx.quadraticCurveTo(
          pt(l1Mid, -loop1Spread - loop1Thickness).x,
          pt(l1Mid, -loop1Spread - loop1Thickness).y,
          pt(l1End, 0).x,
          pt(l1End, 0).y
        );
        bgCtx.quadraticCurveTo(
          pt(l1Mid, -loop1Spread + loop1Thickness).x,
          pt(l1Mid, -loop1Spread + loop1Thickness).y,
          pt(l1Start, 0).x,
          pt(l1Start, 0).y
        );
        bgCtx.closePath();
        bgCtx.fillStyle = isLight ? "#b80024" : "#ff0033";
        bgCtx.fill();
        bgCtx.stroke();

        bgCtx.beginPath();
        bgCtx.moveTo(pt(l1Start, 0).x, pt(l1Start, 0).y);
        bgCtx.quadraticCurveTo(
          pt(l1Mid, loop1Spread + loop1Thickness).x,
          pt(l1Mid, loop1Spread + loop1Thickness).y,
          pt(l1End, 0).x,
          pt(l1End, 0).y
        );
        bgCtx.quadraticCurveTo(
          pt(l1Mid, loop1Spread - loop1Thickness).x,
          pt(l1Mid, loop1Spread - loop1Thickness).y,
          pt(l1Start, 0).x,
          pt(l1Start, 0).y
        );
        bgCtx.closePath();
        bgCtx.fillStyle = isLight ? "#b80024" : "#ff0033";
        bgCtx.fill();
        bgCtx.stroke();

        // Loop 2 (3D perspective projected with rotCos)
        const loop2Spread = 12 * rotCos;
        const loop2Thickness = 2.8 * Math.abs(rotSin) + 1.4;

        bgCtx.beginPath();
        bgCtx.moveTo(pt(l1End, 0).x, pt(l1End, 0).y);
        bgCtx.quadraticCurveTo(
          pt(l2Mid, -loop2Spread - loop2Thickness).x,
          pt(l2Mid, -loop2Spread - loop2Thickness).y,
          pt(l2End, 0).x,
          pt(l2End, 0).y
        );
        bgCtx.quadraticCurveTo(
          pt(l2Mid, -loop2Spread + loop2Thickness).x,
          pt(l2Mid, -loop2Spread + loop2Thickness).y,
          pt(l1End, 0).x,
          pt(l1End, 0).y
        );
        bgCtx.closePath();
        bgCtx.fillStyle = isLight ? "#b80024" : "#ff0033";
        bgCtx.fill();
        bgCtx.stroke();

        bgCtx.beginPath();
        bgCtx.moveTo(pt(l1End, 0).x, pt(l1End, 0).y);
        bgCtx.quadraticCurveTo(
          pt(l2Mid, loop2Spread + loop2Thickness).x,
          pt(l2Mid, loop2Spread + loop2Thickness).y,
          pt(l2End, 0).x,
          pt(l2End, 0).y
        );
        bgCtx.quadraticCurveTo(
          pt(l2Mid, loop2Spread - loop2Thickness).x,
          pt(l2Mid, loop2Spread - loop2Thickness).y,
          pt(l1End, 0).x,
          pt(l1End, 0).y
        );
        bgCtx.closePath();
        bgCtx.fillStyle = isLight ? "#b80024" : "#ff0033";
        bgCtx.fill();
        bgCtx.stroke();

        // 3. Sculpted Winged Shoulders & Barbed Notches Rotating in 3D (76% to 86% of length)
        const forkRoot = l2End;
        const barb1 = spearLength * 0.785;
        const notch = spearLength * 0.81;
        const barb2 = spearLength * 0.835;
        const tineRoot = spearLength * 0.86;

        const wingThickness = 2.2 * Math.abs(rotSin) + 1.2;

        // Left Wing (projected dynamically around 3D axis)
        const leftWing = [
          pt(forkRoot, -1.5 * rotCos),
          pt(barb1, -19 * rotCos - wingThickness),
          pt(notch, -11 * rotCos - wingThickness),
          pt(barb2, -18 * rotCos - wingThickness),
          pt(tineRoot, -6 * rotCos - wingThickness),
          pt(tineRoot, -2.5 * rotCos),
          pt(forkRoot, 0),
        ];

        bgCtx.beginPath();
        leftWing.forEach((p, i) => (i === 0 ? bgCtx.moveTo(p.x, p.y) : bgCtx.lineTo(p.x, p.y)));
        bgCtx.closePath();
        bgCtx.fillStyle = isLight ? "#b80024" : "#e6002b";
        bgCtx.fill();
        bgCtx.strokeStyle = "#ff3355";
        bgCtx.lineWidth = 1.6;
        bgCtx.stroke();

        // Right Wing (projected dynamically around 3D axis)
        const rightWing = [
          pt(forkRoot, 1.5 * rotCos),
          pt(barb1, 19 * rotCos + wingThickness),
          pt(notch, 11 * rotCos + wingThickness),
          pt(barb2, 18 * rotCos + wingThickness),
          pt(tineRoot, 6 * rotCos + wingThickness),
          pt(tineRoot, 2.5 * rotCos),
          pt(forkRoot, 0),
        ];

        bgCtx.beginPath();
        rightWing.forEach((p, i) => (i === 0 ? bgCtx.moveTo(p.x, p.y) : bgCtx.lineTo(p.x, p.y)));
        bgCtx.closePath();
        bgCtx.fillStyle = isLight ? "#b80024" : "#e6002b";
        bgCtx.fill();
        bgCtx.strokeStyle = "#ff3355";
        bgCtx.lineWidth = 1.6;
        bgCtx.stroke();

        // 4. Twin Parallel Needle Tines Rotating in 3D (86% to 100% of length)
        const tineTip = spearLength;
        const tinePreTip = spearLength * 0.97;
        const tineRadius = 4.2;
        const tineWidth = 1.8 * Math.abs(rotSin) + 1.2;

        // Left Needle Tine (3D orbiting point)
        const leftTineOffset = -tineRadius * rotCos;
        const leftTine = [
          pt(tineRoot, leftTineOffset - tineWidth),
          pt(tinePreTip, leftTineOffset - tineWidth * 0.7),
          pt(tineTip, leftTineOffset), // Sharp needle tip
          pt(tinePreTip, leftTineOffset + tineWidth * 0.7),
          pt(tineRoot, leftTineOffset + tineWidth),
        ];

        bgCtx.beginPath();
        leftTine.forEach((p, i) => (i === 0 ? bgCtx.moveTo(p.x, p.y) : bgCtx.lineTo(p.x, p.y)));
        bgCtx.closePath();
        bgCtx.fillStyle = isLight ? "#b80024" : "#e6002b";
        bgCtx.fill();
        bgCtx.strokeStyle = "#ff3355";
        bgCtx.lineWidth = 1.2;
        bgCtx.stroke();

        // Right Needle Tine (3D orbiting point)
        const rightTineOffset = tineRadius * rotCos;
        const rightTine = [
          pt(tineRoot, rightTineOffset - tineWidth),
          pt(tinePreTip, rightTineOffset - tineWidth * 0.7),
          pt(tineTip, rightTineOffset), // Sharp needle tip
          pt(tinePreTip, rightTineOffset + tineWidth * 0.7),
          pt(tineRoot, rightTineOffset + tineWidth),
        ];

        bgCtx.beginPath();
        rightTine.forEach((p, i) => (i === 0 ? bgCtx.moveTo(p.x, p.y) : bgCtx.lineTo(p.x, p.y)));
        bgCtx.closePath();
        bgCtx.fillStyle = isLight ? "#b80024" : "#e6002b";
        bgCtx.fill();
        bgCtx.strokeStyle = "#ff3355";
        bgCtx.lineWidth = 1.2;
        bgCtx.stroke();

        // 5. Dynamic 3D Specular Reflection Highlights
        bgCtx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        bgCtx.lineWidth = 1.0;
        bgCtx.shadowColor = "#ffffff";
        bgCtx.shadowBlur = 4;

        if (rotCos > 0) {
          // Right Tine Facing Forward
          bgCtx.beginPath();
          bgCtx.moveTo(pt(barb1, 17 * rotCos).x, pt(barb1, 17 * rotCos).y);
          bgCtx.lineTo(pt(notch, 10 * rotCos).x, pt(notch, 10 * rotCos).y);
          bgCtx.lineTo(pt(barb2, 16 * rotCos).x, pt(barb2, 16 * rotCos).y);
          bgCtx.lineTo(pt(tineTip, rightTineOffset).x, pt(tineTip, rightTineOffset).y);
          bgCtx.stroke();
        } else {
          // Left Tine Facing Forward
          bgCtx.beginPath();
          bgCtx.moveTo(pt(barb1, -17 * rotCos).x, pt(barb1, -17 * rotCos).y);
          bgCtx.lineTo(pt(notch, -10 * rotCos).x, pt(notch, -10 * rotCos).y);
          bgCtx.lineTo(pt(barb2, -16 * rotCos).x, pt(barb2, -16 * rotCos).y);
          bgCtx.lineTo(pt(tineTip, leftTineOffset).x, pt(tineTip, leftTineOffset).y);
          bgCtx.stroke();
        }

        // 6. Impact Point Energy Burst & Lunar Crater Shockwaves
        const impactPoint = pt(spearLength * 0.42, 0);

        // Radial Impact Plasma Burst
        const radGrad = bgCtx.createRadialGradient(
          impactPoint.x,
          impactPoint.y,
          2,
          impactPoint.x,
          impactPoint.y,
          50
        );
        radGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        radGrad.addColorStop(0.25, "rgba(255, 0, 85, 0.8)");
        radGrad.addColorStop(0.65, "rgba(255, 0, 51, 0.35)");
        radGrad.addColorStop(1, "rgba(255, 0, 51, 0)");

        bgCtx.fillStyle = radGrad;
        bgCtx.beginPath();
        bgCtx.arc(impactPoint.x, impactPoint.y, 50, 0, Math.PI * 2);
        bgCtx.fill();

        // Radiating Impact AT-Field Hexagonal Shockwaves
        for (let ring = 1; ring <= 3; ring++) {
          const ringR = ring * 18 + ((time * 30 + ring * 15) % 45);
          bgCtx.strokeStyle = "#ff0055";
          bgCtx.lineWidth = 1.5;
          bgCtx.globalAlpha = moonOpacity * (1 - ringR / 65) * 0.7;

          bgCtx.beginPath();
          for (let h = 0; h < 6; h++) {
            const hAngle = (h * Math.PI) / 3;
            const hx = impactPoint.x + Math.cos(hAngle) * ringR;
            const hy = impactPoint.y + Math.sin(hAngle) * ringR;
            if (h === 0) bgCtx.moveTo(hx, hy);
            else bgCtx.lineTo(hx, hy);
          }
          bgCtx.closePath();
          bgCtx.stroke();
        }

        bgCtx.restore();
      }

      // --- AMBIENT FLOATING PARTICLES (BACKGROUND CANVAS Z-0) ---
      bgCtx.save();
      const activeParticles = isMobile ? particles.slice(0, 16) : particles;
      activeParticles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        bgCtx.globalAlpha = p.opacity * (isLight ? 0.6 : 0.4);
        bgCtx.fillStyle = isLight ? (p.color === "#ff4500" ? "#d93b00" : "#008833") : p.color;
        bgCtx.shadowColor = isLight ? (p.color === "#ff4500" ? "#d93b00" : "#008833") : p.color;
        bgCtx.shadowBlur = isMobile ? 0 : 6;
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        bgCtx.fill();
      });
      bgCtx.restore();

      // --- FOREGROUND CLICK AT-FIELD IMPACT RINGS (FOREGROUND CANVAS Z-[9998]) ---
      for (let i = atImpacts.length - 1; i >= 0; i--) {
        const imp = atImpacts[i];
        imp.radius += (imp.maxRadius - imp.radius) * (imp.isTopArea ? 0.18 : 0.12);
        imp.opacity -= imp.isTopArea ? 0.035 : 0.022;

        if (imp.opacity <= 0) {
          atImpacts.splice(i, 1);
          continue;
        }

        fgCtx.save();
        fgCtx.globalAlpha = imp.opacity;
        fgCtx.strokeStyle = imp.color;
        fgCtx.shadowColor = imp.color;
        fgCtx.shadowBlur = isMobile ? 0 : (imp.isTopArea ? 8 : 16);
        fgCtx.lineWidth = imp.isTopArea ? 1.2 : 2.2;

        const ringCount = imp.isTopArea ? 1 : 2;
        for (let ring = 0; ring < ringCount; ring++) {
          const currentR = imp.radius * (1 - ring * 0.35);
          if (currentR <= 0) continue;

          fgCtx.beginPath();
          for (let h = 0; h < 6; h++) {
            const angle = (h * Math.PI) / 3;
            const px = imp.x + Math.cos(angle) * currentR;
            const py = imp.y + Math.sin(angle) * currentR;
            if (h === 0) fgCtx.moveTo(px, py);
            else fgCtx.lineTo(px, py);
          }
          fgCtx.closePath();
          fgCtx.stroke();
        }
        fgCtx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
      window.removeEventListener("mouseleave", handleTouchCancel);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Background Canvas: Ramiel, Moon, Mouse-Follow Ripples & Particles at z-0 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <canvas
          ref={bgCanvasRef}
          className="w-full h-full pointer-events-none opacity-90 transition-opacity duration-500"
        />
      </div>

      {/* Foreground Overlay Canvas: ONLY Click AT-Field Impact Rings at z-[9998] */}
      <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
        <canvas
          ref={fgCanvasRef}
          className="w-full h-full pointer-events-none opacity-95 transition-opacity duration-500"
        />
      </div>
    </>
  );
}
