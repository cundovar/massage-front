// types/sections.ts - Types pour le contenu des sections

// ===== HERO =====
export interface HeroSlide {
  title: string;
  subtitle?: string;
  image: string;
}

export interface HeroContent {
  siteTitle?: string;
  slides: HeroSlide[];
}

// ===== PRESENTATION =====
export interface PresentationContent {
  title: string;
  paragraphs: string[];
  quote?: string;
  image?: string;
}

// ===== APPROCHE =====
export interface ApprocheContent {
  title?: string;
  images?: string[];
  image?: string;
  bulletsTitle?: string;
  bullets?: string[];
  quote?: string;
}

// ===== TARIFS =====
export interface TarifOffer {
  title: string;
  description: string;
  prices: string[]; // Ex: ["1h · 80€", "1h30 · 100€"]
}

export interface TarifsContent {
  title: string;
  subtitle?: string;
  bookingLink?: string;
  bookingLinkNewTab?: boolean | "true" | "false";
  offers: TarifOffer[];
}

// ===== CONTACT INFOS =====
export interface ContactInfosContent {
  address: {
    street: string;
    city: string;
  };
  phone: string;
  email: string;
  hours?: Array<{
    days: string;
    hours: string;
  }>;
}

// ===== ABOUT =====
export interface AboutHeroContent {
  title: string;
  image?: string;
}

export interface ParcoursContent {
  image?: string;
  paragraphs: string[];
}

export interface FormationsContent {
  images?: string[];
  items?: Array<{
    year: string;
    title: string;
  }>;
}

// ===== SOINS =====
export interface SoinsHeroContent {
  title: string;
  image?: string;
}

export interface SoinCategoryContent {
  name: string;
  description: string;
  services: Array<{
    name: string;
    duration: string;
    price: number;
  }>;
}

// ===== CONTACT =====
export interface ContactHeroContent {
  title: string;
  image?: string;
}

// ===== ENTREPRISE =====
export interface EntrepriseContent {
  title: string;
  subtitle?: string;
  teamTitle?: string;
  teamBenefits: string[];
  companyTitle?: string;
  companyBenefits: string[];
  characteristics: string[];
  quote?: string;
}

// ===== SECTION GÉNÉRIQUE =====
export interface PageSection<T = Record<string, unknown>> {
  key: string;
  type?: string;
  title: string | null;
  content: T;
  sortOrder: number;
}

// ===== PAGE =====
export interface PageDetail {
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  sections: Record<string, PageSection>;
}
