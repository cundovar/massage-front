import type { BlockAppearance, BlockResponsiveLayout } from "@/components/dynamic/BlockAppearanceFrame";

/**
 * Réglages « Disposition responsive » partagés par les blocs.
 *
 * Chaque bloc fournit ses valeurs par défaut et ses gabarits de colonnes ;
 * ce module traduit les choix de l'éditeur en classes Tailwind. Les classes
 * passées en options doivent être écrites en toutes lettres dans le composant
 * appelant pour que Tailwind les détecte.
 */

export function getBlockLayout(content: unknown): BlockResponsiveLayout | undefined {
  return (content as { _appearance?: BlockAppearance } | null | undefined)?._appearance?.layout;
}

/* ------------------------------------------------------------------ */
/* Texte + média                                                       */
/* ------------------------------------------------------------------ */

export interface SplitLayoutOptions {
  /** Classes appliquées quand le bloc est sur 2 colonnes, ex. "md:grid-cols-2". */
  tabletColumns: string;
  desktopColumns: string;
  /** Disposition quand l'éditeur laisse « Automatique ». */
  defaultTablet: "stacked" | "two-columns";
  defaultDesktop: "stacked" | "two-columns";
  /** Ordre sur mobile quand l'éditeur laisse « Automatique ». */
  mediaFirstByDefault: boolean;
}

export interface SplitLayout {
  container: string;
  media: string;
  text: string;
  tabletSplit: boolean;
  desktopSplit: boolean;
}

export function getSplitLayout(layout: BlockResponsiveLayout | undefined, options: SplitLayoutOptions): SplitLayout {
  const tabletChoice = layout?.tabletLayout && layout.tabletLayout !== "default" ? layout.tabletLayout : options.defaultTablet;
  const desktopChoice = layout?.desktopLayout && layout.desktopLayout !== "default" ? layout.desktopLayout : options.defaultDesktop;
  const tabletSplit = tabletChoice === "two-columns";
  const desktopSplit = desktopChoice === "two-columns";

  const mediaFirst =
    layout?.mobileOrder === "image-first" ? true : layout?.mobileOrder === "text-first" ? false : options.mediaFirstByDefault;

  const container = [
    tabletSplit ? options.tabletColumns : "",
    desktopSplit ? options.desktopColumns : tabletSplit ? "lg:grid-cols-1" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // L'ordre mobile reste tant que le bloc est empilé ; en 2 colonnes on revient à l'ordre du DOM.
  const media = [
    mediaFirst ? "order-1" : "order-2",
    tabletSplit ? "md:order-none" : "",
    desktopSplit && !tabletSplit ? "lg:order-none" : "",
    !desktopSplit && tabletSplit ? (mediaFirst ? "lg:order-1" : "lg:order-2") : "",
  ];
  const text = [
    mediaFirst ? "order-2" : "order-1",
    tabletSplit ? "md:order-none" : "",
    desktopSplit && !tabletSplit ? "lg:order-none" : "",
    !desktopSplit && tabletSplit ? (mediaFirst ? "lg:order-2" : "lg:order-1") : "",
  ];

  return {
    container,
    media: media.filter(Boolean).join(" "),
    text: text.filter(Boolean).join(" "),
    tabletSplit,
    desktopSplit,
  };
}

/* ------------------------------------------------------------------ */
/* Grille de cartes                                                    */
/* ------------------------------------------------------------------ */

export type GridColumnCount = 1 | 2 | 3;

export interface CardGridOptions {
  defaultTablet: GridColumnCount;
  defaultDesktop: GridColumnCount;
  /** Plafond de colonnes (ex. nombre de cartes, ou 2 pour un bloc à deux cartes). */
  max?: GridColumnCount;
  /** Point de rupture « bureau » : lg par défaut, xl pour des cartes larges. */
  desktopBreakpoint?: "lg" | "xl";
}

export interface CardGrid {
  className: string;
  tabletColumns: GridColumnCount;
  desktopColumns: GridColumnCount;
}

const TABLET_GRID_COLUMNS: Record<GridColumnCount, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

const DESKTOP_GRID_COLUMNS: Record<"lg" | "xl", Record<GridColumnCount, string>> = {
  lg: { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3" },
  xl: { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3" },
};

function parseColumns(value: string | undefined): GridColumnCount | null {
  return value === "1" ? 1 : value === "2" ? 2 : value === "3" ? 3 : null;
}

export function getCardGrid(layout: BlockResponsiveLayout | undefined, options: CardGridOptions): CardGrid {
  const max = options.max ?? 3;
  const tabletColumns = Math.min(parseColumns(layout?.tabletColumns) ?? options.defaultTablet, max) as GridColumnCount;
  const desktopColumns = Math.min(parseColumns(layout?.desktopColumns) ?? options.defaultDesktop, max) as GridColumnCount;
  const breakpoint = options.desktopBreakpoint ?? "lg";

  return {
    className: `grid-cols-1 ${TABLET_GRID_COLUMNS[tabletColumns]} ${DESKTOP_GRID_COLUMNS[breakpoint][desktopColumns]}`,
    tabletColumns,
    desktopColumns,
  };
}
