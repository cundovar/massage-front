import {
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_ENTREPRISE,
  DEFAULT_HOME,
  DEFAULT_MENTIONS,
  DEFAULT_SOINS,
  fallbackServices,
} from "@/lib/defaultContent";
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

interface ServicesResponse {
  items: ServiceItem[];
}

interface PageResponse {
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  sections: Record<string, { title: string | null; content: Record<string, unknown> }>;
}

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
        title: null,
        content: DEFAULT_ABOUT.parcours,
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
  try {
    const response = await fetch(`${API_BASE_URL}/api/services`, { cache: "no-store" });

    if (!response.ok) {
      return fallbackServices;
    }

    const data = (await response.json()) as ServicesResponse;
    return Array.isArray(data.items) ? data.items : fallbackServices;
  } catch {
    return fallbackServices;
  }
}

export async function fetchPage(slug: string): Promise<PageResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pages/${slug}`, { cache: "no-store" });

    if (!response.ok) {
      return FALLBACK_PAGES[slug] ?? FALLBACK_PAGES.home;
    }

    return (await response.json()) as PageResponse;
  } catch {
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

export function getImageUrl(path?: string | null): string | null {
  if (!path) {
    return null;
  }
  if (path.startsWith("http")) {
    return path;
  }
  if (path.startsWith("/images/default/")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}

export function mapPageDetail(page: PageDetail): PageResponse {
  const sections: PageResponse["sections"] = {};
  page.sections.forEach((section) => {
    sections[section.key] = {
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
};
