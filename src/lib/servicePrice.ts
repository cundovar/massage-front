export interface ServicePrice {
  label: string;
  price?: number;
  unit?: string;
}

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(price)}€`;
}

export function parsePrice(raw: string): ServicePrice {
  const normalized = raw.replace(/\s+/g, " ").trim();
  const priceMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:EUR|EUROS?|€)\b/i);

  if (!priceMatch) {
    return { label: normalized };
  }

  const value = Number.parseFloat(priceMatch[1].replace(",", "."));
  const beforePrice = normalized.slice(0, priceMatch.index).replace(/[·\-–—\s]+$/g, "").trim();
  const afterPrice = normalized.slice((priceMatch.index ?? 0) + priceMatch[0].length).replace(/^[·\-–—\s]+/g, "").trim();

  return {
    label: beforePrice || "Seance",
    price: Number.isNaN(value) ? undefined : value,
    unit: afterPrice || undefined,
  };
}
