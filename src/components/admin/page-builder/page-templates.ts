import type { PageSection } from "@/lib/api-admin";

type SectionTemplate = Omit<PageSection, "updatedAt">;

interface PageTemplate {
  slug: string;
  sections: SectionTemplate[];
}

const PAGE_TEMPLATES: PageTemplate[] = [
  {
    slug: "home",
    sections: [
      {
        key: "hero-home",
        type: "hero-home",
        title: null,
        sortOrder: 0,
        content: {
          siteTitle: "Helene - Massages & Ayurveda",
          slides: [
            {
              image: "",
              title: "Une pause pour vous recentrer",
              subtitle: "Massages ayurvediques - Kobido - Reflexologie - Prenatal",
            },
          ],
        },
      },
      {
        key: "presentation",
        type: "presentation",
        title: "Presentation",
        sortOrder: 1,
        content: {
          title: "Presentation",
          image: "",
          paragraphs: [
            "Je vous accueille dans un cadre calme et chaleureux.",
            "Chaque seance est adaptee a vos besoins du moment.",
          ],
          quote: "Je m'adresse a tous ceux qui souhaitent prendre soin d'eux-memes et s'offrir une pause bienveillante.",
        },
      },
      {
        key: "approche",
        type: "approche",
        title: "Approche",
        sortOrder: 2,
        content: {
          title: "Approche",
          images: [],
          bulletsTitle: "Ce qui guide mes mains :",
          bullets: [
            "Un entretien prealable.",
            "Une ecoute precise du corps.",
            "Une parenthese bienveillante.",
          ],
          quote: "Chaque soin est pense comme une pause pour vous recentrer et vous alleger.",
        },
      },
    ],
  },
  {
    slug: "contact",
    sections: [
      {
        key: "hero",
        type: "hero-compact",
        title: null,
        sortOrder: 0,
        content: {
          title: "Contact",
          subtitle: "Prenez rendez-vous pour votre seance",
          image: "",
        },
      },
      {
        key: "infos",
        type: "contact-info",
        title: "Informations pratiques",
        sortOrder: 1,
        content: {
          address: {
            street: "123 Rue du Bien-Etre",
            city: "75011 Paris",
          },
          phone: "06 12 34 56 78",
          email: "contact@helene-massage.fr",
          hours: [
            { days: "Lundi - Vendredi", hours: "10h - 20h" },
            { days: "Samedi", hours: "10h - 18h" },
          ],
        },
      },
      {
        key: "form",
        type: "contact-form",
        title: null,
        sortOrder: 2,
        content: {},
      },
      {
        key: "map",
        type: "google-map",
        title: "Localisation",
        sortOrder: 3,
        content: {
          title: "Me trouver",
          embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999457739055!2d2.3509873!3d48.856614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fdf2e4b5f3b%3A0x2b6f8e3c4a5b2f1b!2sParis!5e0!3m2!1sfr!2sfr!4v1710000000000",
        },
      },
      {
        key: "contact-cta",
        type: "contact-cta",
        title: null,
        sortOrder: 4,
        content: {
          title: "Pret(e) a vous offrir une pause bien-etre ?",
          subtitle: "Reservez votre seance et decouvrez les bienfaits d'un massage personnalise",
          buttonText: "Prendre rendez-vous",
        },
      },
    ],
  },
  {
    slug: "about",
    sections: [
      {
        key: "hero",
        type: "hero-compact",
        title: null,
        sortOrder: 0,
        content: {
          title: "A propos",
          subtitle: "Decouvrez mon parcours",
          image: "",
        },
      },
      {
        key: "parcours",
        type: "parcours",
        title: "Mon parcours",
        sortOrder: 1,
        content: {
          image: "",
          paragraphs: [
            "Passionnee par le bien-etre, je pratique des massages inspires de l'Ayurveda.",
            "Mon objectif : vous aider a retrouver apaisement et energie.",
          ],
        },
      },
      {
        key: "formations",
        type: "formations",
        title: "Formations",
        sortOrder: 2,
        content: {
          images: [],
          items: [
            { year: "2020", title: "Certification Ayurveda" },
            { year: "2022", title: "Formation Kobido" },
          ],
        },
      },
      {
        key: "philosophie",
        type: "philosophie",
        title: null,
        sortOrder: 3,
        content: {
          text: "Le massage est une conversation silencieuse.",
        },
      },
    ],
  },
  {
    slug: "soins",
    sections: [
      {
        key: "hero",
        type: "hero-compact",
        title: null,
        sortOrder: 0,
        content: {
          title: "Soins & Massages",
          subtitle: "Decouvrez ma carte de soins",
          image: "",
        },
      },
      {
        key: "intro",
        type: "text",
        title: null,
        sortOrder: 1,
        content: {
          paragraphs: [
            "Chaque soin est pense comme un moment unique.",
            "Un entretien prealable permet de cibler vos attentes.",
          ],
        },
      },
      {
        key: "tarifs",
        type: "service-selector",
        title: "Carte & tarifs",
        sortOrder: 2,
        content: {
          title: "Carte & tarifs",
          subtitle: "Une selection de soins ayurvediques, reflexologie plantaire, Kobido et massage prenatal.",
          offers: [
            {
              title: "Ayurveda",
              description: "Les massages ayurvediques apaisent le corps et l'esprit.",
              prices: ["Abhyanga - 1h - 80 EUR", "Abhyanga - 1h30 - 100 EUR"],
            },
            {
              title: "Kobido",
              description: "Massage du visage de tradition japonaise.",
              prices: ["Seance decouverte - 70 EUR"],
            },
          ],
        },
      },
    ],
  },
  {
    slug: "entreprise",
    sections: [
      {
        key: "hero",
        type: "hero-compact",
        title: null,
        sortOrder: 0,
        content: {
          title: "Massage en entreprise",
          subtitle: "Bien-etre au travail pour vos equipes",
          image: "",
        },
      },
      {
        key: "benefits",
        type: "benefits-grid",
        title: null,
        sortOrder: 1,
        content: {
          leftTitle: "Pour vos equipes",
          leftSubtitle: "Avantages",
          leftItems: [
            "Moins de stress",
            "Plus d'energie et de concentration",
            "Moins de tensions musculaires",
            "Plus de motivation",
          ],
          rightTitle: "Pour votre entreprise",
          rightSubtitle: "Benefices",
          rightItems: [
            "Qualite de Vie au Travail renforcee",
            "Collaborateurs plus performants et engages",
            "Image positive et responsable",
          ],
          tags: ["10-20 min", "Dans vos locaux", "Sans huile", "Chaise ergo"],
          quote: "Le massage Amma assis : un investissement simple et rentable pour le bien-etre collectif.",
        },
      },
      {
        key: "cta",
        type: "contact-cta",
        title: null,
        sortOrder: 2,
        content: {
          title: "Pret(e) a vous offrir une pause bien-etre ?",
          subtitle: "Reservez votre seance et decouvrez les bienfaits d'un massage personnalise",
          buttonText: "Prendre rendez-vous",
        },
      },
    ],
  },
];

export function getPageTemplate(slug: string): SectionTemplate[] | null {
  const template = PAGE_TEMPLATES.find((t) => t.slug === slug);
  return template?.sections ?? null;
}

export function hasPageTemplate(slug: string): boolean {
  return PAGE_TEMPLATES.some((t) => t.slug === slug);
}
