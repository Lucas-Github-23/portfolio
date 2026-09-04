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
    let smoothHeight = height;

    const setupCanvasSize = () => {
      if (!bgCanvas || !fgCanvas || !bgCtx || !fgCtx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      const isMobile = width < 768;
      // On mobile, lock height to the largest stable viewport so address bar show/hide NEVER shifts 3D coordinates
      height = isMobile
        ? Math.max(window.innerHeight, window.screen?.height ? Math.min(window.screen.height, window.innerHeight + 150) : window.innerHeight)
        : window.innerHeight;
      smoothHeight = height;

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
    let lastValidPointerX = width * 0.5;
    let lastValidPointerY = height * 0.5;

    let scrollY = window.scrollY || 0;

    // Handle Window Resize (ignore mobile URL bar toggles to prevent jarring teleports)
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const isMobile = newWidth < 768;
      // On mobile, completely ignore height fluctuations caused by browser address bar show/hide
      // Only re-setup if width actually changes (e.g. screen orientation change)
      if (isMobile && Math.abs(newWidth - width) < 20) {
        return;
      }
      setupCanvasSize();
    };

    // Precise coordinate mapping from viewport client coordinates to canvas internal coordinates
    const getCanvasCoords = (clientX: number, clientY: number) => {
      const rect = fgCanvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return { x: clientX, y: clientY };
      return {
        x: (clientX - rect.left) * (width / rect.width),
        y: (clientY - rect.top) * (height / rect.height),
      };
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchMoved = false;
    let lastTouchTime = 0;

    // Handle Mouse Movement (Ignore synthetic mouse events fired by mobile browsers after touch)
    const handleMouseMove = (e: MouseEvent) => {
      if (Date.now() - lastTouchTime < 1000) return;
      const coords = getCanvasCoords(e.clientX, e.clientY);
      targetMouseX = coords.x;
      targetMouseY = coords.y;
      lastValidPointerX = coords.x;
      lastValidPointerY = coords.y;
    };

    // Handle Scroll
    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      // If user is actively scrolling on mobile, disengage laser target so scrolling remains 100% fluid
      if (Date.now() - touchStartTime < 800) {
        touchMoved = true;
        targetMouseX = -9999;
        targetMouseY = -9999;
      }
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
      const isMobile = width < 768;
      atImpacts.push({
        x,
        y,
        radius: isTopArea ? 3 : 5,
        maxRadius: isTopArea ? 22 + Math.random() * 6 : isMobile ? 40 + Math.random() * 10 : 50 + Math.random() * 12,
        opacity: isTopArea ? 0.45 : 0.85,
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

    const handleClick = (e: MouseEvent) => {
      // Ignore click if it was simulated from a mobile touch tap in the last 600ms
      if (Date.now() - lastTouchTime < 600) return;
      const coords = getCanvasCoords(e.clientX, e.clientY);
      targetMouseX = coords.x;
      targetMouseY = coords.y;
      lastValidPointerX = coords.x;
      lastValidPointerY = coords.y;
      spawnImpactRing(coords.x, coords.y);
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchTime = Date.now();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const coords = getCanvasCoords(touch.clientX, touch.clientY);
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        touchMoved = false;

        // Only activate laser focus if touch starts in the top hero area where Ramiel is visible
        if (scrollY < 160) {
          targetMouseX = coords.x;
          targetMouseY = coords.y;
          lastValidPointerX = coords.x;
          lastValidPointerY = coords.y;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      lastTouchTime = Date.now();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);

        // If the finger moves to scroll, immediately disengage laser aim so scrolling is 100% fluid!
        if (deltaY > 8 || deltaX > 15) {
          touchMoved = true;
          targetMouseX = -9999;
          targetMouseY = -9999;
          return;
        }

        // Only track if user is holding still without scrolling
        if (!touchMoved && scrollY < 160) {
          const coords = getCanvasCoords(touch.clientX, touch.clientY);
          targetMouseX = coords.x;
          targetMouseY = coords.y;
          lastValidPointerX = coords.x;
          lastValidPointerY = coords.y;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      lastTouchTime = Date.now();
      const elapsed = Date.now() - touchStartTime;

      // Only spawn impact ring if user genuinely tapped without scrolling!
      if (!touchMoved && elapsed < 350) {
        if (e.changedTouches.length > 0) {
          const touch = e.changedTouches[0];
          const coords = getCanvasCoords(touch.clientX, touch.clientY);
          spawnImpactRing(coords.x, coords.y);
          lastValidPointerX = coords.x;
          lastValidPointerY = coords.y;
        }
      }
      // Reset target coordinates so Ramiel morph decays smoothly
      targetMouseX = -9999;
      targetMouseY = -9999;
    };

    const handleTouchCancel = () => {
      touchMoved = true;
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

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      color: string;
    }

    const particles: Particle[] = Array.from({ length: 28 }, () => ({
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

      // Ultra-smooth 60fps/120fps pointer interpolation (responsive, fluid, zero stutter)
      const hasActivePointer = targetMouseX > -5000;
      if (!hasActivePointer) {
        mouseX = -9999;
        mouseY = -9999;
      } else {
        if (mouseX < -5000) {
          mouseX = targetMouseX;
          mouseY = targetMouseY;
        } else {
          mouseX += (targetMouseX - mouseX) * 0.30;
          mouseY += (targetMouseY - mouseY) * 0.30;
        }
      }

      smoothHeight = height;

      bgCtx.clearRect(0, 0, width, height);
      fgCtx.clearRect(0, 0, width, height);

      const maxScroll = Math.max(1, document.body.scrollHeight - height);
      const actualRatio = Math.min(1, Math.max(0, scrollY / maxScroll));
      currentRatio += (actualRatio - currentRatio) * 0.08;
      const scrollRatio = currentRatio;

      // --- SECTION 1: RAMIEL (BACKGROUND CANVAS Z-0) ---
      const ramielOpacity = Math.max(0, 1 - scrollRatio * 2.5);
      if (ramielOpacity > 0.01) {
        bgCtx.save();
        bgCtx.globalAlpha = ramielOpacity * (isLight ? 0.95 : 0.9);

        // Position Ramiel on left-center side clear of Sync widget (using smoothHeight to prevent mobile jitter)
        const cx = width > 1024 ? width * 0.32 : isMobile ? width * 0.50 : width * 0.40;
        const cy = width > 1024 ? smoothHeight * 0.38 : isMobile ? smoothHeight * 0.30 : smoothHeight * 0.35;
        const radius = Math.min(width, smoothHeight) * (width > 1024 ? 0.16 : isMobile ? 0.22 : 0.18);

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

        const rotX = 0.18 + mouseTiltX;
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
          project3D(vx, vy, vz, 0.18, -time * 1.3, 420, cx, cy)
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

        // Orbiting Mini-Diamond Satellites (2 on mobile for performance, 4 on desktop)
        if (ramielMorph > 0.2) {
          bgCtx.save();
          bgCtx.globalAlpha = ramielMorph;
          const satCount = isMobile ? 2 : 4;
          for (let s = 0; s < satCount; s++) {
            const orbitAngle = time * 2 + (s * Math.PI * 2) / satCount;
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

        // Concentrated Laser Cannon Beam on Hover (Anchors precisely to cursor/touch point)
        if (ramielMorph > 0.2) {
          bgCtx.save();
          bgCtx.globalAlpha = Math.min(1.0, (ramielMorph - 0.2) * 1.5);

          const aimX = hasActivePointer ? mouseX : lastValidPointerX;
          const aimY = hasActivePointer ? mouseY : lastValidPointerY;
          const coreCenter = project3D(0, 0, 0, rotX, rotY, 420, cx, cy);

          bgCtx.strokeStyle = "#00ffff";
          bgCtx.lineWidth = 4 + Math.sin(time * 20) * 2;
          bgCtx.shadowColor = "#00ffff";
          bgCtx.shadowBlur = isMobile ? 0 : 25;

          bgCtx.beginPath();
          bgCtx.moveTo(coreCenter.x, coreCenter.y);
          bgCtx.lineTo(aimX, aimY);
          bgCtx.stroke();

          bgCtx.strokeStyle = "rgba(255, 0, 85, 0.6)";
          bgCtx.lineWidth = isMobile ? 5 : 10;
          bgCtx.shadowColor = "#ff0055";
          bgCtx.shadowBlur = isMobile ? 0 : 30;
          bgCtx.beginPath();
          bgCtx.moveTo(coreCenter.x, coreCenter.y);
          bgCtx.lineTo(aimX, aimY);
          bgCtx.stroke();

          // Reticle Target Ring
          bgCtx.beginPath();
          bgCtx.arc(aimX, aimY, 15 + Math.sin(time * 15) * 5, 0, Math.PI * 2);
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
        const moonY = smoothHeight * (isMobileScreen ? 0.65 : 0.60);
        const moonRadius = Math.min(width, smoothHeight) * (isMobileScreen ? 0.25 : 0.22);

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

        // --- FULL 3D CANONICAL SPEAR OF LONGINUS (100% FAITHFUL TO PHOTO) ---
        bgCtx.save();
        // Fully solid rendering so it looks like a real physical 3D object
        bgCtx.globalAlpha = Math.min(1.0, moonOpacity * 1.3);

        const spearAngle = -Math.PI / 4.1;
        const spearLength = moonRadius * 3.9;
        const startX = moonX - Math.cos(spearAngle) * (spearLength * 0.44);
        const startY = moonY - Math.sin(spearAngle) * (spearLength * 0.44);
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

        // Color Palette (Evangelion Metallic Blood Crimson)
        const colDarkShadow = isLight ? "#4a000a" : "#52000c";
        const colBaseRed = isLight ? "#a3001a" : "#ba0022";
        const colMainCrimson = isLight ? "#d90026" : "#e6002b";
        const colBrightHighlight = isLight ? "#ff3355" : "#ff4d6d";
        const colSpecular = "rgba(255, 240, 240, 0.95)";

        // PARAMETRIC 3D SPINE EVALUATOR FOR STRAND 1 AND STRAND 2
        // Both strands run continuously from s = 0 (base tip) to s = 1 (tine tip)
        const evalStrand = (s: number, strandId: 1 | 2) => {
          const d = s * spearLength;
          const sign = strandId === 1 ? 1 : -1;

          let offX = 0;
          let offZ = 0;
          let thickness = 2.4;

          if (s < 0.56) {
            // ZONE 1: SLENDER DOUBLE-HELIX SHAFT (0% to 56%)
            // Tapers to a sharp point at the very base (s = 0)
            const taper = Math.min(1.0, s / 0.08);
            const helixRad = taper * 3.6;
            thickness = Math.max(0.6, taper * 2.2);

            // Double helix twist with tight pitch
            const phase = s * 36.0 + spin + (strandId === 1 ? 0 : Math.PI);
            offX = Math.cos(phase) * helixRad;
            offZ = Math.sin(phase) * helixRad;
          } else if (s < 0.66) {
            // ZONE 2: THE 2 OPEN HELICAL EYELET LOOPS (56% to 66%)
            const u = (s - 0.56) / 0.10; // 0 to 1
            // Radius swells outward and creates the iconic open twists
            const loopRad = 3.6 + Math.sin(u * Math.PI) * 7.5;
            thickness = 2.5;

            const phase = 0.56 * 36.0 + u * (Math.PI * 2.0) + spin + (strandId === 1 ? 0 : Math.PI);
            offX = Math.cos(phase) * loopRad;
            offZ = Math.sin(phase) * loopRad;
          } else if (s < 0.74) {
            // ZONE 3: SCULPTED DIAMOND / LOZENGE GUARD FORK (66% to 74%)
            const u = (s - 0.66) / 0.08; // 0 to 1
            thickness = 2.6;

            // Wing profile with outer horn barb, waist notch, and secondary barb
            let wingW = 3.6;
            if (u < 0.35) {
              const k = u / 0.35;
              wingW = 3.6 + (19.0 - 3.6) * Math.sin(k * Math.PI * 0.5);
            } else if (u < 0.60) {
              const k = (u - 0.35) / 0.25;
              wingW = 19.0 + (11.5 - 19.0) * (1 - Math.cos(k * Math.PI)) * 0.5;
            } else if (u < 0.80) {
              const k = (u - 0.60) / 0.20;
              wingW = 11.5 + (17.0 - 11.5) * Math.sin(k * Math.PI * 0.5);
            } else {
              const k = (u - 0.80) / 0.20;
              wingW = 17.0 + (7.2 - 17.0) * (1 - Math.cos(k * Math.PI)) * 0.5;
            }

            // In 3D, the guard is a planar structure rotating with (rotCos, rotSin)
            offX = sign * wingW * rotCos;
            offZ = sign * wingW * rotSin;
          } else {
            // ZONE 4: TWIN PARALLEL NEEDLE TINES (74% to 100% — 26% of total length!)
            const u = (s - 0.74) / 0.26; // 0 to 1
            // Distinct, clean parallel spacing between teeth
            const tineGap = 7.2;

            // Needle tip sharpening at the final 10%
            thickness = u > 0.90 ? 2.0 * (1.0 - (u - 0.90) / 0.10) : 2.0;

            offX = sign * tineGap * rotCos;
            offZ = sign * tineGap * rotSin;
          }

          return { d, offX, offZ, thickness, pt2D: pt(d, offX) };
        };

        // Fast Pre-computed 32-step Metallic Crimson Shading LUT (Zero string allocations per frame)
        const SHADE_LUT = [
          "rgb(82,0,12)", "rgb(87,1,13)", "rgb(92,1,14)", "rgb(97,2,16)",
          "rgb(103,2,17)", "rgb(108,3,18)", "rgb(113,3,20)", "rgb(118,4,21)",
          "rgb(123,4,22)", "rgb(128,5,24)", "rgb(134,5,25)", "rgb(139,6,27)",
          "rgb(144,6,28)", "rgb(149,7,29)", "rgb(154,8,31)", "rgb(160,8,32)",
          "rgb(165,9,33)", "rgb(170,9,35)", "rgb(175,10,36)", "rgb(180,10,38)",
          "rgb(186,11,39)", "rgb(191,12,40)", "rgb(196,12,42)", "rgb(201,13,43)",
          "rgb(206,13,44)", "rgb(212,14,46)", "rgb(217,14,47)", "rgb(222,15,49)",
          "rgb(227,15,50)", "rgb(232,16,51)", "rgb(237,17,53)", "rgb(240,20,50)"
        ];

        // Discretize Strand 1 and Strand 2 into 3D segments (Calibrated for high 60-120 FPS performance)
        const sampleSteps = isMobileScreen ? 36 : 64;
        const strand1Data: ReturnType<typeof evalStrand>[] = [];
        const strand2Data: ReturnType<typeof evalStrand>[] = [];

        for (let i = 0; i <= sampleSteps; i++) {
          const s = i / sampleSteps;
          strand1Data.push(evalStrand(s, 1));
          strand2Data.push(evalStrand(s, 2));
        }

        // Disable heavy Gaussian shadowBlur inside loop for maximum FPS
        bgCtx.shadowBlur = 0;

        // Render function for an individual 3D strand segment (Fast and lightweight)
        const drawStrandSegment = (p1: typeof strand1Data[0], p2: typeof strand1Data[0]) => {
          const w1 = p1.thickness;
          const w2 = p2.thickness;

          const p1_L = pt(p1.d, p1.offX - w1);
          const p1_R = pt(p1.d, p1.offX + w1);
          const p2_L = pt(p2.d, p2.offX - w2);
          const p2_R = pt(p2.d, p2.offX + w2);

          const avgZ = (p1.offZ + p2.offZ) * 0.5;
          const normZ = Math.max(-1, Math.min(1, avgZ / 6.0));
          const lutIdx = Math.floor((normZ + 1) * 15.5);
          const col = SHADE_LUT[Math.max(0, Math.min(31, lutIdx))];

          bgCtx.beginPath();
          bgCtx.moveTo(p1_L.x, p1_L.y);
          bgCtx.lineTo(p1_R.x, p1_R.y);
          bgCtx.lineTo(p2_R.x, p2_R.y);
          bgCtx.lineTo(p2_L.x, p2_L.y);
          bgCtx.closePath();
          bgCtx.fillStyle = col;
          bgCtx.fill();

          // Smooth outer bevel edge
          bgCtx.strokeStyle = isLight ? "#9e001b" : "#6e0012";
          bgCtx.lineWidth = 0.8;
          bgCtx.stroke();
        };

        // Per-Segment True 3D Depth Sorting
        for (let i = 0; i < sampleSteps; i++) {
          const seg1_Z = (strand1Data[i].offZ + strand1Data[i + 1].offZ) * 0.5;
          const seg2_Z = (strand2Data[i].offZ + strand2Data[i + 1].offZ) * 0.5;

          if (seg1_Z <= seg2_Z) {
            drawStrandSegment(strand1Data[i], strand1Data[i + 1]);
            drawStrandSegment(strand2Data[i], strand2Data[i + 1]);
          } else {
            drawStrandSegment(strand2Data[i], strand2Data[i + 1]);
            drawStrandSegment(strand1Data[i], strand1Data[i + 1]);
          }
        }

        // Fast Batched Specular Crest Highlights
        const drawSpecularSpine = (data: typeof strand1Data) => {
          bgCtx.beginPath();
          let drawing = false;
          for (let i = 0; i < data.length - 1; i++) {
            const p1 = data[i];
            const p2 = data[i + 1];
            const avgZ = (p1.offZ + p2.offZ) * 0.5;
            if (avgZ > 0.8) {
              if (!drawing) {
                bgCtx.moveTo(p1.pt2D.x, p1.pt2D.y);
                drawing = true;
              }
              bgCtx.lineTo(p2.pt2D.x, p2.pt2D.y);
            } else {
              drawing = false;
            }
          }
          bgCtx.strokeStyle = "rgba(255, 245, 245, 0.85)";
          bgCtx.lineWidth = 1.0;
          bgCtx.stroke();
        };

        drawSpecularSpine(strand1Data);
        drawSpecularSpine(strand2Data);

        // Diamond Guard Center Aperture Fill (Solid opaque lozenge)
        const guardRoot = evalStrand(0.66, 1);
        const guardBarb1_L = evalStrand(0.69, 1);
        const guardBarb1_R = evalStrand(0.69, 2);
        const guardNotch_L = evalStrand(0.71, 1);
        const guardNotch_R = evalStrand(0.71, 2);
        const guardTine_L = evalStrand(0.74, 1);
        const guardTine_R = evalStrand(0.74, 2);

        // Draw the smooth inner diamond aperture bevels
        bgCtx.beginPath();
        bgCtx.moveTo(pt(guardRoot.d, 0).x, pt(guardRoot.d, 0).y);
        bgCtx.lineTo(guardBarb1_L.pt2D.x, guardBarb1_L.pt2D.y);
        bgCtx.lineTo(guardNotch_L.pt2D.x, guardNotch_L.pt2D.y);
        bgCtx.lineTo(guardTine_L.pt2D.x, guardTine_L.pt2D.y);
        bgCtx.lineTo(guardTine_R.pt2D.x, guardTine_R.pt2D.y);
        bgCtx.lineTo(guardNotch_R.pt2D.x, guardNotch_R.pt2D.y);
        bgCtx.lineTo(guardBarb1_R.pt2D.x, guardBarb1_R.pt2D.y);
        bgCtx.closePath();
        bgCtx.strokeStyle = isLight ? "#9e001b" : "#800014";
        bgCtx.lineWidth = 1.2;
        bgCtx.stroke();

        // 6. Impact Point Energy Burst & Lunar Crater Shockwaves
        const impactPoint = pt(spearLength * 0.44, 0);

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
        fgCtx.shadowBlur = isMobile ? 0 : (imp.isTopArea ? 6 : 12);
        fgCtx.lineWidth = imp.isTopArea ? 1.0 : (isMobile ? 1.4 : 1.8);

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
      <div className="fixed top-0 left-0 w-full h-screen h-[100lvh] pointer-events-none z-0 overflow-hidden select-none touch-none">
        <canvas
          ref={bgCanvasRef}
          className="w-full h-full pointer-events-none opacity-90 transition-opacity duration-500 select-none"
        />
      </div>

      {/* Foreground Overlay Canvas: ONLY Click AT-Field Impact Rings at z-[9998] */}
      <div className="fixed top-0 left-0 w-full h-screen h-[100lvh] pointer-events-none z-[9998] overflow-hidden select-none touch-none">
        <canvas
          ref={fgCanvasRef}
          className="w-full h-full pointer-events-none opacity-95 transition-opacity duration-500 select-none"
        />
      </div>
    </>
  );
}
