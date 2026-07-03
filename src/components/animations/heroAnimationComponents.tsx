import type { ComponentType } from "react";
import { EnsoBackdrop } from "@/components/animations/EnsoBackdrop";
import { WavesBackdrop } from "@/components/animations/WavesBackdrop";

/**
 * Mapping id d'animation -> composant de rendu.
 * L'id "none" n'a volontairement pas d'entrée (rien à rendre).
 * Chaque composant doit se positionner en `absolute inset-0`.
 */
export const HERO_ANIMATION_COMPONENTS: Record<string, ComponentType> = {
  enso: EnsoBackdrop,
  waves: WavesBackdrop,
};
