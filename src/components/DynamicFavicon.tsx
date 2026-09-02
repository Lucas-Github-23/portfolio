"use client";

import { useEffect, useState } from "react";

export type IconVariant = "random" | "tactical-l" | "ramiel" | "magi";

export interface IconInfo {
  id: "tactical-l" | "ramiel" | "magi";
  name: string;
  namePt: string;
  badge: string;
  description: string;
  descriptionPt: string;
  path: string;
  themeColor: string;
}

export const ICON_VARIANTS: IconInfo[] = [
  {
    id: "tactical-l",
    name: "Tactical Monogram 'L'",
    namePt: "Monograma Tático 'L'",
    badge: "NERV // DEV-02",
    description: "Angular cybernetic 'L' with NERV amber gradient (#FF4500) and sync green status lights.",
    descriptionPt: "Letra 'L' angular cibernética com gradiente âmbar NERV (#FF4500) e luzes de sincronização verdes.",
    path: "/icons/icon-tactical-l.svg",
    themeColor: "#FF4500",
  },
  {
    id: "ramiel",
    name: "Ramiel Octahedron Core",
    namePt: "Núcleo Octaedro Ramiel",
    badge: "ANGEL // 5TH",
    description: "Translucent cyan/cobalt 3D octahedron crystal with concentric gold AT-field rings and laser reticle.",
    descriptionPt: "Cristal octaedro 3D ciano e cobalto com anéis de AT-field dourados e retículo laser.",
    path: "/icons/icon-ramiel.svg",
    themeColor: "#00E5FF",
  },
  {
    id: "magi",
    name: "MAGI Triad Consensus",
    namePt: "Tríade MAGI de Consenso",
    badge: "MAGI // 3-CORE",
    description: "Inverted tactical triad representing Melchior-1, Balthasar-2, and Caspar-3 interconnected nodes.",
    descriptionPt: "Tríade tática invertida representando os nós interconectados Melchior-1, Balthasar-2 e Caspar-3.",
    path: "/icons/icon-magi.svg",
    themeColor: "#FFB300",
  },
];

export function updateFavicon(path: string) {
  if (typeof document === "undefined") return;

  // Remove existing icon links
  const existingIcons = document.querySelectorAll("link[rel*='icon']");
  existingIcons.forEach((el) => el.remove());

  // Create new high-priority SVG icon link
  const link = document.createElement("link");
  link.type = "image/svg+xml";
  link.rel = "icon";
  link.href = path;
  document.head.appendChild(link);

  // Also update apple-touch-icon
  let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
  if (!appleLink) {
    appleLink = document.createElement("link");
    appleLink.rel = "apple-touch-icon";
    document.head.appendChild(appleLink);
  }
  appleLink.href = path;
}

export function DynamicFavicon() {
  const [selectedVariant, setSelectedVariant] = useState<IconVariant>("random");
  const [activeIcon, setActiveIcon] = useState<IconInfo>(ICON_VARIANTS[0]);

  useEffect(() => {
    // Read saved preference or default to random
    const saved = (localStorage.getItem("nerv_fav_variant") as IconVariant) || "random";
    setSelectedVariant(saved);

    let chosen: IconInfo;
    if (saved === "random" || !ICON_VARIANTS.some((v) => v.id === saved)) {
      const randomIndex = Math.floor(Math.random() * ICON_VARIANTS.length);
      chosen = ICON_VARIANTS[randomIndex];
    } else {
      chosen = ICON_VARIANTS.find((v) => v.id === saved) || ICON_VARIANTS[0];
    }

    setActiveIcon(chosen);
    updateFavicon(chosen.path);

    // Listen to custom event for manual switching
    const handleIconChange = (e: CustomEvent<IconVariant>) => {
      const variant = e.detail;
      setSelectedVariant(variant);
      localStorage.setItem("nerv_fav_variant", variant);

      let target: IconInfo;
      if (variant === "random") {
        const idx = Math.floor(Math.random() * ICON_VARIANTS.length);
        target = ICON_VARIANTS[idx];
      } else {
        target = ICON_VARIANTS.find((v) => v.id === variant) || ICON_VARIANTS[0];
      }
      setActiveIcon(target);
      updateFavicon(target.path);
    };

    window.addEventListener("nerv_change_icon" as never, handleIconChange as never);
    return () => {
      window.removeEventListener("nerv_change_icon" as never, handleIconChange as never);
    };
  }, []);

  return null;
}
