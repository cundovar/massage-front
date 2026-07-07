import type { ComponentType } from "react";
import { ConstellationBackdrop } from "@/components/animations/ConstellationBackdrop";
import { EnsoBackdrop } from "@/components/animations/EnsoBackdrop";
import { KaresansuiBackdrop } from "@/components/animations/KaresansuiBackdrop";
import { OilBackdrop } from "@/components/animations/OilBackdrop";
import { PetalsBackdrop } from "@/components/animations/PetalsBackdrop";
import { RootsBackdrop } from "@/components/animations/RootsBackdrop";
import { WavesBackdrop } from "@/components/animations/WavesBackdrop";

/**
 * Mapping id d'animation -> composant de rendu.
 * L'id "none" n'a volontairement pas d'entrée (rien à rendre).
 * Chaque composant doit se positionner en `absolute inset-0`.
 */
export const HERO_ANIMATION_COMPONENTS: Record<string, ComponentType> = {
  constellation: ConstellationBackdrop,
  enso: EnsoBackdrop,
  karesansui: KaresansuiBackdrop,
  oil: OilBackdrop,
  petals: PetalsBackdrop,
  racines: RootsBackdrop,
  waves: WavesBackdrop,
};
