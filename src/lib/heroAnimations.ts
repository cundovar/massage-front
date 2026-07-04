/**
 * Registre des animations de hero sélectionnables dans le back-office.
 *
 * Métadonnées pures (pas de composant React ici) afin d'être importées aussi
 * bien par le catalogue admin (block-catalog) que par le rendu (Hero).
 * Le mapping id -> composant vit dans `components/animations/heroAnimationComponents`.
 *
 * Pour ajouter une animation : ajouter une entrée ici + le composant dans le map.
 */

export type HeroAnimationMode = "background" | "overlay";

export interface HeroAnimationMeta {
  id: string;
  label: string;
  /** "background" remplace le fond (image/gradient), "overlay" se superpose par-dessus. */
  mode: HeroAnimationMode;
}

export const HERO_ANIMATIONS: HeroAnimationMeta[] = [
  { id: "none", label: "Aucune", mode: "overlay" },
  { id: "enso", label: "Ensō & encens (sumi-e)", mode: "background" },
  { id: "karesansui", label: "Jardin zen karesansui", mode: "background" },
  { id: "oil", label: "Goutte d'huile doree", mode: "background" },
  { id: "petals", label: "Petales sur l'eau", mode: "background" },
  { id: "waves", label: "Vagues & ondes", mode: "background" },
];

/** Options prêtes pour un champ `select` du page-builder. */
export const ANIMATION_OPTIONS = HERO_ANIMATIONS.map((a) => ({ value: a.id, label: a.label }));

export function getAnimationMeta(id?: string | null): HeroAnimationMeta {
  return HERO_ANIMATIONS.find((a) => a.id === id) ?? HERO_ANIMATIONS[0];
}
