export interface BlockDefinition {
  type: string;
  label: string;
  description: string;
  icon: string;
  category: string;
  defaultContent: Record<string, unknown>;
  fields: FieldDefinition[];
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "array";
  placeholder?: string;
  arrayItemType?: "text" | "textarea" | "image" | "object";
  objectFields?: FieldDefinition[];
}

export const BLOCK_CATEGORIES = [
  { id: "header", label: "En-tete", icon: "📌" },
  { id: "content", label: "Contenu", icon: "📝" },
  { id: "services", label: "Services & Tarifs", icon: "💰" },
  { id: "about", label: "A propos", icon: "👤" },
  { id: "contact", label: "Contact", icon: "📍" },
  { id: "cta", label: "Appel a l'action", icon: "📞" },
] as const;

export const BLOCK_CATALOG: BlockDefinition[] = [
  {
    type: "hero-home",
    label: "Hero Accueil (avec slides)",
    description: "Hero principal avec titre du site et diaporama",
    icon: "🏠",
    category: "header",
    defaultContent: {
      siteTitle: "Helene - Massages & Ayurveda",
      slides: [
        {
          image: "",
          title: "Une pause pour vous recentrer",
          subtitle: "Massages ayurvediques - Kobido - Reflexologie",
        },
      ],
    },
    fields: [
      { key: "siteTitle", label: "Titre du site", type: "text", placeholder: "Les Massages d'Helene" },
      {
        key: "slides",
        label: "Slides",
        type: "array",
        arrayItemType: "object",
        objectFields: [
          { key: "image", label: "Image de fond", type: "image" },
          { key: "title", label: "Titre du slide", type: "text" },
          { key: "subtitle", label: "Sous-titre", type: "text" },
        ],
      },
    ],
  },
  {
    type: "hero",
    label: "Banniere simple",
    description: "Grande image avec titre et sous-titre centre",
    icon: "🖼️",
    category: "header",
    defaultContent: {
      title: "",
      subtitle: "",
      image: null,
    },
    fields: [
      { key: "image", label: "Image de fond", type: "image" },
      { key: "title", label: "Titre principal", type: "text", placeholder: "Bienvenue" },
      { key: "subtitle", label: "Sous-titre", type: "text", placeholder: "Massage & Bien-etre" },
    ],
  },
  {
    type: "presentation",
    label: "Texte + Image",
    description: "Bloc de presentation avec image, texte et citation",
    icon: "✨",
    category: "content",
    defaultContent: {
      title: "",
      paragraphs: [""],
      quote: "",
      image: null,
    },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "image", label: "Image", type: "image" },
      { key: "paragraphs", label: "Paragraphes", type: "array", arrayItemType: "textarea" },
      { key: "quote", label: "Citation (optionnel)", type: "textarea" },
    ],
  },
  {
    type: "approche",
    label: "Points cles",
    description: "Liste de points forts avec images",
    icon: "📋",
    category: "content",
    defaultContent: {
      title: "",
      bulletsTitle: "",
      bullets: [""],
      images: [],
      image: null,
      quote: "",
    },
    fields: [
      { key: "bulletsTitle", label: "Titre de la liste", type: "text", placeholder: "Ce qui guide mes mains :" },
      { key: "bullets", label: "Points", type: "array", arrayItemType: "text" },
      { key: "images", label: "Images (grille)", type: "array", arrayItemType: "image" },
      { key: "quote", label: "Conclusion", type: "textarea" },
    ],
  },
  {
    type: "quote",
    label: "Citation",
    description: "Citation mise en avant",
    icon: "💬",
    category: "content",
    defaultContent: {
      text: "",
      author: "",
    },
    fields: [
      { key: "text", label: "Citation", type: "textarea" },
      { key: "author", label: "Auteur (optionnel)", type: "text" },
    ],
  },
  {
    type: "text",
    label: "Texte simple",
    description: "Bloc de texte avec titre optionnel",
    icon: "📄",
    category: "content",
    defaultContent: {
      title: "",
      paragraphs: [""],
      image: null,
    },
    fields: [
      { key: "title", label: "Titre (optionnel)", type: "text" },
      { key: "paragraphs", label: "Paragraphes", type: "array", arrayItemType: "textarea" },
      { key: "image", label: "Image (optionnel)", type: "image" },
    ],
  },
  {
    type: "image",
    label: "Image seule",
    description: "Image avec legende optionnelle",
    icon: "🖼️",
    category: "content",
    defaultContent: {
      image: null,
      alt: "",
      caption: "",
    },
    fields: [
      { key: "image", label: "Image", type: "image" },
      { key: "alt", label: "Texte alternatif", type: "text" },
      { key: "caption", label: "Legende (optionnel)", type: "text" },
    ],
  },
  {
    type: "gallery",
    label: "Galerie photos",
    description: "Grille d'images",
    icon: "📸",
    category: "content",
    defaultContent: {
      title: "",
      images: [],
    },
    fields: [
      { key: "title", label: "Titre (optionnel)", type: "text" },
      { key: "images", label: "Images", type: "array", arrayItemType: "image" },
    ],
  },
  {
    type: "tarifs",
    label: "Carte de tarifs",
    description: "Liste d'offres avec prix",
    icon: "💰",
    category: "services",
    defaultContent: {
      title: "Tarifs",
      subtitle: "",
      offers: [{ title: "", description: "", prices: [""] }],
    },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "subtitle", label: "Sous-titre", type: "text" },
      {
        key: "offers",
        label: "Offres",
        type: "array",
        arrayItemType: "object",
        objectFields: [
          { key: "title", label: "Nom du soin", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "prices", label: "Prix (ex: 1h · 80EUR)", type: "array", arrayItemType: "text" },
        ],
      },
    ],
  },
  {
    type: "entreprise",
    label: "Offre entreprise",
    description: "Presentation des services B2B",
    icon: "🏢",
    category: "services",
    defaultContent: {
      title: "",
      subtitle: "",
      teamTitle: "Pour vos equipes",
      teamBenefits: [""],
      companyTitle: "Pour votre entreprise",
      companyBenefits: [""],
      characteristics: [""],
      quote: "",
    },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "subtitle", label: "Sous-titre", type: "text" },
      { key: "teamTitle", label: "Titre equipes", type: "text" },
      { key: "teamBenefits", label: "Avantages equipes", type: "array", arrayItemType: "text" },
      { key: "companyTitle", label: "Titre entreprise", type: "text" },
      { key: "companyBenefits", label: "Avantages entreprise", type: "array", arrayItemType: "text" },
      { key: "characteristics", label: "Caracteristiques (4 max)", type: "array", arrayItemType: "text" },
      { key: "quote", label: "Citation", type: "textarea" },
    ],
  },
  {
    type: "parcours",
    label: "Parcours",
    description: "Photo + texte de presentation personnelle",
    icon: "👤",
    category: "about",
    defaultContent: {
      image: null,
      paragraphs: [""],
    },
    fields: [
      { key: "image", label: "Photo", type: "image" },
      { key: "paragraphs", label: "Texte", type: "array", arrayItemType: "textarea" },
    ],
  },
  {
    type: "formations",
    label: "Formations",
    description: "Liste de certifications avec annees",
    icon: "🎓",
    category: "about",
    defaultContent: {
      images: [],
      items: [{ year: "", title: "" }],
    },
    fields: [
      { key: "images", label: "Logos/Certificats", type: "array", arrayItemType: "image" },
      {
        key: "items",
        label: "Formations",
        type: "array",
        arrayItemType: "object",
        objectFields: [
          { key: "year", label: "Annee", type: "text" },
          { key: "title", label: "Formation", type: "text" },
        ],
      },
    ],
  },
  {
    type: "philosophie",
    label: "Philosophie",
    description: "Citation ou valeurs",
    icon: "🧘",
    category: "about",
    defaultContent: {
      text: "",
      author: "",
    },
    fields: [{ key: "text", label: "Texte", type: "textarea" }],
  },
  {
    type: "contact-cta",
    label: "Bloc contact",
    description: "Appel a l'action avec bouton contact",
    icon: "📞",
    category: "cta",
    defaultContent: {
      title: "Pret(e) a vous offrir une pause bien-etre ?",
      subtitle: "Reservez votre seance et decouvrez les bienfaits d'un massage personnalise",
      buttonText: "Prendre rendez-vous",
    },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "subtitle", label: "Sous-titre", type: "text" },
      { key: "buttonText", label: "Texte du bouton", type: "text" },
    ],
  },
  {
    type: "contact-infos",
    label: "Infos pratiques",
    description: "Adresse, telephone, email et horaires",
    icon: "📍",
    category: "contact",
    defaultContent: {
      title: "Informations pratiques",
      address: {
        street: "",
        city: "",
      },
      phone: "",
      email: "",
      hours: [
        { days: "Lundi - Vendredi", hours: "10h - 20h" },
        { days: "Samedi", hours: "10h - 18h" },
      ],
    },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "address.street", label: "Adresse (rue)", type: "text", placeholder: "123 Rue du Bien-Etre" },
      { key: "address.city", label: "Ville", type: "text", placeholder: "75011 Paris" },
      { key: "phone", label: "Telephone", type: "text", placeholder: "06 12 34 56 78" },
      { key: "email", label: "Email", type: "text", placeholder: "contact@example.fr" },
      {
        key: "hours",
        label: "Horaires",
        type: "array",
        arrayItemType: "object",
        objectFields: [
          { key: "days", label: "Jours", type: "text" },
          { key: "hours", label: "Heures", type: "text" },
        ],
      },
    ],
  },
  {
    type: "google-map",
    label: "Carte Google Maps",
    description: "Carte interactive avec localisation",
    icon: "🗺️",
    category: "contact",
    defaultContent: {
      title: "",
      embedUrl: "",
    },
    fields: [
      { key: "title", label: "Titre (optionnel)", type: "text" },
      { key: "embedUrl", label: "URL d'integration Google Maps", type: "textarea", placeholder: "https://www.google.com/maps/embed?pb=..." },
    ],
  },
];

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return BLOCK_CATALOG.find((block) => block.type === type);
}

export function getBlocksByCategory(categoryId: string): BlockDefinition[] {
  return BLOCK_CATALOG.filter((block) => block.category === categoryId);
}
