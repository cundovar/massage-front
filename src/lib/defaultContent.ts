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
    quote: "Je m'adresse a tous ceux qui souhaitent prendre soin d'eux-memes et s'offrir une pause bienveillante.",
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
    quote: "Chaque soin est pense comme une pause pour vous recentrer et vous alleger.",
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
  tarifs: {
    title: "Carte & tarifs",
    subtitle: "Une selection de soins ayurvediques, reflexologie plantaire, Kobido et massage prenatal.",
    offers: [
      {
        title: "Ayurveda",
        description:
          "Les massages ayurvediques apaisent le corps et l'esprit, redonnent de l'ancrage et relancent la flamme interieure.",
        prices: ["Abhyanga · 1h · 80 EUR", "Abhyanga · 1h30 · 100 EUR"],
      },
      {
        title: "Bol Kansu",
        description:
          "Le bol aux trois alliages est frotte contre la plante des pieds pour apaiser les esprits agites et reequilibrer l'element feu.",
        prices: ["Massage des pieds · 1h · 60 EUR"],
      },
      {
        title: "Padhabyanga",
        description: "Massage des jambes complete d'une reflexologie plantaire ou d'un bol Kansu pour delier les tensions.",
        prices: ["1h · 70 EUR"],
      },
      {
        title: "Massage prenatal",
        description:
          "Un accompagnement en douceur pendant la grossesse. Le soin est adapte a chaque etape selon vos besoins.",
        prices: ["Tarif communique lors de l'entretien prealable."],
      },
      {
        title: "Reflexologie plantaire",
        description: "En regulant les differents systemes du corps par le pied, cette pratique aide a reequilibrer le moment.",
        prices: ["Seance decouverte · 45 min · 50 EUR"],
      },
      {
        title: "Kobido",
        description:
          "Massage du visage de tradition japonaise. Il fait circuler la lymphe et redonne du tonus pour un visage lumineux.",
        prices: ["Seance decouverte · 70 EUR"],
      },
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

export const DEFAULT_ENTREPRISE = {
  entreprise: {
    title: "Massage Amma en entreprise",
    subtitle: "Massage Amma assis : rapide, efficace, sans huile, sur chaise ergonomique.",
    teamTitle: "Pour vos equipes",
    teamBenefits: [
      "Moins de stress",
      "Plus d'energie et de concentration",
      "Moins de tensions musculaires",
      "Plus de motivation",
    ],
    companyTitle: "Pour votre entreprise",
    companyBenefits: [
      "Qualite de Vie au Travail renforcee",
      "Collaborateurs plus performants et engages",
      "Image positive et responsable",
    ],
    characteristics: ["10-20 min", "Dans vos locaux", "Sans huile", "Chaise ergo"],
    quote: "Le massage Amma assis : un investissement simple et rentable pour le bien-etre collectif.",
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
