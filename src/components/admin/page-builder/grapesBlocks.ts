import type { Block, Editor } from "grapesjs";

const STRUCTURE_CATEGORY = "Structure";
const CONTENT_CATEGORY = "Contenu";
const DYNAMIC_CATEGORY = "Automatique";
const SHARED_CATEGORY = "Composants partagés";
const PLACEHOLDER_IMAGE = "/block-placeholder.svg";

export const RICH_TEXT_OPTIONS = {
  base: { bold: true, italic: true, underline: true, strikethrough: true, link: true },
  fonts: { fontColor: true, hilite: true },
  format: { heading1: true, heading2: true, heading3: true, paragraph: true, clearFormatting: true },
  list: true,
  align: true,
  indentOutdent: false,
  actions: false,
  extra: false,
  undoredo: false,
};

const TABLET_QUERY = "(max-width: 1023px)";
const MOBILE_QUERY = "(max-width: 767px)";

type RuleStyles = Record<string, string>;

// Options du plugin officiel : ses styles de base sont remplacés par BLOCK_RULES (thème et mobile).
export const BASIC_BLOCKS_OPTIONS = {
  blocks: ["column1", "column2", "column3", "column3-7", "text", "link", "image"],
  category: STRUCTURE_CATEGORY,
  flexGrid: true,
  addBasicStyle: false,
  stylePrefix: "hm-",
  labelColumn1: "Section vide",
  labelColumn2: "2 colonnes",
  labelColumn3: "3 colonnes",
  labelColumn37: "2 colonnes 30/70",
  labelText: "Paragraphe",
  labelLink: "Lien",
  labelImage: "Image",
};

// Couleurs et polices passent par les variables du thème : les blocs suivent Réglages et le mode sombre.
const BLOCK_RULES: Record<string, RuleStyles> = {
  ".hm-row": { display: "flex", "justify-content": "flex-start", "align-items": "stretch", "flex-wrap": "nowrap", gap: "1.5rem", "max-width": "72rem", margin: "0 auto", padding: "1.5rem" },
  ".hm-cell": { "min-height": "75px", "flex-grow": "1", "flex-basis": "100%", "min-width": "0" },
  ".hm-link": { color: "var(--text-primary)", "text-decoration": "underline" },
  ".hm-section": { padding: "4rem 1.5rem", color: "var(--text-primary)" },
  ".hm-inner": { "max-width": "72rem", margin: "0 auto" },
  ".hm-title": { "font-family": "var(--font-heading)", "font-size": "2.25rem", "line-height": "1.2", margin: "0 0 1rem", color: "var(--text-primary)" },
  ".hm-text": { "font-size": "1.0625rem", "line-height": "1.7", margin: "0 0 1rem", color: "var(--text-secondary)" },
  ".hm-button": { display: "inline-block", padding: ".75rem 1.75rem", "border-radius": "var(--btn-radius)", background: "var(--btn-bg)", color: "var(--btn-text)", "font-weight": "600", "text-decoration": "none" },
  ".hm-hero": { "min-height": "60vh", display: "flex", "align-items": "center", "justify-content": "center", padding: "6rem 1.5rem", "text-align": "center", background: "var(--gradient-primary) center/cover no-repeat" },
  ".hm-hero-inner": { "max-width": "48rem" },
  ".hm-hero-title": { "font-family": "var(--font-heading)", "font-size": "3.5rem", "line-height": "1.1", margin: "0 0 1rem", color: "var(--text-on-primary, #fff)" },
  ".hm-hero-text": { "font-size": "1.25rem", margin: "0 0 2rem", color: "var(--text-on-primary, #fff)" },
  ".hm-split": { display: "flex", gap: "3rem", "align-items": "center" },
  ".hm-split-col": { flex: "1 1 0", "min-width": "0" },
  ".hm-split-img": { display: "block", width: "100%", height: "auto", "border-radius": "var(--card-radius)" },
  ".hm-cards": { display: "grid", "grid-template-columns": "repeat(3, minmax(0, 1fr))", gap: "1.5rem" },
  ".hm-card": { padding: "1.5rem", background: "var(--card-bg)", border: "1px solid var(--card-border)", "border-radius": "var(--card-radius)" },
  ".hm-card-title": { "font-family": "var(--font-heading)", "font-size": "1.375rem", margin: "0 0 .5rem", color: "var(--text-primary)" },
  ".hm-gallery": { display: "grid", "grid-template-columns": "repeat(3, minmax(0, 1fr))", gap: "1rem" },
  ".hm-gallery-img": { display: "block", width: "100%", "aspect-ratio": "4 / 3", "object-fit": "cover", "border-radius": "var(--card-radius)" },
  ".hm-prices": { display: "grid", "grid-template-columns": "repeat(2, minmax(0, 1fr))", gap: "1.5rem" },
  ".hm-price": { padding: "1.5rem", background: "var(--card-bg)", border: "1px solid var(--card-border)", "border-radius": "var(--card-radius)" },
  ".hm-price-title": { "font-family": "var(--font-heading)", "font-size": "1.375rem", margin: "0 0 .5rem", color: "var(--text-primary)" },
  ".hm-price-value": { "font-weight": "600", margin: "0", color: "var(--text-primary)" },
};

const BLOCK_MEDIA_RULES: Record<string, Record<string, RuleStyles>> = {
  [TABLET_QUERY]: {
    ".hm-cards": { "grid-template-columns": "repeat(2, minmax(0, 1fr))" },
  },
  [MOBILE_QUERY]: {
    ".hm-row": { "flex-wrap": "wrap", padding: "1rem" },
    ".hm-cell": { "flex-basis": "100%" },
    ".hm-section": { padding: "3rem 1rem" },
    ".hm-title": { "font-size": "1.75rem" },
    ".hm-hero": { "min-height": "50vh", padding: "4rem 1rem" },
    ".hm-hero-title": { "font-size": "2.25rem" },
    ".hm-hero-text": { "font-size": "1.0625rem" },
    ".hm-split": { "flex-direction": "column", gap: "1.5rem" },
    ".hm-split-col": { flex: "none", width: "100%" },
    ".hm-cards": { "grid-template-columns": "minmax(0, 1fr)" },
    ".hm-gallery": { "grid-template-columns": "repeat(2, minmax(0, 1fr))" },
    ".hm-prices": { "grid-template-columns": "minmax(0, 1fr)" },
  },
};

function section(inner: string): string {
  return `<section class="hm-section"><div class="hm-inner">${inner}</div></section>`;
}

const BLOCKS = [
  {
    id: "hm-hero",
    label: "Hero",
    content: `<section class="hm-hero"><div class="hm-hero-inner"><h1 class="hm-hero-title">Titre de la page</h1><p class="hm-hero-text">Une phrase d'accroche.</p><a class="hm-button" href="/contact">Prendre rendez-vous</a></div></section>`,
  },
  {
    id: "hm-text",
    label: "Texte",
    content: section(`<h2 class="hm-title">Titre</h2><p class="hm-text">Votre texte ici.</p>`),
  },
  {
    id: "hm-text-image",
    label: "Texte + image",
    content: section(
      `<div class="hm-split"><div class="hm-split-col"><h2 class="hm-title">Titre</h2><p class="hm-text">Votre texte ici.</p></div><div class="hm-split-col"><img class="hm-split-img" src="${PLACEHOLDER_IMAGE}" alt=""></div></div>`,
    ),
  },
  {
    id: "hm-cards",
    label: "Cartes en colonnes",
    content: section(
      `<h2 class="hm-title">Titre</h2><div class="hm-cards">${[1, 2, 3]
        .map(() => `<div class="hm-card"><h3 class="hm-card-title">Titre de la carte</h3><p class="hm-text">Description.</p></div>`)
        .join("")}</div>`,
    ),
  },
  {
    id: "hm-gallery",
    label: "Galerie",
    content: section(
      `<div class="hm-gallery">${[1, 2, 3, 4, 5, 6]
        .map(() => `<img class="hm-gallery-img" src="${PLACEHOLDER_IMAGE}" alt="">`)
        .join("")}</div>`,
    ),
  },
  {
    id: "hm-prices",
    label: "Tarifs",
    content: section(
      `<h2 class="hm-title">Tarifs</h2><div class="hm-prices">${[1, 2]
        .map(
          () =>
            `<div class="hm-price"><h3 class="hm-price-title">Nom du soin</h3><p class="hm-text">Description du soin.</p><p class="hm-price-value">1 h · 70 €</p></div>`,
        )
        .join("")}</div>`,
    ),
  },
  {
    id: "hm-button",
    label: "Bouton",
    content: `<a class="hm-button" href="/contact">Réserver</a>`,
  },
];

const DYNAMIC_BLOCKS = [
  { id: "hm-slider", label: "Diaporama", content: { type: "hm-hero-slider" } },
  { id: "hm-contact", label: "Coordonnées et formulaire", content: { type: "hm-contact" } },
  { id: "hm-map", label: "Carte", content: { type: "hm-map" } },
];

const DYNAMIC_TYPES: Array<{ type: string; dynamic: string; label: string; hint: string }> = [
  { type: "hm-hero-slider", dynamic: "hero-slider", label: "Diaporama", hint: "Modifiez les images dans l'onglet Réglages de ce bloc." },
  { type: "hm-contact", dynamic: "contact", label: "Coordonnées et formulaire", hint: "Remplis automatiquement depuis Réglages." },
  { type: "hm-map", dynamic: "map", label: "Carte", hint: "Remplie automatiquement depuis Réglages." },
];

function registerDynamicTypes(editor: Editor) {
  for (const { type, dynamic, label, hint } of DYNAMIC_TYPES) {
    editor.Components.addType(type, {
      isComponent: (el) => el.getAttribute?.("data-dynamic") === dynamic,
      model: {
        defaults: {
          tagName: "section",
          name: label,
          droppable: false,
          attributes: { "data-dynamic": dynamic, ...(dynamic === "hero-slider" ? { "data-slides": "[]" } : {}) },
          traits:
            dynamic === "hero-slider"
              ? [{ type: "button", name: "edit-slides", label: false, text: "Modifier les images", full: true, command: "hm:edit-slides" }]
              : [],
        },
      },
      view: {
        // Aperçu réservé au canvas : l'élément exporté reste vide, le site public y rend le composant React.
        onRender({ el }: { el: HTMLElement }) {
          el.innerHTML = `<div style="padding:3rem 1rem;text-align:center;border:2px dashed var(--card-border);color:var(--text-secondary);font-family:sans-serif"><strong>${label}</strong><br><small>${hint}</small></div>`;
        },
      },
    });
  }
}

/**
 * Adds the block styles missing from the project, without touching those the editor changed.
 * They go through setRule because the GrapesJS CSS parser drops shorthands containing var().
 */
export function ensureBlockStyles(editor: Editor) {
  for (const [selector, style] of Object.entries(BLOCK_RULES)) {
    if (!editor.Css.getRule(selector)) {
      editor.Css.setRule(selector, style);
    }
  }

  for (const [query, rules] of Object.entries(BLOCK_MEDIA_RULES)) {
    const options = { atRuleType: "media", atRuleParams: query };
    for (const [selector, style] of Object.entries(rules)) {
      if (!editor.Css.getRule(selector, options)) {
        editor.Css.setRule(selector, style, options);
      }
    }
  }
}

const ADVANCE_CATEGORIES: Record<string, string> = {
  Commerce: "Commerce",
  Content: "Articles",
  Custom: "Éléments",
  Form: "Formulaires",
  Media: "Médias",
  Sections: "Sections",
  "Social proof": "Témoignages et chiffres",
  Text: "Textes",
};

const ADVANCE_LABELS: Record<string, string> = {
  Checkout: "Paiement",
  Pricing: "Tarif",
  "Comparison table": "Tableau comparatif",
  "Blog list": "Liste d'articles",
  Link: "Lien",
  Button: "Bouton",
  Divider: "Séparateur",
  "Progress Bar": "Barre de progression",
  Slider: "Carrousel",
  Header: "En-tête",
  Footer: "Pied de page",
  Map: "Carte (iframe)",
  "Contact form": "Formulaire de contact",
  Newsletter: "Newsletter",
  Input: "Champ",
  Checkbox: "Case à cocher",
  Radio: "Bouton radio",
  Select: "Liste déroulante",
  Textarea: "Zone de texte",
  Image: "Image",
  Video: "Vidéo",
  Hero: "Hero",
  Features: "Atouts",
  "Call to action": "Appel à l'action",
  Team: "Équipe",
  Steps: "Étapes",
  Banner: "Bannière",
  Tabs: "Onglets",
  Testimonials: "Témoignages",
  "Logo wall": "Mur de logos",
  Stats: "Chiffres clés",
  Faq: "FAQ",
  "Heading H1": "Titre H1",
  "Heading H2": "Titre H2",
  "Heading H3": "Titre H3",
  "Heading H4": "Titre H4",
  "Heading H5": "Titre H5",
  "Heading H6": "Titre H6",
  Paragraph: "Paragraphe",
  Quote: "Citation",
  List: "Liste",
};

/** The plugin only ships English block names, so they are translated once it has registered them. */
function translateAdvanceBlocks(editor: Editor) {
  const labelPattern = /(<div class="gjs-block-label">)([^<]+)(<\/div>)/;

  editor.Blocks.getAll()
    .filter((block: Block) => block.getId().endsWith("-block"))
    .forEach((block: Block) => {
      const { label, category, ...attributes } = block.attributes;
      const categoryName = block.getCategoryLabel();
      editor.Blocks.remove(block.getId());
      editor.Blocks.add(block.getId(), {
        ...attributes,
        label: String(label).replace(labelPattern, (_match, open: string, name: string, close: string) => `${open}${ADVANCE_LABELS[name] ?? name}${close}`),
        category: ADVANCE_CATEGORIES[categoryName] ?? categoryName ?? category,
      });
    });
}

/** Replaces the default GrapesJS content by the short list of blocks offered to the editor. */
export function registerGrapesBlocks(editor: Editor) {
  registerDynamicTypes(editor);
  translateAdvanceBlocks(editor);

  // Remplace les textes anglais et les couleurs fixes des blocs du plugin.
  editor.Blocks.get("text")?.set("content", { type: "text", content: "Votre texte ici.", classes: ["hm-text"] });
  editor.Blocks.get("link")?.set("content", { type: "link", content: "Votre lien", classes: ["hm-link"] });
  editor.Blocks.add("hm-heading", {
    label: "Titre",
    category: STRUCTURE_CATEGORY,
    content: `<h2 class="hm-title">Votre titre</h2>`,
  });

  for (const block of BLOCKS) {
    editor.Blocks.add(block.id, { label: block.label, category: CONTENT_CATEGORY, content: block.content });
  }
  for (const block of DYNAMIC_BLOCKS) {
    editor.Blocks.add(block.id, { label: block.label, category: DYNAMIC_CATEGORY, content: block.content });
  }
}

/** Lists the shared components in the block panel, so they can be placed on any page. */
export function refreshSharedBlocks(editor: Editor) {
  editor.Blocks.getAll()
    .filter((block: Block) => block.getId().startsWith("hm-shared-"))
    .forEach((block: Block) => editor.Blocks.remove(block.getId()));

  for (const main of editor.Components.getSymbols()) {
    editor.Blocks.add(`hm-shared-${main.getId()}`, {
      label: main.getName(),
      category: SHARED_CATEGORY,
      content: () => editor.Components.addSymbol(main) as never,
    });
  }
}
