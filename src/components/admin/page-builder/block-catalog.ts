import {
  AlignLeft,
  Ban,
  Blend,
  Building2,
  Contact,
  FileText,
  Flower2,
  GraduationCap,
  HandCoins,
  House,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  LayoutTemplate,
  Leaf,
  ListChecks,
  ListFilter,
  Mail,
  Map as MapIcon,
  MapPin,
  Megaphone,
  MoveVertical,
  PanelTop,
  PanelsTopLeft,
  Phone,
  Quote,
  RectangleHorizontal,
  Route,
  Sparkles,
  Square,
  Star,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { ANIMATION_OPTIONS } from "@/lib/heroAnimations";

export interface BlockDefinition {
  type: string;
  label: string;
  description: string;
  icon: LucideIcon;
  category: string;
  defaultContent: Record<string, unknown>;
  fields: FieldDefinition[];
}

/** Section de l'editeur dans laquelle un champ est range. */
export type FieldGroupId = "content" | "button" | "media" | "design" | "animation" | "advanced";

export interface FieldOption {
  value: string;
  label: string;
  /** Precision affichee sous le libelle (cartes de choix). */
  hint?: string;
  icon?: LucideIcon;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "array" | "page-link" | "select" | "color" | "toggle" | "button";
  placeholder?: string;
  arrayItemType?: "text" | "textarea" | "image" | "object";
  objectFields?: FieldDefinition[];
  /** Libelle d'un element de liste ("Photo" -> "Photo 1", "Photo 2"...). */
  itemLabel?: string;
  options?: FieldOption[];
  /** Section de l'editeur ; par defaut "design" pour les couleurs, "content" sinon. */
  group?: FieldGroupId;
  /** Explication en langage courant, affichee dans une bulle "?". */
  help?: string;
  /** Champ facultatif : affiche la mention "facultatif". */
  optional?: boolean;
  /** Affiche le champ seulement si un autre champ a (ou n'a pas) une valeur donnee. */
  showIf?: { key: string; in?: string[]; notIn?: string[] };
  /** Rendu d'un champ "select" : liste deroulante (defaut), boutons ou cartes. */
  widget?: "segmented" | "cards";
  /** Champ "button" : cles du contenu pour le texte, le lien et l'ouverture dans un nouvel onglet. */
  buttonKeys?: { text: string; link: string; newTab?: string };
}

export const BLOCK_CATEGORIES = [
  { id: "header", label: "En-tete", icon: PanelTop },
  { id: "content", label: "Contenu", icon: FileText },
  { id: "layout", label: "Mise en page", icon: LayoutTemplate },
  { id: "services", label: "Services & Tarifs", icon: HandCoins },
  { id: "about", label: "A propos", icon: UserRound },
  { id: "contact", label: "Contact", icon: MapPin },
  { id: "cta", label: "Appel a l'action", icon: Megaphone },
] as const;

export const BLOCK_CATALOG: BlockDefinition[] = [
  {
    type: "hero-home",
    label: "Bannière d’accueil avec photos",
    description: "Présente le site dès l’arrivée avec un titre et plusieurs photos défilantes",
    icon: House,
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
      {
        key: "siteTitle",
        label: "Grand titre",
        type: "text",
        placeholder: "Les Massages d'Hélène",
        help: "Le premier texte que voient les visiteurs, en très grand au centre de la bannière.",
      },
      {
        key: "siteSubtitle",
        label: "Phrase sous le titre",
        type: "text",
        optional: true,
        placeholder: "Massages, rituels et bien-être",
      },
      {
        key: "button",
        label: "Bouton",
        type: "button",
        placeholder: "Réserver un soin",
        buttonKeys: { text: "buttonText", link: "buttonLink" },
      },
      {
        key: "slides",
        label: "Photos qui défilent",
        type: "array",
        arrayItemType: "object",
        itemLabel: "Photo",
        group: "media",
        help: "Chaque photo s'affiche à tour de rôle en fond de bannière, avec son propre texte.",
        objectFields: [
          { key: "image", label: "Photo", type: "image" },
          { key: "title", label: "Texte sur la photo", type: "text", optional: true },
          { key: "subtitle", label: "Petite phrase", type: "text", optional: true },
        ],
      },
      {
        key: "backgroundType",
        label: "Fond de la bannière",
        type: "select",
        widget: "cards",
        group: "design",
        options: [
          { value: "image", label: "Photos", hint: "Les photos ajoutées dans « Images »", icon: ImageIcon },
          { value: "gradient", label: "Dégradé", hint: "Fondu entre deux couleurs", icon: Blend },
          { value: "transparent", label: "Aucun", hint: "Le fond de la page reste visible", icon: Ban },
        ],
      },
      {
        key: "gradientStart",
        label: "Couleur 1 du dégradé",
        type: "color",
        showIf: { key: "backgroundType", in: ["gradient"] },
      },
      {
        key: "gradientEnd",
        label: "Couleur 2 du dégradé",
        type: "color",
        showIf: { key: "backgroundType", in: ["gradient"] },
      },
      {
        key: "overlayOpacity",
        label: "Assombrir la photo",
        type: "select",
        widget: "segmented",
        group: "design",
        help: "Pose un voile sombre sur le fond pour que le texte reste bien lisible, même sur une photo claire.",
        showIf: { key: "backgroundType", in: ["image", "gradient"] },
        options: [
          { value: "20", label: "Léger" },
          { value: "35", label: "Moyen" },
          { value: "45", label: "Marqué" },
          { value: "60", label: "Fort" },
        ],
      },
      {
        key: "backgroundBlur",
        label: "Flou de la photo",
        type: "select",
        widget: "segmented",
        group: "design",
        help: "Rend la photo floue pour faire ressortir le texte. « Aucun » garde la photo nette.",
        showIf: { key: "backgroundType", in: ["image"] },
        options: [
          { value: "0", label: "Aucun" },
          { value: "2", label: "Léger" },
          { value: "4", label: "Moyen" },
          { value: "6", label: "Fort" },
        ],
      },
      {
        key: "textColor",
        label: "Couleur du texte",
        type: "color",
        help: "Couleur du titre et des phrases. Choisissez une couleur claire sur une photo sombre, et inversement.",
      },
      {
        key: "animation",
        label: "Décor animé",
        type: "select",
        group: "design",
        help: "Motif en mouvement (vagues, pétales…) qui remplace ou décore le fond de la bannière.",
        options: ANIMATION_OPTIONS,
      },
      {
        key: "entryAnimation",
        label: "Effet d'apparition du texte",
        type: "select",
        group: "animation",
        help: "Mouvement du titre et du bouton à l'ouverture de la page.",
        options: [
          { value: "none", label: "Aucun" },
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
        label: "Délai avant l'effet",
        type: "select",
        widget: "segmented",
        group: "animation",
        showIf: { key: "entryAnimation", notIn: ["", "none"] },
        options: [
          { value: "0", label: "Immédiat" },
          { value: "0.3", label: "0,3 s" },
          { value: "0.6", label: "0,6 s" },
          { value: "1", label: "1 s" },
        ],
      },
    ],
  },
  {
    type: "neutral",
    label: "Section personnalisée",
    description: "Ajoute un contenu libre avec un titre, du texte et éventuellement un bouton",
    icon: Square,
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
    icon: MoveVertical,
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
    icon: ImageIcon,
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
    icon: RectangleHorizontal,
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
    icon: Sparkles,
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
    icon: ListChecks,
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
    icon: Quote,
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
    icon: Star,
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
    icon: AlignLeft,
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
    icon: ImageIcon,
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
    icon: Images,
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
    icon: HandCoins,
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
    icon: Building2,
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
    icon: LayoutGrid,
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
    icon: Route,
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
    icon: GraduationCap,
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
    icon: Flower2,
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
    icon: Phone,
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
    icon: MapPin,
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
    icon: Contact,
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
    icon: Mail,
    category: "contact",
    defaultContent: {},
    fields: [],
  },
  {
    type: "contact-layout",
    label: "Contact : coordonnées + formulaire",
    description: "Affiche les coordonnées à gauche et le formulaire de contact à droite",
    icon: PanelsTopLeft,
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
    icon: ListFilter,
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
    icon: Leaf,
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
    icon: MapIcon,
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
