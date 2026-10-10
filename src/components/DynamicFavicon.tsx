"use client";

import { useEffect, useState } from "react";
import { safeGetItem, safeSetItem } from "@/utils/storage";

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
    description: "Inverted tactical triad representing Claude 3.7, GPT-4o, and Gemini 2.0 interconnected nodes.",
    descriptionPt: "Tríade tática invertida representando os nós interconectados Claude 3.7, GPT-4o e Gemini 2.0.",
    path: "/icons/icon-magi.svg",
    themeColor: "#FFB300",
  },
];

export function updateFavicon(path: string) {
  if (typeof document === "undefined") return;

  // Update or create dedicated dynamic favicon link without mutating static Next.js favicons
  let iconLink = document.querySelector("link#dynamic-favicon") as HTMLLinkElement | null;
  if (iconLink) {
    iconLink.href = path;
    iconLink.type = "image/svg+xml";
  } else {
    const newLink = document.createElement("link");
    newLink.id = "dynamic-favicon";
    newLink.rel = "icon";
    newLink.type = "image/svg+xml";
    newLink.href = path;
    document.head.appendChild(newLink);
  }
}

export function DynamicFavicon() {
  const [selectedVariant, setSelectedVariant] = useState<IconVariant>("random");
  const [activeIcon, setActiveIcon] = useState<IconInfo>(ICON_VARIANTS[0]);

  useEffect(() => {
    // Read saved preference or default to random
    const saved = safeGetItem("nerv_fav_variant", "random") as IconVariant;
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
      safeSetItem("nerv_fav_variant", variant);

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
