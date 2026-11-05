import { getImageUrl } from "@/lib/api";
import type { ContactInfosContent, HeroSlide } from "@/types";
import type { PublicSettings } from "@/types/settings";

const SCOPE_CLASS = "gjs-page";

/** Scopes the exported CSS to the page content and points its images to the media server. */
export function prepareGrapesCss(css: string): string {
  const withImages = css.replace(
    /url\((['"]?)(\/images\/[^'")]+)\1\)/g,
    (_match, _quote, path: string) => `url("${getImageUrl(path)}")`,
  );

  return `.${SCOPE_CLASS}{${withImages}}`;
}

export function parseHeroSlides(raw: string | undefined): HeroSlide[] {
  if (!raw) {
    return [];
  }

  try {
    const slides: unknown = JSON.parse(raw);
    return Array.isArray(slides) ? (slides as HeroSlide[]) : [];
  } catch {
    return [];
  }
}

export function toContactContent(settings: PublicSettings): ContactInfosContent {
  const { contact, hours } = settings;

  return {
    address: { street: contact.address.street, city: `${contact.address.postalCode} ${contact.address.city}`.trim() },
    addresses: contact.locations?.map((location) => ({
      label: location.label,
      street: location.street,
      city: `${location.postalCode} ${location.city}`.trim(),
    })),
    phone: contact.phone,
    email: contact.email,
    hours: hours.schedule,
  };
}

export { SCOPE_CLASS as GRAPES_SCOPE_CLASS };
