/**
 * Texte enrichi des blocs (gras, italique, souligne, saut de ligne, couleur).
 *
 * Format stocke : fragment HTML "en ligne" limite a <strong>, <em>, <u>, <br>
 * et <span data-color="...">. Les anciens textes bruts restent valides.
 * Partage entre l'editeur admin (RichTextEditor) et le rendu public (RichText).
 */

export interface RichTextColor {
  id: string;
  label: string;
  /** Valeur CSS basee sur les variables du theme : suit le theme et le mode sombre. */
  css: string;
}

/**
 * Couleurs proposees a la redaction. Melangees avec la couleur du texte pour
 * garder un contraste lisible (WCAG AA) sur fond clair comme sur fond sombre.
 */
export const RICH_TEXT_COLORS: RichTextColor[] = [
  { id: "accent", label: "Couleur du thème", css: "color-mix(in srgb, var(--primary-end) 70%, var(--text-primary))" },
  { id: "gold", label: "Doré", css: "color-mix(in srgb, var(--primary-start) 45%, var(--text-primary))" },
  { id: "muted", label: "Gris doux", css: "var(--text-secondary)" },
];

const COLOR_BY_ID = new Map(RICH_TEXT_COLORS.map((color) => [color.id, color]));

export function getRichTextColor(id: string | null | undefined): RichTextColor | undefined {
  return id ? COLOR_BY_ID.get(id) : undefined;
}

export type RichTextMark = "strong" | "em" | "u" | "color";

export type RichTextNode =
  | { type: "text"; text: string }
  | { type: "br" }
  | { type: "mark"; mark: RichTextMark; color?: string; children: RichTextNode[] };

const TAG_PATTERN = /<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi;
const MARK_BY_TAG: Record<string, Exclude<RichTextMark, "color">> = {
  strong: "strong",
  b: "strong",
  em: "em",
  i: "em",
  u: "u",
};
const BLOCK_TAGS = new Set(["p", "div"]);

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(?:amp|lt|gt|quot|nbsp|#39|#x27);/g, (entity) => ENTITIES[entity] ?? entity);
}

function pushText(target: RichTextNode[], raw: string) {
  const parts = decodeEntities(raw).split("\n");
  parts.forEach((part, index) => {
    if (index > 0) target.push({ type: "br" });
    if (part) target.push({ type: "text", text: part });
  });
}

/**
 * Transforme la valeur stockee en arbre de noeuds autorises.
 * Toute balise hors liste est ignoree (son texte est conserve) : aucun HTML arbitraire.
 */
export function parseRichText(value: string | null | undefined): RichTextNode[] {
  if (!value) return [];

  const root: RichTextNode[] = [];
  const stack: Array<{ tag: string; children: RichTextNode[] }> = [{ tag: "#root", children: root }];
  let lastIndex = 0;
  let hasBlockContent = false;

  const current = () => stack[stack.length - 1].children;

  for (const match of value.matchAll(TAG_PATTERN)) {
    const [fullTag, rawName, attributes] = match;
    const tag = rawName.toLowerCase();
    const isClosing = fullTag.startsWith("</");

    pushText(current(), value.slice(lastIndex, match.index));
    lastIndex = (match.index ?? 0) + fullTag.length;

    if (tag === "br") {
      current().push({ type: "br" });
      continue;
    }

    // Paragraphes (texte colle) : aplatis en sauts de ligne pour rester "en ligne".
    if (BLOCK_TAGS.has(tag)) {
      if (!isClosing && hasBlockContent) current().push({ type: "br" });
      if (isClosing) hasBlockContent = true;
      continue;
    }

    const mark = tag === "span" ? "color" : MARK_BY_TAG[tag];
    if (!mark) continue;

    if (isClosing) {
      const openIndex = stack.map((entry) => entry.tag).lastIndexOf(tag);
      if (openIndex > 0) stack.length = openIndex;
      continue;
    }

    const color = mark === "color" ? /data-color\s*=\s*["']([a-z-]+)["']/i.exec(attributes)?.[1] : undefined;
    const node: RichTextNode = { type: "mark", mark, color: getRichTextColor(color)?.id, children: [] };
    current().push(node);
    stack.push({ tag, children: node.children });
  }

  pushText(current(), value.slice(lastIndex));
  return root;
}

function nodesToPlainText(nodes: RichTextNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text") return node.text;
      if (node.type === "br") return " ";
      return nodesToPlainText(node.children);
    })
    .join("");
}

/** Texte sans mise en forme : pour les attributs (alt, title) et les metadonnees SEO. */
export function toPlainText(value: string | null | undefined): string {
  return nodesToPlainText(parseRichText(value)).replace(/\s+/g, " ").trim();
}

/** Vrai si le texte contient au moins un caractere visible. */
export function hasRichText(value: string | null | undefined): boolean {
  return toPlainText(value) !== "";
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Prepare une valeur (texte brut ancien ou HTML) pour l'editeur. */
export function toEditorHtml(value: string | null | undefined): string {
  if (!value) return "";
  const nodes = parseRichText(value);

  function render(list: RichTextNode[]): string {
    return list
      .map((node) => {
        if (node.type === "text") return escapeHtml(node.text);
        if (node.type === "br") return "<br>";
        const inner = render(node.children);
        if (node.mark === "color") return node.color ? `<span data-color="${node.color}">${inner}</span>` : inner;
        return `<${node.mark}>${inner}</${node.mark}>`;
      })
      .join("");
  }

  return `<p>${render(nodes)}</p>`;
}

/** Nettoie la sortie de l'editeur : fragment en ligne, "" si vide. */
export function fromEditorHtml(html: string): string {
  const inline = html
    // Le style n'est utile qu'a l'affichage dans l'editeur : seule data-color est stockee.
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/<\/p>\s*<p[^>]*>/gi, "<br>")
    .replace(/^<p[^>]*>|<\/p>$/gi, "")
    .replace(/(<br\s*\/?>)+$/i, "");

  return hasRichText(inline) ? inline : "";
}
