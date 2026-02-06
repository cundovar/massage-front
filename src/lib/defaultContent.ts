import type { ServiceItem } from "@/types";

export const DEFAULT_HOME = {
  seo: {
    metaTitle: "Massage Ayurveda a Paris - Helene",
    metaDescription: "Massages ayurvediques, reflexologie plantaire, kobido et prenatal.",
  },
  hero: {
    siteTitle: "Helene - Massages & Ayurveda",
    slides: [
      {
        image: "/images/default/hero-1.jpg",
        title: "Une pause pour vous recentrer",
        subtitle: "Massages ayurvediques • Kobido • Reflexologie • Prenatal",
      },
      {
        image: "/images/default/hero-2.jpg",
        title: "Retrouvez votre equilibre",
        subtitle: "Reflexologie • Prenatal",
      },
      {
        image: "/images/default/hero-3.jpg",
        title: "Le visage retrouve sa lumiere",
        subtitle: "Kobido & rituels visage",
      },
    ],
  },
  presentation: {
    title: "Presentation",
    image: "/images/default/presentation.jpg",
    paragraphs: [
      "Je vous accueille dans un cadre calme et chaleureux.",
      "Chaque seance est adaptee a vos besoins du moment.",
    ],
  },
  approche: {
    title: "Approche",
    images: ["/images/default/approche.jpg"],
    bulletsTitle: "Ce qui guide mes mains :",
    bullets: [
      "Un entretien prealable.",
      "Une ecoute precise du corps.",
      "Une parenthese bienveillante.",
    ],
  },
};

export const DEFAULT_SOINS = {
  hero: {
    title: "Soins & Massages",
    image: "/images/default/soins-hero.jpg",
  },
  intro: {
    paragraphs: [
      "Chaque soin est pense comme un moment unique.",
      "Un entretien prealable permet de cibler vos attentes.",
    ],
  },
};

export const DEFAULT_ABOUT = {
  hero: {
    title: "A propos",
    image: "/images/default/about-hero.jpg",
  },
  parcours: {
    image: "/images/default/helene-portrait.jpg",
    paragraphs: [
      "Passionnee par le bien-etre, je pratique des massages inspires de l Ayurveda.",
      "Mon objectif: vous aider a retrouver apaisement et energie.",
    ],
  },
  formations: {
    images: ["/images/default/certif-1.jpg", "/images/default/certif-2.jpg"],
    items: [
      { year: "2020", title: "Certification Ayurveda" },
      { year: "2022", title: "Formation Kobido" },
    ],
  },
  philosophie: {
    quote: "Le massage est une conversation silencieuse.",
  },
};

export const DEFAULT_CONTACT = {
  hero: {
    title: "Contact",
    image: "/images/default/contact-hero.jpg",
  },
  infos: {
    address: { street: "123 Rue du Bien-Etre", city: "75011 Paris" },
    phone: "06 12 34 56 78",
    email: "contact@helene-massage.fr",
    hours: [
      { days: "Lundi - Vendredi", hours: "10h - 20h" },
      { days: "Samedi", hours: "10h - 18h" },
    ],
  },
};

export const DEFAULT_MENTIONS = {
  content: {
    title: "Mentions legales",
    sections: [
      { title: "Editeur", content: "Helene [Nom]" },
      { title: "RGPD", content: "Conformement au RGPD, vous pouvez demander la suppression de vos donnees." },
    ],
  },
};

export const fallbackServices: ServiceItem[] = [
  {
    id: 1,
    category: "Ayurveda",
    name: "Massage ayurvedique a l'huile chaude",
    description: "Apaisant et ancrant.",
    prices: [
      { label: "1h", price: 80 },
      { label: "1h30", price: 100 },
    ],
    highlight: true,
    sortOrder: 0,
  },
  {
    id: 2,
    category: "Kobido",
    name: "Massage du visage Kobido",
    description: "Tradition japonaise pour detendre et tonifier le visage.",
    prices: [{ label: "Seance", price: 70 }],
    highlight: false,
    sortOrder: 1,
  },
];
