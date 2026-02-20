import type { Meta, StoryObj } from "@storybook/react";
import { SectionRenderer } from "./SectionRenderer";
import type { ServiceItem } from "@/types/service";

const demoServices: ServiceItem[] = [
  {
    id: 1,
    category: "Ayurveda",
    name: "Massage Abhyanga",
    description: "Massage enveloppant pour relacher les tensions.",
    prices: [{ label: "1h", price: 80 }],
    highlight: true,
    sortOrder: 0,
  },
  {
    id: 2,
    category: "Kobido",
    name: "Kobido visage",
    description: "Soin du visage drainant et tonifiant.",
    prices: [{ label: "45min", price: 70 }],
    highlight: false,
    sortOrder: 1,
  },
  {
    id: 3,
    category: "Reflexologie",
    name: "Reflexologie plantaire",
    description: "Travail des zones reflexes pour equilibrer le corps.",
    prices: [{ label: "1h", price: 75 }],
    highlight: false,
    sortOrder: 2,
  },
];

const meta: Meta<typeof SectionRenderer> = {
  title: "Front/Dynamic/SectionRenderer",
  component: SectionRenderer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const HeroHome: Story = {
  args: {
    sections: [
      {
        sectionKey: "hero-home",
        type: "hero-home",
        title: null,
        sortOrder: 0,
        content: {
          siteTitle: "Les Massages d'Helene",
          slides: [
            {
              title: "Une pause pour vous recentrer",
              subtitle: "Massages ayurvediques, kobido, reflexologie",
              image: "",
            },
          ],
        },
      },
    ],
  },
};

export const CoreContentBlocks: Story = {
  args: {
    sections: [
      {
        sectionKey: "hero",
        type: "hero",
        title: null,
        sortOrder: 0,
        content: {
          title: "Bienvenue",
          subtitle: "Massages & bien-etre",
          image: null,
        },
      },
      {
        sectionKey: "presentation",
        type: "presentation",
        title: "Presentation",
        sortOrder: 1,
        content: {
          title: "Ma pratique",
          paragraphs: [
            "Je propose des soins adaptes a chaque personne.",
            "Chaque seance commence par un temps d'ecoute.",
          ],
          quote: "Prendre soin de soi est un acte essentiel.",
          image: null,
        },
      },
      {
        sectionKey: "approche",
        type: "approche",
        title: "Approche",
        sortOrder: 2,
        content: {
          bulletsTitle: "Ce qui guide mes mains :",
          bullets: ["Ecoute", "Presence", "Precision"],
          images: [],
          quote: "Un massage est un dialogue silencieux.",
        },
      },
      {
        sectionKey: "quote",
        type: "quote",
        title: null,
        sortOrder: 3,
        content: {
          text: "Le corps retrouve son souffle quand l'esprit ralentit.",
          author: "Helene",
        },
      },
      {
        sectionKey: "text",
        type: "text",
        title: "Texte",
        sortOrder: 4,
        content: {
          title: "Infos",
          paragraphs: ["Les soins sont disponibles sur rendez-vous."],
          image: null,
        },
      },
      {
        sectionKey: "gallery",
        type: "gallery",
        title: "Galerie",
        sortOrder: 5,
        content: {
          title: "Ambiance du cabinet",
          images: [],
        },
      },
      {
        sectionKey: "fallback",
        type: "unknown-type",
        title: "Fallback",
        sortOrder: 6,
        content: {
          title: "Type inconnu",
          paragraphs: ["Ce bloc utilise GenericTextSection."],
        },
      },
    ],
  },
};

export const ServicesAndEntreprise: Story = {
  args: {
    services: demoServices,
    sections: [
      {
        sectionKey: "services-preview",
        type: "services-preview",
        title: null,
        sortOrder: 0,
        content: {},
      },
      {
        sectionKey: "tarifs",
        type: "tarifs",
        title: "Tarifs",
        sortOrder: 1,
        content: {
          title: "Tarifs",
          subtitle: "Choisissez la duree qui vous convient",
          offers: [
            {
              title: "Abhyanga",
              description: "Soin global du corps",
              prices: ["1h · 80EUR", "1h30 · 110EUR"],
            },
            {
              title: "Kobido",
              description: "Soin visage revitalisant",
              prices: ["45min · 70EUR"],
            },
          ],
        },
      },
      {
        sectionKey: "entreprise",
        type: "entreprise",
        title: "Entreprise",
        sortOrder: 2,
        content: {
          title: "Massage amma assis en entreprise",
          subtitle: "Interventions sur site pour vos equipes",
          teamTitle: "Pour vos equipes",
          teamBenefits: ["Moins de stress", "Plus de concentration"],
          companyTitle: "Pour votre entreprise",
          companyBenefits: ["QVT", "Performance durable"],
          characteristics: ["10-20 min", "Sans huile", "Sur chaise ergonomique", "Dans vos locaux"],
          quote: "Un format court, efficace et apprecie de tous.",
        },
      },
    ],
  },
};

export const AboutAndContactBlocks: Story = {
  args: {
    sections: [
      {
        sectionKey: "parcours",
        type: "parcours",
        title: "Parcours",
        sortOrder: 0,
        content: {
          image: null,
          paragraphs: [
            "Apres plusieurs annees en cabinet, j'ai developpe une approche personnelle.",
            "Je combine precision technique et ecoute sensible.",
          ],
        },
      },
      {
        sectionKey: "formations",
        type: "formations",
        title: "Formations",
        sortOrder: 1,
        content: {
          images: [],
          items: [
            { year: "2022", title: "Kobido traditionnel" },
            { year: "2024", title: "Reflexologie plantaire" },
          ],
        },
      },
      {
        sectionKey: "philosophie",
        type: "philosophie",
        title: "Philosophie",
        sortOrder: 2,
        content: {
          text: "Prendre soin du corps, c'est prendre soin de l'ensemble de soi.",
          author: "Helene",
        },
      },
      {
        sectionKey: "contact-infos",
        type: "contact-infos",
        title: "Infos contact",
        sortOrder: 3,
        content: {
          title: "Informations pratiques",
          address: {
            street: "10 rue du calme",
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
        sectionKey: "google-map",
        type: "google-map",
        title: "Carte",
        sortOrder: 4,
        content: {
          title: "Plan d'acces",
          embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999457739055!2d2.3509873!3d48.856614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fdf2e4b5f3b%3A0x2b6f8e3c4a5b2f1b!2sParis!5e0!3m2!1sfr!2sfr!4v1710000000000",
        },
      },
      {
        sectionKey: "contact-cta",
        type: "contact-cta",
        title: "CTA",
        sortOrder: 5,
        content: {
          title: "Pret(e) a reserver ?",
          subtitle: "Contactez-moi pour choisir votre soin.",
          buttonText: "Prendre rendez-vous",
        },
      },
    ],
  },
};

export const ImageBlockOnly: Story = {
  args: {
    sections: [
      {
        sectionKey: "image",
        type: "image",
        title: "Image",
        sortOrder: 0,
        content: {
          image: "https://massln.varascundo.com/images/default/hero.jpg",
          alt: "Image de demonstration",
          caption: "Exemple de section image",
        },
      },
    ],
  },
};
