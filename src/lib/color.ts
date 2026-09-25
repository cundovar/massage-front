/**
 * Outils de couleur pour garder un texte lisible sur un fond choisi par l'admin.
 */

/** Convertit "#RRGGBB" en composantes 0-255, ou null si le format est invalide. */
export function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!match) return null;
  return [Number.parseInt(match[1], 16), Number.parseInt(match[2], 16), Number.parseInt(match[3], 16)];
}

/** Luminance relative WCAG (0 = noir, 1 = blanc). */
export function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/**
 * Vrai si un texte fonce est plus lisible qu'un texte clair sur cette couleur.
 * Compare le contraste WCAG avec un noir chaud (#1C1917) et un blanc.
 */
export function prefersDarkText(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  const luminance = relativeLuminance(rgb);
  const contrastWithDark = (luminance + 0.05) / (relativeLuminance([28, 25, 23]) + 0.05);
  const contrastWithLight = 1.05 / (luminance + 0.05);
  return contrastWithDark >= contrastWithLight;
}
