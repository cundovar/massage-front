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
  images: string[];
  bulletsTitle?: string;
  bullets: string[];
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