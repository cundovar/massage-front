import {
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_ENTREPRISE,
  DEFAULT_HOME,
  DEFAULT_MENTIONS,
  DEFAULT_SOINS,
  fallbackServices,
} from "@/lib/defaultContent";
import type { NavigationResponse } from "@/types/navigation";
import type { PublicSettings } from "@/types/settings";
import type {
  AboutHeroContent,
  ApprocheContent,
  ContactHeroContent,
  ContactInfosContent,
  FormationsContent,
  HeroContent,
  PageDetail,
  ParcoursContent,
  PresentationContent,
  SoinsHeroContent,
  TarifsContent,
  EntrepriseContent,
  SoinCategoryContent,
  ServiceItem,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL;
const FETCH_TIMEOUT_MS = 4000;

function shouldSkipRemoteFetch(): boolean {
  const isVercelBuild = process.env.VERCEL === "1" || process.env.CI === "true";
  const isLocalApi =
    API_BASE_URL.includes("127.0.0.1") ||
    API_BASE_URL.includes("localhost");

  return isVercelBuild && isLocalApi;
}

async function fetchWithTimeout(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

interface ServicesResponse {
  items: ServiceItem[];
}

const FALLBACK_SETTINGS: PublicSettings = {
  general: {
    siteName: "Helene Massage & Ayurveda",
    logo: null,
    favicon: null,
    defaultMetaDescription: "Massages ayurvediques, reflexologie et Kobido a Paris.",
  },
  contact: {
    address: { street: "123 Rue du Bien-Etre", postalCode: "75011", city: "Paris" },
    phone: "06 12 34 56 78",
    email: "contact@helene-massage.fr",
    googleMapsUrl: null,
    googleMapsEmbed: null,
  },
  hours: {
    schedule: [
      { days: "Lundi - Vendredi", hours: "10h - 20h" },
      { days: "Samedi", hours: "10h - 18h" },
    ],
    closedMessage: "Ferme le dimanche",
  },
  social: { instagram: null, facebook: null, linkedin: null },
  booking: { minDelayHours: 24, confirmationMessage: "Merci pour votre demande. Je vous recontacte dans les 24h." },
  appearance: {
    themePreset: "ayurveda",
    useCustomAccent: false,
    customAccentColor: null,
    headerStyle: "sticky",
    showDarkModeToggle: true,
    bodyBackgroundImage: null,
  },
  footer: {
    copyrightText: "© 2024 Helene Massage & Ayurveda",
    quickLinks: [],
    showSocialLinks: true,
    showContactInfo: true,
    showHours: false,
    customDescription: null,
    mentionsLegalesText: "Mentions legales",
    showMentionsLegales: true,
  },
  navigation: { externalLinks: [] },
};

function normalizeSettingsPayload(raw: unknown): PublicSettings {
  if (!raw || typeof raw !== "object") {
    return FALLBACK_SETTINGS;
  }

  const data = raw as Record<string, unknown>;

  // New API shape: { general, contact, hours, ... }
  if (data.general && typeof data.general === "object") {
    const merged = {
      ...FALLBACK_SETTINGS,
      ...data,
      general: { ...FALLBACK_SETTINGS.general, ...(data.general as Record<string, unknown>) },
      contact: { ...FALLBACK_SETTINGS.contact, ...(data.contact as Record<string, unknown>) },
      hours: { ...FALLBACK_SETTINGS.hours, ...(data.hours as Record<string, unknown>) },
      social: { ...FALLBACK_SETTINGS.social, ...(data.social as Record<string, unknown>) },
      booking: { ...FALLBACK_SETTINGS.booking, ...(data.booking as Record<string, unknown>) },
      appearance: { ...FALLBACK_SETTINGS.appearance, ...(data.appearance as Record<string, unknown>) },
      footer: { ...FALLBACK_SETTINGS.footer, ...(data.footer as Record<string, unknown>) },
    } as PublicSettings;

    return merged;
  }

  // Legacy API shape compatibility
  return {
    general: {
      siteName: typeof data.siteName === "string" ? data.siteName : FALLBACK_SETTINGS.general.siteName,
      logo: typeof data.logo === "string" ? data.logo : null,
      favicon: null,
      defaultMetaDescription:
        typeof data.tagline === "string" && data.tagline.trim().length > 0
          ? data.tagline
          : FALLBACK_SETTINGS.general.defaultMetaDescription,
    },
    contact: {
      address:
        data.address && typeof data.address === "object"
          ? {
              street: String((data.address as Record<string, unknown>).street ?? ""),
              postalCode: String((data.address as Record<string, unknown>).postalCode ?? ""),
              city: String((data.address as Record<string, unknown>).city ?? ""),
            }
          : FALLBACK_SETTINGS.contact.address,
      phone: typeof data.contactPhone === "string" ? data.contactPhone : FALLBACK_SETTINGS.contact.phone,
      email: typeof data.contactEmail === "string" ? data.contactEmail : FALLBACK_SETTINGS.contact.email,
      googleMapsUrl: null,
      googleMapsEmbed: null,
    },
    hours: FALLBACK_SETTINGS.hours,
    social:
      data.socialLinks && typeof data.socialLinks === "object"
        ? {
            instagram: ((data.socialLinks as Record<string, unknown>).instagram as string | null) ?? null,
            facebook: ((data.socialLinks as Record<string, unknown>).facebook as string | null) ?? null,
            linkedin: ((data.socialLinks as Record<string, unknown>).linkedin as string | null) ?? null,
          }
        : FALLBACK_SETTINGS.social,
    booking: FALLBACK_SETTINGS.booking,
    appearance: FALLBACK_SETTINGS.appearance,
    footer: FALLBACK_SETTINGS.footer,
    navigation: FALLBACK_SETTINGS.navigation,
  };
}

interface PageResponse {
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  sections: Record<string, { type?: string; title: string | null; content: Record<string, unknown>; sortOrder?: number }>;
}

const FALLBACK_NAVIGATION: NavigationResponse = {
  items: [
    { slug: "home", title: "Accueil", path: "/" },
    { slug: "soins", title: "Carte & tarifs", path: "/soins" },
    { slug: "entreprise", title: "Entreprise", path: "/entreprise" },
    { slug: "about", title: "A propos", path: "/a-propos" },
    { slug: "contact", title: "Contact", path: "/contact" },
  ],
};

const FALLBACK_PAGES: Record<string, PageResponse> = {
  home: {
    slug: "home",
    title: "Accueil",
    metaTitle: DEFAULT_HOME.seo.metaTitle,
    metaDescription: DEFAULT_HOME.seo.metaDescription,
    sections: {
      hero: {
        title: null,
        content: DEFAULT_HOME.hero,
      },
      presentation: {
        title: DEFAULT_HOME.presentation.title,
        content: DEFAULT_HOME.presentation,
      },
      approche: {
        title: DEFAULT_HOME.approche.title,
        content: DEFAULT_HOME.approche,
      },
    },
  },
  soins: {
    slug: "soins",
    title: "Soins",
    metaTitle: null,
    metaDescription: null,
    sections: {
      hero: {
        title: null,
        content: DEFAULT_SOINS.hero,
      },
      intro: {
        title: null,
        content: DEFAULT_SOINS.intro,
      },
    },
  },
  about: {
    slug: "about",
    title: "A propos",
    metaTitle: null,
    metaDescription: null,
    sections: {
      hero: {
        title: null,
        content: DEFAULT_ABOUT.hero,
      },
      parcours: {
        title: "Mon parcours",
        content: DEFAULT_ABOUT.parcours,
      },
      formations: {
        title: "Formations",
        content: DEFAULT_ABOUT.formations,
      },
      philosophie: {
        title: null,
        content: DEFAULT_ABOUT.philosophie,
      },
    },
  },
  contact: {
    slug: "contact",
    title: "Contact",
    metaTitle: null,
    metaDescription: null,
    sections: {
      hero: {
        title: null,
        content: DEFAULT_CONTACT.hero as Record<string, unknown>,
      },
      infos: {
        title: null,
        content: DEFAULT_CONTACT.infos,
      },
    },
  },
  "mentions-legales": {
    slug: "mentions-legales",
    title: "Mentions legales",
    metaTitle: null,
    metaDescription: null,
    sections: {
      content: {
        title: DEFAULT_MENTIONS.content.title,
        content: DEFAULT_MENTIONS.content,
      },
    },
  },
  entreprise: {
    slug: "entreprise",
    title: "Entreprise",
    metaTitle: null,
    metaDescription: null,
    sections: {
      entreprise: {
        title: DEFAULT_ENTREPRISE.entreprise.title,
        content: DEFAULT_ENTREPRISE.entreprise,
      },
    },
  },
};

export async function fetchServices(): Promise<ServiceItem[]> {
  if (shouldSkipRemoteFetch()) {
    return fallbackServices;
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/services`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackServices;
    }

    const data = (await response.json()) as ServicesResponse;
    return Array.isArray(data.items) ? data.items : fallbackServices;
  } catch {
    return fallbackServices;
  }
}

export const getServices = fetchServices;

export async function getNavigation(): Promise<NavigationResponse> {
  if (shouldSkipRemoteFetch()) {
    return FALLBACK_NAVIGATION;
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/navigation`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return FALLBACK_NAVIGATION;
    }

    const data = (await response.json()) as NavigationResponse;
    if (!Array.isArray(data.items)) {
      return FALLBACK_NAVIGATION;
    }

    return data;
  } catch {
    return FALLBACK_NAVIGATION;
  }
}

export async function getSettings(): Promise<PublicSettings> {
  if (shouldSkipRemoteFetch()) {
    return FALLBACK_SETTINGS;
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/settings`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return FALLBACK_SETTINGS;
    }
    const data = (await response.json()) as unknown;
    return normalizeSettingsPayload(data);
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export async function getPage(slug: string): Promise<PageResponse>;
export async function getPage(slug: string, options: { fallback: true }): Promise<PageResponse>;
export async function getPage(slug: string, options: { fallback: false }): Promise<PageResponse | null>;
export async function getPage(slug: string, options?: { fallback?: boolean }): Promise<PageResponse | null> {
  const useFallback = options?.fallback ?? true;
  if (shouldSkipRemoteFetch()) {
    if (!useFallback) {
      return null;
    }
    return FALLBACK_PAGES[slug] ?? FALLBACK_PAGES.home;
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/pages/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (!useFallback) {
        return null;
      }
      return FALLBACK_PAGES[slug] ?? FALLBACK_PAGES.home;
    }

    return (await response.json()) as PageResponse;
  } catch {
    if (!useFallback) {
      return null;
    }
    return FALLBACK_PAGES[slug] ?? FALLBACK_PAGES.home;
  }
}

export function getSectionContent<T>(page: PageResponse, key: string, fallback: T): T {
  const section = page.sections?.[key];
  if (!section || !section.content) {
    return fallback;
  }

  return section.content as T;
}

export function getSectionTitle(page: PageResponse, key: string, fallback: string): string {
  const section = page.sections?.[key];
  return section?.title ?? fallback;
}

export function getImageUrl(path?: string | null): string | null {
  if (!path) {
    return null;
  }
  if (path.startsWith("http")) {
    return path;
  }

  // Priority 1: Use dedicated media URL if configured
  if (MEDIA_BASE_URL && MEDIA_BASE_URL.trim().length > 0) {
    return `${MEDIA_BASE_URL.replace(/\/$/, "")}${path}`;
  }

  // Priority 2: Use API URL (images are served from the API server)
  // Important: Don't fall back to window.location.origin as images are on the API server, not the frontend
  return `${API_BASE_URL}${path}`;
}

export function mapPageDetail(page: PageDetail): PageResponse {
  const sections: PageResponse["sections"] = {};
  Object.entries(page.sections).forEach(([key, section]) => {
    sections[key] = {
      type: section.type,
      title: section.title,
      content: section.content,
    };
  });

  return {
    slug: page.slug,
    title: page.title,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    sections,
  };
}

export type {
  HeroContent,
  PresentationContent,
  ApprocheContent,
  SoinsHeroContent,
  SoinCategoryContent,
  TarifsContent,
  EntrepriseContent,
  AboutHeroContent,
  ParcoursContent,
  FormationsContent,
  ContactHeroContent,
  ContactInfosContent,
  PageResponse,
  PublicSettings,
};
