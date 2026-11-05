export type GrapesDevice = "desktop" | "tablet" | "mobile";

export const GRAPES_DEVICES: { id: GrapesDevice; name: string; width: string; widthMedia?: string }[] = [
  { id: "desktop", name: "Ordinateur", width: "" },
  { id: "tablet", name: "Tablette", width: "768px", widthMedia: "1023px" },
  { id: "mobile", name: "Téléphone", width: "375px", widthMedia: "767px" },
];

const FLEX_OR_GRID = ["flex", "grid"];

// minmax(0, 1fr) : une image large ne peut pas élargir sa colonne.
const GRID_COLUMN_OPTIONS = [
  { id: "", label: "- Choisir -" },
  ...[1, 2, 3, 4, 5, 6].map((count) => ({
    id: `repeat(${count}, minmax(0, 1fr))`,
    label: count === 1 ? "1 colonne" : `${count} colonnes égales`,
  })),
  { id: "minmax(0, 1fr) minmax(0, 2fr)", label: "2 colonnes 1/3 - 2/3" },
  { id: "minmax(0, 2fr) minmax(0, 1fr)", label: "2 colonnes 2/3 - 1/3" },
];

const GRID_SPAN_OPTIONS = [
  { id: "", label: "1 colonne" },
  ...[2, 3, 4].map((count) => ({ id: `span ${count}`, label: `${count} colonnes` })),
  { id: "1 / -1", label: "Toute la largeur" },
];

export const GRAPES_STYLE_SECTORS = [
  {
    id: "hm-layout",
    name: "Disposition",
    open: false,
    properties: [
      {
        extend: "display",
        options: [
          { id: "block", label: "block" },
          { id: "inline", label: "inline" },
          { id: "inline-block", label: "inline-block" },
          { id: "flex", label: "flex" },
          { id: "grid", label: "grid" },
          { id: "none", label: "none" },
        ],
      },
      { extend: "flex-direction", requires: { display: ["flex"] } },
      { extend: "flex-wrap", requires: { display: ["flex"] } },
      {
        property: "grid-template-columns",
        label: "Colonnes",
        type: "select",
        default: "",
        options: GRID_COLUMN_OPTIONS,
        requires: { display: ["grid"] },
      },
      { extend: "justify-content", requires: { display: FLEX_OR_GRID } },
      { extend: "align-items", requires: { display: FLEX_OR_GRID } },
      { property: "gap", label: "Écart", type: "number", units: ["px", "rem", "%"], min: 0, default: "0", requires: { display: FLEX_OR_GRID } },
      {
        property: "grid-column",
        label: "Largeur dans la grille",
        type: "select",
        default: "",
        options: GRID_SPAN_OPTIONS,
        requiresParent: { display: ["grid"] },
      },
    ],
  },
  { id: "hm-size", name: "Taille", open: false, buildProps: ["width", "max-width", "height", "min-height"] },
  { id: "hm-space", name: "Espacement", open: false, buildProps: ["margin", "padding"] },
  { id: "hm-position", name: "Position", open: false, buildProps: ["position", "top", "right", "bottom", "left"] },
  {
    id: "hm-typography",
    name: "Typographie",
    open: true,
    buildProps: ["font-family", "font-size", "font-weight", "line-height", "letter-spacing", "color", "text-align", "text-shadow"],
  },
  { id: "hm-background", name: "Fond", open: false, buildProps: ["background-color", "background"] },
  { id: "hm-borders", name: "Bordures", open: false, buildProps: ["border-radius", "border"] },
  { id: "hm-effects", name: "Effets", open: false, buildProps: ["opacity", "box-shadow", "transition", "transform"] },
];
