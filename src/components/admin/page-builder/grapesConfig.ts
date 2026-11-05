export type GrapesDevice = "desktop" | "tablet" | "mobile";

export const GRAPES_DEVICES: { id: GrapesDevice; name: string; width: string; widthMedia?: string }[] = [
  { id: "desktop", name: "Ordinateur", width: "" },
  { id: "tablet", name: "Tablette", width: "768px", widthMedia: "1023px" },
  { id: "mobile", name: "Téléphone", width: "375px", widthMedia: "767px" },
];

export const GRAPES_STYLE_SECTORS = [
  {
    id: "hm-layout",
    name: "Disposition",
    open: false,
    buildProps: ["display", "flex-direction", "flex-wrap", "justify-content", "align-items"],
    properties: [{ property: "gap", label: "Écart", type: "number", units: ["px", "rem", "%"], min: 0, default: "0" }],
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
