import { ANIMATION_OPTIONS } from "@/lib/heroAnimations";

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
  type: "text" | "textarea" | "image" | "array" | "page-link" | "select" | "color" | "toggle";
  placeholder?: string;
  arrayItemType?: "text" | "textarea" | "image" | "object";
  objectFields?: FieldDefinition[];
  options?: Array<{ value: string; label: string }>;
}

export const BLOCK_CATEGORIES = [
  { id: "header", label: "En-tete", icon: "📌" },
  { id: "content", label: "Contenu", icon: "📝" },
  { id: "layout", label: "Mise en page", icon: "↕️" },
  { id: "services", label: "Services & Tarifs", icon: "💰" },
  { id: "about", label: "A propos", icon: "👤" },
  { id: "contact", label: "Contact", icon: "📍" },
  { id: "cta", label: "Appel a l'action", icon: "📞" },
] as const;

export const BLOCK_CATALOG: BlockDefinition[] = [
  {
    type: "hero-home",
    label: "Bannière d’accueil avec photos",
    description: "Présente le site dès l’arrivée avec un titre et plusieurs photos défilantes",
    icon: "🏠",
    category: "header",
    defaultContent: {
      siteTitle: "Helene - Massages & Ayurveda",
      siteSubtitle: "",
      buttonText: "",
      buttonLink: "",
      backgroundType: "image",
      animation: "none",
      entryAnimation: "none",
      entryAnimationDelay: 0,
      gradientStart: "#FFCE67",
      gradientEnd: "#F67E54",
      textColor: "#F5F5F4",
      backgroundBlur: "0",
      overlayOpacity: "45",
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
      { key: "siteSubtitle", label: "Sous-titre du site", type: "text", placeholder: "Massages, rituels et bien-etre" },
      { key: "buttonText", label: "Texte du bouton (optionnel)", type: "text", placeholder: "Decouvrir la carte" },
      { key: "buttonLink", label: "Lien du bouton (optionnel)", type: "page-link", placeholder: "/soins" },
      {
        key: "backgroundType",
        label: "Type de fond",
        type: "select",
        options: [
          { value: "image", label: "Photo (slides)" },
          { value: "gradient", label: "Gradient" },
          { value: "transparent", label: "Transparent" },
        ],
      },
      {
        key: "animation",
        label: "Animation de fond",
        type: "select",
        options: ANIMATION_OPTIONS,
      },
      {
        key: "entryAnimation",
        label: "Animation d'entrée",
        type: "select",
        options: [
          { value: "none", label: "Aucune" },
          { value: "fade-up", label: "Fondu + montée" },
          { value: "fade-down", label: "Fondu + descente" },
          { value: "slide-left", label: "Glissement gauche" },
          { value: "slide-right", label: "Glissement droite" },
          { value: "zoom-in", label: "Zoom entrant" },
          { value: "zoom-out", label: "Zoom sortant" },
          { value: "bounce", label: "Rebond" },
        ],
      },
      {
        key: "entryAnimationDelay",
        label: "Délai de l'animation (secondes)",
        type: "select",
        options: [
          { value: "0", label: "Immédiat" },
          { value: "0.3", label: "0,3 seconde" },
          { value: "0.6", label: "0,6 seconde" },
          { value: "1", label: "1 seconde" },
        ],
      },
      { key: "gradientStart", label: "Gradient debut", type: "color" },
      { key: "gradientEnd", label: "Gradient fin", type: "color" },
      { key: "textColor", label: "Couleur du texte", type: "color" },
      {
        key: "backgroundBlur",
        label: "Flou du fond",
        type: "select",
        options: [
          { value: "0", label: "Aucun" },
          { value: "2", label: "Leger" },
          { value: "4", label: "Moyen" },
          { value: "6", label: "Fort" },
        ],
      },
      {
        key: "overlayOpacity",
        label: "Opacite de l'overlay",
        type: "select",
        options: [
          { value: "20", label: "20%" },
          { value: "35", label: "35%" },
          { value: "45", label: "45%" },
          { value: "60", label: "60%" },
        ],
      },
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
    type: "neutral",
    label: "Section personnalisée",
    description: "Ajoute un contenu libre avec un titre, du texte et éventuellement un bouton",
    icon: "▫️",
    category: "content",
    defaultContent: {
      eyebrow: "",
      title: "",
      subtitle: "",
      paragraphs: [""],
      buttonText: "",
      buttonLink: "",
      align: "left",
      width: "normal",
      background: "transparent",
      spacing: "normal",
    },
    fields: [
      { key: "eyebrow", label: "Petit libelle", type: "text", placeholder: "A retenir" },
      { key: "title", label: "Titre", type: "text", placeholder: "Titre de section" },
      { key: "subtitle", label: "Sous-titre", type: "textarea", placeholder: "Phrase courte optionnelle" },
      { key: "paragraphs", label: "Paragraphes", type: "array", arrayItemType: "textarea" },
      { key: "buttonText", label: "Texte du bouton", type: "text", placeholder: "En savoir plus" },
      { key: "buttonLink", label: "Lien du bouton", type: "page-link", placeholder: "/contact" },
      {
        key: "align",
        label: "Alignement",
        type: "select",
        options: [
          { value: "left", label: "Gauche" },
          { value: "center", label: "Centre" },
        ],
      },
      {
        key: "width",
        label: "Largeur",
        type: "select",
        options: [
          { value: "narrow", label: "Etroite" },
          { value: "normal", label: "Normale" },
          { value: "wide", label: "Large" },
        ],
      },
      {
        key: "background",
        label: "Fond",
        type: "select",
        options: [
          { value: "transparent", label: "Transparent" },
          { value: "soft", label: "Leger" },
          { value: "card", label: "Carte" },
        ],
      },
      {
        key: "spacing",
        label: "Espacement",
        type: "select",
        options: [
          { value: "compact", label: "Compact" },
          { value: "normal", label: "Normal" },
          { value: "large", label: "Large" },
        ],
      },
    ],
  },
  {
    type: "spacer",
    label: "Espace entre les sections",
    description: "Ajoute un espace vertical entre deux sections",
    icon: "↕️",
    category: "layout",
    defaultContent: {
      size: "md",
    },
    fields: [
      {
        key: "size",
        label: "Hauteur",
        type: "select",
        options: [
          { value: "xs", label: "Tres petit" },
          { value: "sm", label: "Petit" },
          { value: "md", label: "Moyen" },
          { value: "lg", label: "Grand" },
          { value: "xl", label: "Tres grand" },
        ],
      },
    ],
  },
  {
    type: "hero",
    label: "Bannière de page",
    description: "Affiche une grande photo avec un titre et un sous-titre",
    icon: "🖼️",
    category: "header",
    defaultContent: {
      title: "",
      subtitle: "",
      image: null,
      backgroundType: "image",
      gradientStart: "#FFCE67",
      gradientEnd: "#F67E54",
      textColor: "#FFFFFF",
      backgroundBlur: "0",
      overlayOpacity: "45",
    },
    fields: [
      {
        key: "backgroundType",
        label: "Type de fond",
        type: "select",
        options: [
          { value: "image", label: "Photo" },
          { value: "gradient", label: "Gradient" },
          { value: "transparent", label: "Transparent" },
        ],
      },
      { key: "image", label: "Image de fond", type: "image" },
      { key: "gradientStart", label: "Gradient debut", type: "color" },
      { key: "gradientEnd", label: "Gradient fin", type: "color" },
      { key: "textColor", label: "Couleur du texte", type: "color" },
      {
        key: "backgroundBlur",
        label: "Flou du fond",
        type: "select",
        options: [
          { value: "0", label: "Aucun" },
          { value: "2", label: "Leger" },
          { value: "4", label: "Moyen" },
          { value: "6", label: "Fort" },
        ],
      },
      {
        key: "overlayOpacity",
        label: "Opacite de l'overlay",
        type: "select",
        options: [
          { value: "20", label: "20%" },
          { value: "35", label: "35%" },
          { value: "45", label: "45%" },
          { value: "60", label: "60%" },
        ],
      },
      { key: "title", label: "Titre principal", type: "text", placeholder: "Bienvenue" },
      { key: "subtitle", label: "Sous-titre", type: "text", placeholder: "Massage & Bien-etre" },
    ],
  },
  {
    type: "hero-compact",
    label: "Petite bannière de page",
    description: "Affiche une bannière plus courte pour les pages intérieures",
    icon: "🎯",
    category: "header",
    defaultContent: {
      title: "",
      subtitle: "",
      image: null,
      compact: true,
      backgroundType: "image",
      backgroundAnimation: "none",
      gradientStart: "#FFCE67",
      gradientEnd: "#F67E54",
      textColor: "#FFFFFF",
      backgroundBlur: "0",
      overlayOpacity: "35",
    },
    fields: [
      {
        key: "backgroundType",
        label: "Type de fond",
        type: "select",
        options: [
          { value: "image", label: "Photo" },
          { value: "gradient", label: "Gradient" },
          { value: "transparent", label: "Transparent" },
        ],
      },
      { key: "image", label: "Image de fond", type: "image" },
      {
        key: "backgroundAnimation",
        label: "Animation de fond",
        type: "select",
        options: ANIMATION_OPTIONS,
      },
      { key: "gradientStart", label: "Gradient debut", type: "color" },
      { key: "gradientEnd", label: "Gradient fin", type: "color" },
      { key: "textColor", label: "Couleur du texte", type: "color" },
      {
        key: "backgroundBlur",
        label: "Flou du fond",
        type: "select",
        options: [
          { value: "0", label: "Aucun" },
          { value: "2", label: "Leger" },
          { value: "4", label: "Moyen" },
          { value: "6", label: "Fort" },
        ],
      },
      {
        key: "overlayOpacity",
        label: "Opacite de l'overlay",
        type: "select",
        options: [
          { value: "20", label: "20%" },
          { value: "35", label: "35%" },
          { value: "45", label: "45%" },
          { value: "60", label: "60%" },
        ],
      },
      { key: "title", label: "Titre principal", type: "text", placeholder: "Titre de page" },
      { key: "subtitle", label: "Sous-titre", type: "text", placeholder: "Description optionnelle" },
    ],
  },
  {
    type: "presentation",
    label: "Présentation avec photo",
    description: "Présente une personne ou une activité avec une photo et du texte",
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
    label: "Points forts et approche",
    description: "Présente les points forts, la méthode et les valeurs de l’activité",
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
    label: "Citation mise en avant",
    description: "Met en valeur une phrase importante ou un témoignage",
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
    type: "google-reviews",
    label: "Témoignages clients",
    description: "Présente une note globale et des témoignages de clientes",
    icon: "⭐",
    category: "content",
    defaultContent: {
      eyebrow: "Avis Google",
      title: "Elles partagent leur expérience",
      subtitle: "Des moments de détente racontés par celles qui les ont vécus.",
      averageRating: "5",
      totalReviews: "24",
      googleUrl: "",
      buttonText: "Voir tous les avis Google",
      reviews: [
        {
          name: "Sophie M.",
          rating: "5",
          text: "Un véritable moment de lâcher-prise, dans une atmosphère douce et bienveillante.",
          date: "Il y a 2 mois",
        },
        {
          name: "Claire D.",
          rating: "5",
          text: "Une écoute attentive et un massage parfaitement adapté. Je suis ressortie profondément détendue.",
          date: "Il y a 3 mois",
        },
        {
          name: "Émilie R.",
          rating: "5",
          text: "Une parenthèse précieuse. Le lieu, les gestes et l'accueil invitent immédiatement au calme.",
          date: "Il y a 4 mois",
        },
      ],
    },
    fields: [
      { key: "eyebrow", label: "Petit titre", type: "text" },
      { key: "title", label: "Titre", type: "text" },
      { key: "subtitle", label: "Introduction", type: "textarea" },
      { key: "averageRating", label: "Note moyenne", type: "text", placeholder: "5" },
      { key: "totalReviews", label: "Nombre d'avis", type: "text", placeholder: "24" },
      { key: "googleUrl", label: "Lien vers la fiche Google", type: "text" },
      { key: "buttonText", label: "Texte du bouton", type: "text" },
      {
        key: "reviews",
        label: "Avis affichés",
        type: "array",
        arrayItemType: "object",
        objectFields: [
          { key: "name", label: "Nom", type: "text" },
          {
            key: "rating",
            label: "Note",
            type: "select",
            options: [
              { value: "5", label: "5 étoiles" },
              { value: "4", label: "4 étoiles" },
              { value: "3", label: "3 étoiles" },
              { value: "2", label: "2 étoiles" },
              { value: "1", label: "1 étoile" },
            ],
          },
          { key: "text", label: "Commentaire", type: "textarea" },
          { key: "date", label: "Date affichée", type: "text" },
        ],
      },
    ],
  },
  {
    type: "text",
    label: "Texte libre",
    description: "Ajoute un titre et un ou plusieurs paragraphes de texte",
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
    label: "Photo",
    description: "Ajoute une photo avec un texte alternatif et une légende facultative",
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
    label: "Galerie de photos",
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
    label: "Tarifs et prestations",
    description: "Présente les soins, leurs descriptions, leurs durées et leurs prix",
    icon: "💰",
    category: "services",
    defaultContent: {
      title: "Tarifs",
      subtitle: "",
      bookingLink: "/reservation",
      bookingLinkNewTab: false,
      offers: [{ title: "", description: "", prices: [""] }],
    },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "subtitle", label: "Sous-titre", type: "text" },
      { key: "bookingLink", label: "Lien du bouton Reserver (optionnel)", type: "page-link", placeholder: "/reservation" },
      { key: "bookingLinkNewTab", label: "Ouvrir en nouvel onglet", type: "toggle" },
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
    label: "Massages en entreprise",
    description: "Présente les bénéfices des massages pour les équipes et les entreprises",
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
    type: "benefits-grid",
    label: "Avantages pour les entreprises",
    description: "Compare les bénéfices pour les équipes et pour l’entreprise",
    icon: "🧩",
    category: "services",
    defaultContent: {
      leftTitle: "Pour vos equipes",
      leftSubtitle: "Avantages",
      leftItems: [""],
      rightTitle: "Pour votre entreprise",
      rightSubtitle: "Benefices",
      rightItems: [""],
      tags: [""],
      quote: "",
    },
    fields: [
      { key: "leftSubtitle", label: "Sous-titre gauche", type: "text" },
      { key: "leftTitle", label: "Titre gauche", type: "text" },
      { key: "leftItems", label: "Points gauche", type: "array", arrayItemType: "text" },
      { key: "rightSubtitle", label: "Sous-titre droite", type: "text" },
      { key: "rightTitle", label: "Titre droite", type: "text" },
      { key: "rightItems", label: "Points droite", type: "array", arrayItemType: "text" },
      { key: "tags", label: "Tags", type: "array", arrayItemType: "text" },
      { key: "quote", label: "Citation", type: "textarea" },
    ],
  },
  {
    type: "parcours",
    label: "Mon parcours",
    description: "Présente votre parcours personnel et professionnel avec une photo",
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
    label: "Formations et certifications",
    description: "Liste les formations, diplômes et certifications avec leurs années",
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
    label: "Ma philosophie",
    description: "Partage une phrase, une valeur ou une vision de votre activité",
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
    label: "Prendre rendez-vous",
    description: "Invite les visiteurs à vous contacter ou à réserver une séance",
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
    label: "Coordonnées et horaires",
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
    type: "contact-info",
    label: "Coordonnées et horaires (ancien format)",
    description: "Adresse, telephone, email et horaires",
    icon: "📍",
    category: "contact",
    defaultContent: {
      address: {
        street: "",
        city: "",
      },
      addresses: [{ label: "Lieu principal", street: "", city: "" }],
      phone: "",
      email: "",
      hours: [{ days: "Lundi - Vendredi", hours: "10h - 20h" }],
    },
    fields: [
      { key: "address.street", label: "Adresse (rue)", type: "text", placeholder: "123 Rue du Bien-Etre" },
      { key: "address.city", label: "Ville", type: "text", placeholder: "75011 Paris" },
      {
        key: "addresses",
        label: "Lieux de prestation",
        type: "array",
        arrayItemType: "object",
        objectFields: [
          { key: "label", label: "Nom du lieu", type: "text", placeholder: "Cabinet principal" },
          { key: "street", label: "Rue", type: "text" },
          { key: "city", label: "Code postal et ville", type: "text", placeholder: "75020 Paris" },
        ],
      },
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
    type: "contact-form",
    label: "Formulaire de contact",
    description: "Formulaire de contact front",
    icon: "✉️",
    category: "contact",
    defaultContent: {},
    fields: [],
  },
  {
    type: "contact-layout",
    label: "Contact : coordonnées + formulaire",
    description: "Affiche les coordonnées à gauche et le formulaire de contact à droite",
    icon: "📱",
    category: "contact",
    defaultContent: {
      address: {
        street: "",
        city: "",
      },
      addresses: [{ label: "Lieu principal", street: "", city: "" }],
      phone: "",
      email: "",
      hours: [
        { days: "Lundi - Vendredi", hours: "10h - 20h" },
        { days: "Samedi", hours: "10h - 18h" },
      ],
    },
    fields: [
      { key: "address.street", label: "Adresse (rue)", type: "text", placeholder: "123 Rue du Bien-Etre" },
      { key: "address.city", label: "Ville", type: "text", placeholder: "75011 Paris" },
      {
        key: "addresses",
        label: "Lieux de prestation",
        type: "array",
        arrayItemType: "object",
        objectFields: [
          { key: "label", label: "Nom du lieu", type: "text", placeholder: "Cabinet principal" },
          { key: "street", label: "Rue", type: "text" },
          { key: "city", label: "Code postal et ville", type: "text", placeholder: "75020 Paris" },
        ],
      },
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
    type: "service-selector",
    label: "Choisir un soin et réserver",
    description: "Présente les prestations et les tarifs sous forme d’onglets",
    icon: "🗂️",
    category: "services",
    defaultContent: {
      title: "Carte & tarifs",
      subtitle: "",
      bookingLink: "/reservation",
      bookingLinkNewTab: false,
      offers: [{ title: "", description: "", prices: [""] }],
    },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "subtitle", label: "Sous-titre", type: "text" },
      { key: "bookingLink", label: "Lien du bouton Reserver (optionnel)", type: "page-link", placeholder: "/reservation" },
      { key: "bookingLinkNewTab", label: "Ouvrir en nouvel onglet", type: "toggle" },
      {
        key: "offers",
        label: "Offres",
        type: "array",
        arrayItemType: "object",
        objectFields: [
          { key: "title", label: "Nom du soin", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "prices", label: "Prix", type: "array", arrayItemType: "text" },
        ],
      },
    ],
  },
  {
    type: "services-preview",
    label: "Aperçu des soins",
    description: "Présente quelques soins sous forme de cartes avec photo et prix",
    icon: "🃏",
    category: "services",
    defaultContent: {
      subtitle: "Mes soins",
      title: "Une gamme de soins pour votre bien-être",
      items: [
        { name: "", category: "", description: "", price: "", image: null, link: "/soins" },
      ],
    },
    fields: [
      { key: "subtitle", label: "Sur-titre", type: "text", placeholder: "Mes soins" },
      { key: "title", label: "Titre principal", type: "text", placeholder: "Une gamme de soins pour votre bien-être" },
      {
        key: "items",
        label: "Services",
        type: "array",
        arrayItemType: "object",
        objectFields: [
          { key: "image", label: "Image", type: "image" },
          { key: "category", label: "Categorie", type: "text", placeholder: "Massage" },
          { key: "name", label: "Nom du soin", type: "text", placeholder: "Abhyanga" },
          { key: "description", label: "Description courte", type: "textarea", placeholder: "Massage ayurvedique traditionnel..." },
          { key: "price", label: "Prix", type: "text", placeholder: "80€" },
          { key: "link", label: "Lien", type: "page-link", placeholder: "/soins" },
        ],
      },
    ],
  },
  {
    type: "google-map",
    label: "Localisation et accès",
    description: "Affiche une carte pour aider les visiteurs à trouver le lieu",
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
  if (type === "hero-simple") {
    return BLOCK_CATALOG.find((block) => block.type === "hero");
  }

  return BLOCK_CATALOG.find((block) => block.type === type);
}

export function getBlocksByCategory(categoryId: string): BlockDefinition[] {
  return BLOCK_CATALOG.filter((block) => block.category === categoryId);
}
