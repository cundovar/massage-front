import {
  AlignCenter,
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
  /** Texte avec mise en forme (gras, italique, souligne, saut de ligne, couleur). Champs text/textarea. */
  rich?: boolean;
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

/** Reglages de fond communs aux bannieres (accueil, page, petite banniere). */
function bannerBackgroundFields(photoHint: string): FieldDefinition[] {
  return [
    {
      key: "backgroundType",
      label: "Fond de la bannière",
      type: "select",
      widget: "cards",
      group: "design",
      options: [
        { value: "image", label: "Photo", hint: photoHint, icon: ImageIcon },
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
      label: "Assombrir le fond",
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
  ];
}

const DECOR_HELP = "Motif en mouvement (vagues, pétales…) qui remplace ou décore le fond de la bannière.";

const OFFER_FIELDS: FieldDefinition[] = [
  { key: "title", label: "Nom du soin", type: "text", rich: true, placeholder: "Abhyanga" },
  { key: "description", label: "Description", type: "textarea", rich: true, optional: true },
  {
    key: "prices",
    label: "Durées et prix",
    type: "array",
    arrayItemType: "text",
    itemLabel: "Formule",
    help: "Une ligne par formule, par exemple « 1h · 80€ ».",
  },
];

const HOURS_FIELD: FieldDefinition = {
  key: "hours",
  label: "Horaires",
  type: "array",
  arrayItemType: "object",
  itemLabel: "Créneau",
  objectFields: [
    { key: "days", label: "Jours", type: "text", placeholder: "Lundi - Vendredi" },
    { key: "hours", label: "Heures", type: "text", placeholder: "10h - 20h" },
  ],
};

const ADDRESS_FIELDS: FieldDefinition[] = [
  {
    key: "addresses",
    label: "Lieux de massage",
    type: "array",
    arrayItemType: "object",
    itemLabel: "Lieu",
    help: "Ajoutez un lieu par adresse où vous recevez.",
    objectFields: [
      { key: "label", label: "Nom du lieu", type: "text", optional: true, placeholder: "Cabinet principal" },
      { key: "street", label: "Rue", type: "text", placeholder: "123 rue du Bien-Être" },
      { key: "city", label: "Code postal et ville", type: "text", placeholder: "75020 Paris" },
    ],
  },
  {
    key: "address.street",
    label: "Rue (ancien champ)",
    type: "text",
    group: "advanced",
    help: "Utilisé seulement si aucun lieu n'est renseigné au-dessus.",
  },
  {
    key: "address.city",
    label: "Ville (ancien champ)",
    type: "text",
    group: "advanced",
    help: "Utilisé seulement si aucun lieu n'est renseigné au-dessus.",
  },
  { key: "phone", label: "Téléphone", type: "text", placeholder: "06 12 34 56 78" },
  { key: "email", label: "E-mail", type: "text", placeholder: "contact@exemple.fr" },
  HOURS_FIELD,
];

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
        rich: true,
        placeholder: "Les Massages d'Hélène",
        help: "Le premier texte que voient les visiteurs, en très grand au centre de la bannière.",
      },
      {
        key: "siteSubtitle",
        label: "Phrase sous le titre",
        type: "text",
        rich: true,
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
          { key: "title", label: "Texte sur la photo", type: "text", rich: true, optional: true },
          { key: "subtitle", label: "Petite phrase", type: "text", rich: true, optional: true },
        ],
      },
      ...bannerBackgroundFields("Les photos ajoutées dans « Images »"),
      {
        key: "animation",
        label: "Décor animé",
        type: "select",
        group: "design",
        help: DECOR_HELP,
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
      {
        key: "eyebrow",
        label: "Petit texte au-dessus du titre",
        type: "text",
        rich: true,
        optional: true,
        placeholder: "À retenir",
        help: "Court mot affiché en petites majuscules colorées, juste au-dessus du titre.",
      },
      { key: "title", label: "Titre", type: "text", rich: true, optional: true, placeholder: "Titre de section" },
      { key: "subtitle", label: "Phrase d'introduction", type: "textarea", rich: true, optional: true },
      { key: "paragraphs", label: "Paragraphes", type: "array", arrayItemType: "textarea", itemLabel: "Paragraphe", rich: true },
      {
        key: "button",
        label: "Bouton",
        type: "button",
        placeholder: "En savoir plus",
        buttonKeys: { text: "buttonText", link: "buttonLink" },
      },
      {
        key: "align",
        label: "Alignement du texte",
        type: "select",
        widget: "segmented",
        group: "design",
        options: [
          { value: "left", label: "À gauche", icon: AlignLeft },
          { value: "center", label: "Centré", icon: AlignCenter },
        ],
      },
      {
        key: "width",
        label: "Largeur du texte",
        type: "select",
        widget: "segmented",
        group: "design",
        help: "Largeur maximale du texte sur grand écran. Un texte étroit se lit plus facilement.",
        options: [
          { value: "narrow", label: "Étroite" },
          { value: "normal", label: "Normale" },
          { value: "wide", label: "Large" },
        ],
      },
      {
        key: "background",
        label: "Encadré autour du texte",
        type: "select",
        widget: "segmented",
        group: "design",
        help: "Encadre uniquement le texte. Le « Fond du bloc », plus bas, colore toute la largeur.",
        options: [
          { value: "transparent", label: "Aucun" },
          { value: "soft", label: "Léger" },
          { value: "card", label: "Carte" },
        ],
      },
      {
        key: "spacing",
        label: "Espace intérieur",
        type: "select",
        widget: "segmented",
        group: "design",
        help: "Hauteur du vide au-dessus et en dessous du texte.",
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
        label: "Hauteur de l'espace",
        type: "select",
        widget: "segmented",
        help: "Espace vide ajouté entre le bloc du dessus et celui du dessous.",
        options: [
          { value: "xs", label: "Très petit" },
          { value: "sm", label: "Petit" },
          { value: "md", label: "Moyen" },
          { value: "lg", label: "Grand" },
          { value: "xl", label: "Très grand" },
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
      { key: "title", label: "Titre", type: "text", rich: true, placeholder: "Bienvenue" },
      { key: "subtitle", label: "Phrase sous le titre", type: "text", rich: true, optional: true, placeholder: "Massage & bien-être" },
      {
        key: "image",
        label: "Photo de fond",
        type: "image",
        showIf: { key: "backgroundType", in: ["image"] },
      },
      ...bannerBackgroundFields("La photo choisie dans « Images »"),
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
      { key: "title", label: "Titre", type: "text", rich: true, placeholder: "Titre de la page" },
      { key: "subtitle", label: "Phrase sous le titre", type: "text", rich: true, optional: true, placeholder: "Phrase courte facultative" },
      {
        key: "image",
        label: "Photo de fond",
        type: "image",
        showIf: { key: "backgroundType", in: ["image"] },
      },
      ...bannerBackgroundFields("La photo choisie dans « Images »"),
      {
        key: "backgroundAnimation",
        label: "Décor animé",
        type: "select",
        group: "design",
        help: DECOR_HELP,
        options: ANIMATION_OPTIONS,
      },
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
      { key: "title", label: "Titre", type: "text", rich: true },
      { key: "image", label: "Photo", type: "image" },
      {
        key: "paragraphs",
        label: "Paragraphes",
        type: "array",
        arrayItemType: "textarea",
        itemLabel: "Paragraphe",
        rich: true,
      },
      {
        key: "quote",
        label: "Citation",
        type: "textarea",
        rich: true,
        optional: true,
        help: "Phrase mise en valeur dans un encadré coloré. Laissez vide pour ne pas afficher l'encadré.",
      },
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
      {
        key: "title",
        label: "Titre",
        type: "text",
        rich: true,
        optional: true,
        placeholder: "Approche",
        help: "Laissez vide pour afficher « Approche ».",
      },
      {
        key: "bulletsTitle",
        label: "Titre de la liste",
        type: "text",
        rich: true,
        optional: true,
        placeholder: "Ce qui guide mes mains :",
      },
      { key: "bullets", label: "Points de la liste", type: "array", arrayItemType: "text", itemLabel: "Point", rich: true },
      {
        key: "quote",
        label: "Phrase de conclusion",
        type: "textarea",
        rich: true,
        optional: true,
        help: "Phrase en italique sous la liste. Laissez vide pour ne rien afficher.",
      },
      {
        key: "images",
        label: "Photos",
        type: "array",
        arrayItemType: "image",
        itemLabel: "Photo",
        help: "1 photo : une grande image. 2 à 4 photos : une mosaïque. Seules les 4 premières sont affichées.",
      },
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
      { key: "text", label: "Citation", type: "textarea", rich: true },
      { key: "author", label: "Auteur", type: "text", rich: true, optional: true, placeholder: "Hélène" },
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
      { key: "eyebrow", label: "Petit titre", type: "text", rich: true, optional: true, placeholder: "Avis Google" },
      { key: "title", label: "Titre", type: "text", rich: true, optional: true },
      { key: "subtitle", label: "Introduction", type: "textarea", rich: true, optional: true },
      {
        key: "averageRating",
        label: "Note moyenne",
        type: "text",
        placeholder: "4.8",
        help: "Note sur 5 affichée en grand, avec un point pour les décimales (ex. 4.8).",
      },
      {
        key: "totalReviews",
        label: "Nombre d'avis",
        type: "text",
        optional: true,
        placeholder: "24",
        help: "Affiche « 24 avis sur Google » sous la note.",
      },
      {
        key: "reviews",
        label: "Avis affichés",
        type: "array",
        arrayItemType: "object",
        itemLabel: "Avis",
        help: "Un avis sans commentaire n'est pas affiché sur le site.",
        objectFields: [
          { key: "name", label: "Prénom ou initiales", type: "text", placeholder: "Sophie M." },
          {
            key: "rating",
            label: "Note",
            type: "select",
            widget: "segmented",
            options: [
              { value: "5", label: "5 ★" },
              { value: "4", label: "4 ★" },
              { value: "3", label: "3 ★" },
              { value: "2", label: "2 ★" },
              { value: "1", label: "1 ★" },
            ],
          },
          { key: "text", label: "Commentaire", type: "textarea", rich: true },
          { key: "date", label: "Date affichée", type: "text", optional: true, placeholder: "Il y a 2 mois" },
        ],
      },
      {
        key: "button",
        label: "Bouton vers Google",
        type: "button",
        placeholder: "Voir tous les avis Google",
        buttonKeys: { text: "buttonText", link: "googleUrl" },
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
      { key: "title", label: "Titre", type: "text", rich: true, optional: true },
      { key: "paragraphs", label: "Paragraphes", type: "array", arrayItemType: "textarea", itemLabel: "Paragraphe", rich: true },
      {
        key: "image",
        label: "Photo",
        type: "image",
        optional: true,
        help: "Avec une photo, le texte s'affiche à côté d'elle sur grand écran.",
      },
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
      { key: "image", label: "Photo", type: "image" },
      {
        key: "alt",
        label: "Description de la photo",
        type: "text",
        placeholder: "Table de massage dans le cabinet",
        help: "Non affichée. Elle décrit la photo aux personnes malvoyantes et aide Google à la comprendre.",
      },
      { key: "caption", label: "Légende", type: "text", rich: true, optional: true, help: "Petit texte affiché sous la photo." },
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
      { key: "title", label: "Titre", type: "text", rich: true, optional: true },
      { key: "images", label: "Photos", type: "array", arrayItemType: "image", itemLabel: "Photo" },
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
      { key: "title", label: "Titre", type: "text", rich: true, placeholder: "Tarifs" },
      { key: "subtitle", label: "Phrase sous le titre", type: "text", rich: true, optional: true },
      {
        key: "offers",
        label: "Soins proposés",
        type: "array",
        arrayItemType: "object",
        itemLabel: "Soin",
        objectFields: OFFER_FIELDS,
      },
      {
        key: "bookingLink",
        label: "Lien du bouton « Réserver »",
        type: "page-link",
        group: "button",
        optional: true,
        placeholder: "https://www.planity.com/...",
        help: "Bouton affiché sur chaque soin. Laissez vide pour ne pas l'afficher.",
      },
      {
        key: "bookingLinkNewTab",
        label: "Ouvrir la réservation dans un nouvel onglet",
        type: "toggle",
        group: "button",
        help: "Conseillé pour un site de réservation externe (Planity...), pour que le visiteur garde votre site ouvert.",
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
      { key: "title", label: "Titre", type: "text", rich: true },
      { key: "subtitle", label: "Phrase d'introduction", type: "text", rich: true, optional: true },
      { key: "teamTitle", label: "Titre de la colonne « équipes »", type: "text", rich: true, placeholder: "Pour vos équipes" },
      { key: "teamBenefits", label: "Avantages pour les équipes", type: "array", arrayItemType: "text", itemLabel: "Avantage", rich: true },
      {
        key: "companyTitle",
        label: "Titre de la colonne « entreprise »",
        type: "text",
        rich: true,
        placeholder: "Pour votre entreprise",
      },
      {
        key: "companyBenefits",
        label: "Avantages pour l'entreprise",
        type: "array",
        arrayItemType: "text",
        itemLabel: "Avantage",
        rich: true,
      },
      {
        key: "characteristics",
        label: "Points clés avec icône",
        type: "array",
        arrayItemType: "text",
        itemLabel: "Point clé",
        rich: true,
        help: "4 au maximum, chacun avec une icône. Laissez vide pour afficher « 10-20 min », « Dans vos locaux », « Sans huile », « Chaise ergo ».",
      },
      { key: "quote", label: "Citation", type: "textarea", rich: true, optional: true },
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
      { key: "leftSubtitle", label: "Petit titre (colonne gauche)", type: "text", rich: true, optional: true, placeholder: "Avantages" },
      { key: "leftTitle", label: "Titre (colonne gauche)", type: "text", rich: true, placeholder: "Pour vos équipes" },
      { key: "leftItems", label: "Points (colonne gauche)", type: "array", arrayItemType: "text", itemLabel: "Point", rich: true },
      { key: "rightSubtitle", label: "Petit titre (colonne droite)", type: "text", rich: true, optional: true, placeholder: "Bénéfices" },
      { key: "rightTitle", label: "Titre (colonne droite)", type: "text", rich: true, placeholder: "Pour votre entreprise" },
      { key: "rightItems", label: "Points (colonne droite)", type: "array", arrayItemType: "text", itemLabel: "Point", rich: true },
      {
        key: "tags",
        label: "Mots-clés",
        type: "array",
        arrayItemType: "text",
        itemLabel: "Mot-clé",
        rich: true,
        help: "Petites étiquettes arrondies affichées sous les deux colonnes.",
      },
      { key: "quote", label: "Citation", type: "textarea", rich: true, optional: true },
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
      {
        key: "title",
        label: "Titre",
        type: "text",
        rich: true,
        optional: true,
        placeholder: "Mon parcours",
        help: "Laissez vide pour afficher « Mon parcours ».",
      },
      { key: "paragraphs", label: "Texte", type: "array", arrayItemType: "textarea", itemLabel: "Paragraphe", rich: true },
      { key: "image", label: "Photo", type: "image", optional: true },
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
      {
        key: "title",
        label: "Titre",
        type: "text",
        rich: true,
        optional: true,
        placeholder: "Formations",
        help: "Laissez vide pour afficher « Formations ».",
      },
      {
        key: "items",
        label: "Formations",
        type: "array",
        arrayItemType: "object",
        itemLabel: "Formation",
        objectFields: [
          { key: "year", label: "Année", type: "text", optional: true, placeholder: "2021" },
          { key: "title", label: "Intitulé", type: "text", rich: true, placeholder: "Massage ayurvédique - Kerala" },
        ],
      },
      {
        key: "images",
        label: "Logos et certificats",
        type: "array",
        arrayItemType: "image",
        itemLabel: "Logo",
        optional: true,
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
    fields: [
      { key: "text", label: "Texte", type: "textarea", rich: true },
      { key: "author", label: "Signature", type: "text", rich: true, optional: true },
    ],
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
      buttonLink: "/contact",
    },
    fields: [
      { key: "title", label: "Titre", type: "text", rich: true },
      { key: "subtitle", label: "Phrase sous le titre", type: "text", rich: true, optional: true },
      {
        key: "button",
        label: "Bouton",
        type: "button",
        placeholder: "Prendre rendez-vous",
        buttonKeys: { text: "buttonText", link: "buttonLink" },
      },
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
      { key: "title", label: "Titre", type: "text", rich: true, placeholder: "Informations pratiques" },
      { key: "address.street", label: "Rue", type: "text", placeholder: "123 rue du Bien-Être" },
      { key: "address.city", label: "Code postal et ville", type: "text", placeholder: "75011 Paris" },
      { key: "phone", label: "Téléphone", type: "text", placeholder: "06 12 34 56 78" },
      { key: "email", label: "E-mail", type: "text", placeholder: "contact@exemple.fr" },
      HOURS_FIELD,
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
      ...ADDRESS_FIELDS,
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
      ...ADDRESS_FIELDS,
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
      { key: "title", label: "Titre", type: "text", rich: true, placeholder: "Carte & tarifs" },
      { key: "subtitle", label: "Phrase sous le titre", type: "text", rich: true, optional: true },
      {
        key: "offers",
        label: "Soins proposés",
        type: "array",
        arrayItemType: "object",
        itemLabel: "Soin",
        help: "Chaque soin devient un onglet. Un soin sans nom n'est pas affiché.",
        objectFields: OFFER_FIELDS,
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
      { key: "subtitle", label: "Petit titre", type: "text", rich: true, optional: true, placeholder: "Mes soins" },
      {
        key: "title",
        label: "Titre",
        type: "text",
        rich: true,
        placeholder: "Une gamme de soins pour votre bien-être",
      },
      {
        key: "items",
        label: "Soins mis en avant",
        type: "array",
        arrayItemType: "object",
        itemLabel: "Soin",
        help: "Sans soin ajouté ici, le site affiche automatiquement les soins de la page « Services ».",
        objectFields: [
          { key: "image", label: "Photo", type: "image", optional: true },
          { key: "name", label: "Nom du soin", type: "text", rich: true, placeholder: "Abhyanga" },
          { key: "category", label: "Catégorie", type: "text", rich: true, optional: true, placeholder: "Massage" },
          { key: "description", label: "Description courte", type: "textarea", rich: true, optional: true },
          { key: "price", label: "Prix", type: "text", optional: true, placeholder: "80€" },
          { key: "link", label: "Lien « Découvrir »", type: "page-link", placeholder: "/soins" },
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
      { key: "title", label: "Titre", type: "text", rich: true, optional: true, placeholder: "Venir au cabinet" },
      {
        key: "embedUrl",
        label: "Adresse d'intégration de la carte",
        type: "textarea",
        placeholder: "https://www.google.com/maps/embed?pb=...",
        help: "Dans Google Maps : Partager → Intégrer une carte → copiez le lien entre les guillemets de src=\"...\". Pour plusieurs adresses sur une même carte, utilisez Google My Maps (gratuit).",
      },
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
