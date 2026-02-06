export interface SlideContent {
  image: string;
  title?: string;
  subtitle?: string;
}

export interface HeroContent {
  siteTitle?: string;
  slides: SlideContent[];
}

export interface PresentationContent {
  image?: string;
  paragraphs: string[];
}

export interface ApprocheContent {
  image?: string;
  images?: string[];
  bulletsTitle?: string;
  bullets: string[];
}

export interface SoinsHeroContent {
  image?: string;
  title: string;
}

export interface SoinCategoryContent {
  image?: string;
  title: string;
  description: string;
}

export interface AboutHeroContent {
  image?: string;
  title: string;
}

export interface ParcoursContent {
  image?: string;
  paragraphs: string[];
}

export interface FormationsContent {
  images?: string[];
  items: { year: string; title: string }[];
}

export interface ContactHeroContent {
  image?: string;
  title: string;
}

export interface ContactInfosContent {
  address: { street: string; city: string };
  phone: string;
  email: string;
  hours?: { days: string; hours: string }[];
}

export interface PageSection {
  key: string;
  title: string | null;
  content: Record<string, unknown>;
  sortOrder: number;
  updatedAt: string;
}

export interface PageDetail {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  sections: PageSection[];
  updatedAt: string;
}

export interface MediaItem {
  id: number;
  filename: string;
  path: string;
  originalName: string;
  alt: string | null;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  uploadedAt: string;
}
