import type { PageSection } from "@/lib/api-admin";
import { getRichTextColor, hasRichText, parseRichText, RICH_TEXT_COLORS, type RichTextNode } from "@/lib/richText";
import { formatPrice, parsePrice } from "@/lib/servicePrice";

type Content = Record<string, unknown>;
type RuleStyles = Record<string, string>;

const FROM_LAPTOP = "(max-width: 1279px)";
const FROM_TABLET = "(max-width: 1023px)";
const FROM_MOBILE = "(max-width: 767px)";
const FROM_SMALL = "(max-width: 639px)";

const HEADING_FONT = "var(--font-heading), var(--font-serif), serif";
const ACCENT_TINT = "color-mix(in srgb, var(--primary-start) 10%, transparent)";
const ACCENT_BORDER = "2px solid color-mix(in srgb, var(--primary-start) 40%, transparent)";
const PANEL_BORDER = "1px solid color-mix(in srgb, var(--card-border) 60%, transparent)";
const SOFT_ICON_BORDER = "1px solid color-mix(in srgb, var(--primary-start) 20%, transparent)";

const blockTitle: RuleStyles = {
  "font-family": HEADING_FONT,
  "font-size": "clamp(2rem, 4vw, 3.5rem)",
  "font-weight": "400",
  "line-height": "1.2",
  "letter-spacing": "var(--tracking-title)",
  color: "var(--text-primary)",
  margin: "0",
};
const blockBody: RuleStyles = {
  "font-family": "var(--font-sans), sans-serif",
  "font-size": "clamp(0.9375rem, 1.5vw, 1.0625rem)",
  "font-weight": "400",
  "line-height": "1.65",
  "letter-spacing": "var(--tracking-text)",
  color: "var(--text-secondary)",
  margin: "0",
};
const cardTitle: RuleStyles = {
  "font-family": HEADING_FONT,
  "font-size": "clamp(1.25rem, 2.4vw, 1.75rem)",
  "font-weight": "400",
  "line-height": "1.25",
  "letter-spacing": "var(--tracking-title)",
  color: "var(--text-primary)",
  margin: "0",
};
const blockQuote: RuleStyles = {
  "font-family": HEADING_FONT,
  "font-size": "clamp(1.125rem, 2.4vw, 1.5rem)",
  "font-weight": "400",
  "font-style": "italic",
  "line-height": "1.5",
  "letter-spacing": "var(--tracking-text)",
  color: "var(--text-secondary)",
  margin: "0",
};
const eyebrow: RuleStyles = {
  color: "color-mix(in srgb, var(--primary-start) 45%, var(--text-primary))",
  "font-size": "0.75rem",
  "font-weight": "600",
  "line-height": "1.4",
  "letter-spacing": "var(--tracking-eyebrow)",
  "text-transform": "uppercase",
  margin: "0",
};
const coverImage: RuleStyles = { display: "block", width: "100%", height: "100%", "object-fit": "cover" };
const iconDisc: RuleStyles = {
  display: "flex",
  "align-items": "center",
  "justify-content": "center",
  "border-radius": "9999px",
  border: SOFT_ICON_BORDER,
  background: ACCENT_TINT,
  color: "var(--primary-start)",
};

/** Mirrors the look of the React sections, as GrapesJS CSS so that the editor can change it. */
export const SECTION_RULES: Record<string, RuleStyles> = {
  ".hm-s-title": blockTitle,
  ".hm-s-body": blockBody,
  ".hm-s-card-title": cardTitle,
  ".hm-s-quote": blockQuote,
  ".hm-s-eyebrow": eyebrow,
  ".hm-s-line": { width: "4rem", height: "1px", background: "var(--primary-start)" },

  ".hm-banner": { position: "relative", display: "flex", "align-items": "flex-start", "justify-content": "center", width: "100%", "min-height": "80vh", padding: "0 3rem", "letter-spacing": "var(--tracking-banner)", "text-align": "center", "border-radius": "1.5rem", overflow: "hidden" },
  ".hm-banner-inner": { display: "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", width: "100%", "min-height": "65vh", "max-width": "56rem", padding: "3rem 0", color: "var(--color-text-primary)" },
  ".hm-banner-title": { "font-family": "var(--font-serif), serif", "font-size": "4.5rem", "font-weight": "200", "line-height": "0.95", margin: "1.5rem 0 0", color: "inherit" },
  ".hm-banner-subtitle": { "font-size": "1.125rem", "line-height": "1.75rem", margin: "1rem 0 0", opacity: "0.9", color: "inherit" },
  ".hm-banner-slide": { "font-size": "1.875rem", "line-height": "2.25rem", margin: "1.25rem 0 0", opacity: "0.9", color: "inherit" },
  ".hm-banner-text": { "font-size": "1.125rem", "line-height": "1.75rem", "max-width": "42rem", margin: "1.75rem 0 0", opacity: "0.8", color: "inherit" },
  ".hm-banner-button": { display: "inline-flex", "margin-top": "2.5rem", padding: ".75rem 1.75rem", "border-radius": "9999px", color: "var(--text-primary)", "font-size": "0.875rem", "line-height": "1.25rem", "font-weight": "600", "letter-spacing": "0.1em", "text-transform": "uppercase", "text-decoration": "none" },

  ".hm-compact": { position: "relative", padding: "5rem 0", "letter-spacing": "var(--tracking-banner)" },
  ".hm-compact-inner": { "max-width": "80rem", margin: "0 auto", padding: "0 1.5rem", color: "#ffffff" },
  ".hm-compact-title": { "font-family": HEADING_FONT, "font-size": "clamp(2.5rem, 5vw, 4.5rem)", "font-weight": "400", "line-height": "1.1", "letter-spacing": "-0.02em", margin: "0", color: "inherit" },
  ".hm-compact-text": { "font-size": "1.25rem", margin: "1rem 0 0", opacity: "0.9", color: "inherit" },

  ".hm-duo": { display: "grid", "grid-template-columns": "repeat(2, minmax(0, 1fr))", gap: "2.5rem", "margin-top": "5rem", "margin-bottom": "2.5rem" },
  ".hm-duo--presentation": { "grid-template-columns": "minmax(0, 1fr) 28rem", gap: "4rem", "align-items": "center", "margin-top": "4rem", "margin-bottom": "0" },
  ".hm-duo-text": { display: "flex", "flex-direction": "column", gap: "1.5rem", "min-width": "0" },
  ".hm-note": { padding: "1rem 1.25rem", "border-left": ACCENT_BORDER, background: ACCENT_TINT, "border-radius": "0 .75rem .75rem 0" },
  ".hm-note-title": { "margin-bottom": ".5rem" },
  ".hm-note-list": { display: "flex", "flex-direction": "column", gap: ".5rem", margin: "0", padding: "0", "list-style": "none" },
  ".hm-portrait": { width: "100%", "max-width": "28rem", margin: "0 auto", "aspect-ratio": "3 / 4", overflow: "hidden", "border-radius": "1rem", border: PANEL_BORDER },
  ".hm-cover": coverImage,
  ".hm-collage": { display: "grid", "grid-template-columns": "repeat(2, minmax(0, 1fr))", "grid-template-rows": "repeat(2, minmax(0, 1fr))", gap: ".75rem", height: "500px", "min-width": "0" },
  ".hm-collage--single": { "grid-template-columns": "minmax(0, 1fr)", "grid-template-rows": "minmax(0, 1fr)" },
  ".hm-collage-img": { ...coverImage, "min-height": "0", "border-radius": "1rem", border: PANEL_BORDER },

  ".hm-offers": { "margin-top": "5rem" },
  ".hm-centered": { "max-width": "48rem", margin: "0 auto", "text-align": "center" },
  ".hm-centered-line": { width: "6rem", height: "1px", margin: "0 auto 1.5rem", background: "var(--primary-start)" },
  ".hm-centered-text": { "margin-top": "1.25rem" },
  ".hm-offer-grid": { display: "grid", "grid-template-columns": "repeat(3, minmax(0, 1fr))", gap: "2rem", "max-width": "72rem", margin: "3rem auto 0" },
  ".hm-offer-grid--2": { "grid-template-columns": "repeat(2, minmax(0, 1fr))", "max-width": "48rem" },
  ".hm-offer-grid--1": { "grid-template-columns": "minmax(0, 1fr)", "max-width": "36rem" },
  ".hm-offer": { display: "flex", "flex-direction": "column", height: "100%", padding: "2.5rem", "border-radius": "24px", border: "1px solid color-mix(in srgb, var(--primary-start) 15%, transparent)", background: "color-mix(in srgb, var(--card-bg) 90%, transparent)", "box-shadow": "0 20px 25px -5px rgb(0 0 0 / 0.03)" },
  ".hm-offer-eyebrow": { "margin-bottom": ".75rem" },
  ".hm-offer-line": { width: "4rem", height: "1px", margin: "1.25rem 0", background: "linear-gradient(to right, var(--primary-start), transparent)" },
  ".hm-offer-text": { "flex-grow": "1" },
  ".hm-offer-prices": { display: "flex", "flex-direction": "column", gap: ".75rem", "margin-top": "2rem" },
  ".hm-offer-price": { display: "flex", "align-items": "center", "justify-content": "space-between", padding: "1rem 1.25rem", "border-radius": "1rem", border: "1px solid var(--card-border)", background: "color-mix(in srgb, var(--background-alt) 80%, transparent)" },
  ".hm-offer-price-label": { "font-weight": "500" },
  ".hm-offer-price-value": { "font-size": "1.5rem", "font-weight": "600", color: "var(--primary-start)" },
  ".hm-offer-price-unit": { "margin-left": ".25rem" },
  ".hm-offer-button": { display: "flex", "align-items": "center", "justify-content": "center", "margin-top": "2rem", padding: "1rem 2rem", "border-radius": "9999px", background: "var(--btn-bg)", color: "var(--btn-text)", "font-size": "0.875rem", "font-weight": "600", "text-decoration": "none", "box-shadow": "0 10px 15px -3px color-mix(in srgb, var(--primary-start) 20%, transparent)" },

  ".hm-cta": { padding: "8rem 0", background: "var(--gradient-primary)" },
  ".hm-cta-inner": { "max-width": "56rem", margin: "0 auto", padding: "0 1.5rem", "text-align": "center" },
  ".hm-cta-title": { ...blockTitle, color: "var(--color-text-on-gradient)", "margin-bottom": "1.5rem" },
  ".hm-cta-text": { ...blockBody, color: "color-mix(in srgb, var(--color-text-on-gradient) 88%, transparent)", "max-width": "42rem", margin: "0 auto 2rem" },
  ".hm-cta-button": { display: "inline-flex", padding: "1rem 2rem", "border-radius": "9999px", background: "var(--card-bg)", color: "var(--text-primary)", "font-weight": "500", "text-decoration": "none" },

  ".hm-prose": { "max-width": "56rem", margin: "0 auto", padding: "4rem 1.5rem" },
  ".hm-prose-title": { "margin-bottom": "2rem" },
  ".hm-prose-columns": { display: "grid", "grid-template-columns": "repeat(2, minmax(0, 1fr))", gap: "2rem", "align-items": "center" },
  ".hm-prose-text": { display: "flex", "flex-direction": "column", gap: "1rem", "min-width": "0" },
  ".hm-landscape": { "aspect-ratio": "4 / 3", overflow: "hidden", "border-radius": "1rem" },
  ".hm-figure": { margin: "0" },
  ".hm-wide-image": { "aspect-ratio": "16 / 9", overflow: "hidden", "border-radius": "1rem" },
  ".hm-caption": { "margin-top": "1rem", "text-align": "center" },

  ".hm-spacer-xs": { height: "1.5rem" },
  ".hm-spacer-sm": { height: "2.5rem" },
  ".hm-spacer-md": { height: "4rem" },
  ".hm-spacer-lg": { height: "7rem" },
  ".hm-spacer-xl": { height: "10rem" },

  ".hm-company": { "padding-top": "0", "border-top": "1px solid var(--card-border)", display: "flex", "flex-direction": "column", gap: "4rem" },
  ".hm-company-head": { display: "flex", "flex-direction": "column", gap: "1.5rem", "text-align": "center" },
  ".hm-company-line": { width: "3rem", height: "1px", margin: "0 auto", background: "color-mix(in srgb, var(--primary-start) 60%, transparent)" },
  ".hm-company-text": { "max-width": "48rem", margin: "0 auto" },
  ".hm-company-grid": { display: "grid", "grid-template-columns": "repeat(2, minmax(0, 1fr))", gap: "4rem", width: "100%", "max-width": "64rem", margin: "0 auto", "align-items": "start" },
  ".hm-company-card": { padding: "2.5rem", border: "1px solid var(--card-border)", background: "var(--card-bg)" },
  ".hm-company-icon": { ...iconDisc, width: "3.5rem", height: "3.5rem", margin: "0 auto 2rem", "font-size": "1.5rem" },
  ".hm-company-card-title": { "margin-bottom": "2rem", "text-align": "center" },
  ".hm-check-list": { display: "flex", "flex-direction": "column", gap: "1rem", margin: "0", padding: "0", "list-style": "none" },
  ".hm-check": { display: "flex", "align-items": "flex-start", gap: ".75rem" },
  ".hm-check-mark": { "flex-shrink": "0", color: "color-mix(in srgb, var(--primary-start) 60%, transparent)" },
  ".hm-company-facts": { width: "100%", "max-width": "56rem", margin: "0 auto", padding: "3rem", border: "2px solid color-mix(in srgb, var(--primary-start) 30%, transparent)", background: "var(--card-bg)" },
  ".hm-fact-list": { display: "flex", "flex-wrap": "wrap", "align-items": "center", "justify-content": "center", gap: "2rem" },
  ".hm-fact": { display: "flex", "flex-direction": "column", "align-items": "center", gap: ".5rem" },
  ".hm-fact-icon": { ...iconDisc, width: "4rem", height: "4rem", "font-size": "1.5rem" },
  ".hm-company-rule": { width: "6rem", height: "1px", margin: "2rem auto", background: "color-mix(in srgb, var(--primary-start) 30%, transparent)" },
  ".hm-company-quote": { "max-width": "42rem", margin: "0 auto", "text-align": "center" },

  ".hm-services": { padding: "8rem 0" },
  ".hm-services-inner": { "max-width": "80rem", margin: "0 auto", padding: "0 1.5rem" },
  ".hm-services-head": { "margin-bottom": "4rem", "text-align": "center" },
  ".hm-services-eyebrow": { "margin-bottom": "1rem" },
  ".hm-services-grid": { display: "grid", "grid-template-columns": "repeat(3, minmax(0, 1fr))", gap: "2rem" },
  ".hm-services-grid--2": { "grid-template-columns": "repeat(2, minmax(0, 1fr))", "max-width": "48rem", margin: "0 auto" },
  ".hm-services-grid--1": { "grid-template-columns": "minmax(0, 1fr)", "max-width": "28rem", margin: "0 auto" },
  ".hm-service": { height: "100%", overflow: "hidden", "border-radius": "var(--card-radius)", "box-shadow": "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  ".hm-service-image": { "aspect-ratio": "4 / 3", overflow: "hidden" },
  ".hm-service-body": { padding: "1.5rem" },
  ".hm-service-meta": { "margin-bottom": ".75rem", "font-size": "0.875rem", color: "var(--text-secondary)" },
  ".hm-service-price": { "font-weight": "500", color: "var(--primary-start)" },
  ".hm-service-title": { "margin-bottom": ".5rem" },
  ".hm-service-text": { "margin-bottom": "1rem", display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden" },
  ".hm-service-link": { display: "inline-flex", gap: ".5rem", "font-size": "0.875rem", "font-weight": "500", color: "var(--text-primary)", "text-decoration": "none" },

  ".hm-reviews": { padding: "5rem 1.5rem", background: "radial-gradient(circle at top left, color-mix(in srgb, var(--primary-start) 15%, transparent), transparent 42%)" },
  ".hm-reviews-inner": { "max-width": "72rem", margin: "0 auto" },
  ".hm-reviews-head": { display: "grid", "grid-template-columns": "minmax(0, 0.8fr) minmax(0, 2fr)", gap: "2rem", "align-items": "end" },
  ".hm-reviews-title": { "margin-top": ".75rem" },
  ".hm-reviews-text": { "margin-top": "1rem", "max-width": "36rem" },
  ".hm-reviews-score": { display: "flex", "flex-wrap": "wrap", "align-items": "center", "justify-content": "flex-end", gap: ".75rem 1.25rem" },
  ".hm-stars": { color: "#fbbf24", "font-size": "1.125rem", "line-height": "1", "letter-spacing": ".1em", margin: "0" },
  ".hm-review-top": { display: "flex", "align-items": "flex-start", "justify-content": "space-between", gap: "1rem" },
  ".hm-review-mark": { "font-family": HEADING_FONT, "font-size": "2.5rem", "line-height": "1", color: "var(--primary-start)", opacity: "0.45" },
  ".hm-reviews-count": { "margin-top": ".25rem" },
  ".hm-reviews-grid": { display: "grid", "grid-template-columns": "repeat(3, minmax(0, 1fr))", gap: "1.25rem", "margin-top": "2.5rem" },
  ".hm-review": { display: "flex", "flex-direction": "column", "min-height": "16rem", padding: "1.75rem", "border-radius": "1.5rem", border: PANEL_BORDER, background: "color-mix(in srgb, var(--background-alt) 55%, transparent)" },
  ".hm-review-text": { "margin-top": "1.5rem", "flex-grow": "1" },
  ".hm-review-footer": { "margin-top": "1.75rem", "padding-top": "1.25rem", "border-top": "1px solid var(--card-border)" },
  ".hm-review-name": { "font-weight": "500", color: "var(--text-primary)", margin: "0" },
  ".hm-review-date": { "margin-top": ".25rem" },
  ".hm-reviews-more": { "margin-top": "2.5rem", "text-align": "center" },
  ".hm-reviews-button": { display: "inline-flex", padding: ".75rem 1.75rem", "border-radius": "9999px", background: "var(--btn-bg)", color: "var(--btn-text)", "font-weight": "500", "text-decoration": "none" },

  ".hm-frame-pt-sm": { "padding-top": "1.5rem" },
  ".hm-frame-pt-md": { "padding-top": "3rem" },
  ".hm-frame-pt-lg": { "padding-top": "5rem" },
  ".hm-frame-pb-sm": { "padding-bottom": "1.5rem" },
  ".hm-frame-pb-md": { "padding-bottom": "3rem" },
  ".hm-frame-pb-lg": { "padding-bottom": "5rem" },
  ".hm-frame-wide": { "max-width": "80rem", margin: "0 auto", "padding-left": "1.5rem", "padding-right": "1.5rem" },
  ".hm-frame-normal": { "max-width": "64rem", margin: "0 auto", "padding-left": "1.5rem", "padding-right": "1.5rem" },
  ".hm-frame-narrow": { "max-width": "48rem", margin: "0 auto", "padding-left": "1.5rem", "padding-right": "1.5rem" },
  ".hm-frame-r-md": { "border-radius": "1rem" },
  ".hm-frame-r-lg": { "border-radius": "1.5rem" },
  ".hm-frame-surface": { overflow: "hidden", padding: "2rem", background: "var(--card-bg)", border: "1px solid var(--card-border)" },
  ".hm-frame-accent": { overflow: "hidden", padding: "2rem", background: "linear-gradient(135deg, color-mix(in srgb, var(--primary-start) 18%, transparent), color-mix(in srgb, var(--primary-end) 12%, transparent))" },
  ".hm-frame-soft": { overflow: "hidden", padding: "2rem", background: "color-mix(in srgb, var(--primary-start) 8%, transparent)" },

  ...Object.fromEntries(RICH_TEXT_COLORS.map(({ id, css }) => [`.hm-color-${id}`, { color: css }])),
};

export const SECTION_MEDIA_RULES: Record<string, Record<string, RuleStyles>> = {
  [FROM_LAPTOP]: {
    ".hm-duo--presentation": { "grid-template-columns": "3fr 2fr" },
    ".hm-offer-grid": { "grid-template-columns": "repeat(2, minmax(0, 1fr))", "max-width": "48rem" },
    ".hm-offer-grid--1": { "grid-template-columns": "minmax(0, 1fr)", "max-width": "36rem" },
  },
  [FROM_TABLET]: {
    ".hm-duo": { "grid-template-columns": "minmax(0, 1fr)" },
    ".hm-duo--presentation": { "grid-template-columns": "3fr 2fr", gap: "2.5rem" },
    ".hm-collage": { display: "block", height: "auto" },
    ".hm-collage-img": { "aspect-ratio": "4 / 3", height: "auto" },
    ".hm-collage-img:not(:first-child)": { display: "none" },
    ".hm-reviews-head": { "grid-template-columns": "minmax(0, 1fr)" },
    ".hm-reviews-score": { "justify-content": "flex-start" },
    ".hm-company": { "padding-top": "7rem" },
    ".hm-fact": { width: "50%" },
    ".hm-fact-list": { gap: "2rem 0" },
  },
  [FROM_MOBILE]: {
    ".hm-banner": { "min-height": "calc(100svh - 109px)", padding: "0 1.5rem" },
    ".hm-banner-inner": { "min-height": "0", "justify-content": "flex-start", padding: "5rem 0 2rem" },
    ".hm-banner-title": { "font-size": "3rem" },
    ".hm-banner-subtitle": { "font-size": "1rem", "line-height": "1.5rem" },
    ".hm-banner-slide": { "font-size": "1.25rem", "line-height": "1.75rem" },
    ".hm-duo--presentation": { "grid-template-columns": "minmax(0, 1fr)" },
    ".hm-portrait": { "aspect-ratio": "4 / 3" },
    ".hm-offer-grid": { "grid-template-columns": "minmax(0, 1fr)" },
    ".hm-offer": { padding: "2rem" },
    ".hm-cta": { padding: "6rem 0" },
    ".hm-prose-columns": { "grid-template-columns": "minmax(0, 1fr)" },
    ".hm-company-grid": { "grid-template-columns": "minmax(0, 1fr)" },
    ".hm-services": { padding: "6rem 0" },
    ".hm-services-grid": { "grid-template-columns": "minmax(0, 1fr)" },
    ".hm-reviews-grid": { "grid-template-columns": "minmax(0, 1fr)" },
    ".hm-frame-surface": { padding: "1.5rem" },
    ".hm-frame-accent": { padding: "1.5rem" },
    ".hm-frame-soft": { padding: "1.5rem" },
    ".hm-duo-first-mobile": { order: "-1" },
  },
  [FROM_SMALL]: {
    ".hm-banner": { padding: "0 1rem" },
    ".hm-duo": { "padding-left": "1.25rem", "padding-right": "1.25rem" },
    ".hm-offers": { "padding-left": "1.25rem", "padding-right": "1.25rem" },
    ".hm-company": { "padding-left": "1.25rem", "padding-right": "1.25rem" },
  },
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nodesToHtml(nodes: RichTextNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text") return escapeHtml(node.text);
      if (node.type === "br") return "<br>";

      const inner = nodesToHtml(node.children);
      if (node.mark === "color") {
        return getRichTextColor(node.color) ? `<span class="hm-color-${node.color}">${inner}</span>` : inner;
      }
      return `<${node.mark}>${inner}</${node.mark}>`;
    })
    .join("");
}

function rich(value: unknown): string {
  return typeof value === "string" ? nodesToHtml(parseRichText(value)) : "";
}

function filled(value: unknown): boolean {
  return typeof value === "string" && hasRichText(value);
}

function tag(name: string, classes: string, value: unknown): string {
  return filled(value) ? `<${name} class="${classes}">${rich(value)}</${name}>` : "";
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function richList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(filled) : [];
}

function records(value: unknown): Content[] {
  return Array.isArray(value) ? value.filter((item): item is Content => typeof item === "object" && item !== null) : [];
}

function image(path: string, classes = "hm-cover", alt = ""): string {
  return `<img class="${classes}" src="${escapeHtml(path)}" alt="${escapeHtml(alt)}">`;
}

/** External links open as they did, but only the schemes the public site accepts are kept. */
function link(classes: string, href: string, label: string, newTab = false): string {
  const safeHref = /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : "/contact";
  const targetAttributes = newTab ? ` target="_blank" rel="noopener noreferrer"` : "";
  return `<a class="${classes}" href="${escapeHtml(safeHref)}"${targetAttributes}>${label}</a>`;
}

function clampedNumber(value: unknown, fallback: number, max: number): number {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(max, parsed)) : fallback;
}

function cssColor(value: string): string {
  return /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]+)$/i.test(value.trim()) ? value.trim() : "";
}

function backgroundStyle(content: Content, imagePath: string, overlay: string): string {
  if (imagePath) {
    return `background:linear-gradient(${overlay}, ${overlay}), url(${imagePath}) center/cover no-repeat`;
  }

  const start = cssColor(text(content.gradientStart)) || "var(--primary-start)";
  const end = cssColor(text(content.gradientEnd)) || "var(--primary-end)";
  return `background:linear-gradient(135deg, ${start}, ${end})`;
}

function heroHome(content: Content): string {
  const slides = records(content.slides);
  const imagedSlides = slides.filter((slide) => text(slide.image));
  const backgroundType = text(content.backgroundType) || "image";

  // Plusieurs images : le diaporama reste un composant du site, qui les fait défiler.
  if (backgroundType === "image" && imagedSlides.length > 1) {
    return `<section data-dynamic="hero-slider" data-slides="${escapeHtml(JSON.stringify(slides))}"></section>`;
  }

  const slide = imagedSlides[0] ?? slides[0] ?? {};
  const isTransparent = backgroundType === "transparent";
  const opacity = clampedNumber(content.overlayOpacity, 45, 90) / 100;
  const hasImage = backgroundType === "image" && imagedSlides.length > 0;
  const overlay = `rgba(0, 0, 0, ${hasImage ? opacity : opacity * 0.35})`;
  const sectionStyle = isTransparent ? "" : ` style="${escapeHtml(backgroundStyle(content, hasImage ? text(slide.image) : "", overlay))}"`;

  const configuredColor = cssColor(text(content.textColor));
  const isLightColor = ["#ffffff", "#fff", "#f5f5f4"].includes(configuredColor.toLowerCase());
  const color = isTransparent && (isLightColor || !configuredColor) ? "" : configuredColor || "#f5f5f4";
  const innerStyle = color ? ` style="color:${color}"` : "";
  const siteTitle = content.siteTitle ?? "Les Massages d'Helene";
  const button = text(content.buttonText);

  return `<section class="hm-banner"${sectionStyle}><div class="hm-banner-inner"${innerStyle}>${tag("h1", "hm-banner-title", siteTitle)}${tag("p", "hm-banner-subtitle", content.siteSubtitle)}${tag("p", "hm-banner-slide", slide.title)}${tag("p", "hm-banner-text", slide.subtitle)}${button ? link("hm-banner-button", text(content.buttonLink) || "/contact", escapeHtml(button)) : ""}</div></section>`;
}

function heroCompact(content: Content): string {
  const backgroundType = text(content.backgroundType) || "image";
  const imagePath = backgroundType === "image" ? text(content.image) : "";
  const opacity = clampedNumber(content.overlayOpacity, 45, 90) / 100;
  const overlay = `rgba(0, 0, 0, ${imagePath ? opacity : opacity * 0.4})`;
  const sectionStyle = backgroundType === "transparent" ? "" : ` style="${escapeHtml(backgroundStyle(content, imagePath, overlay))}"`;
  const color = cssColor(text(content.textColor));
  const innerStyle = backgroundType === "transparent" ? ` style="color:var(--color-text-primary)"` : color ? ` style="color:${color}"` : "";

  return `<section class="hm-compact"${sectionStyle}><div class="hm-compact-inner"${innerStyle}>${tag("h1", "hm-compact-title", content.title)}${tag("p", "hm-compact-text", content.subtitle)}</div></section>`;
}

function mobileFirstClass(content: Content, position: "text" | "media", mediaFirstByDefault: boolean): string {
  const layout = (content._appearance as { layout?: { mobileOrder?: string } } | undefined)?.layout;
  const mediaFirst = layout?.mobileOrder === "image-first" ? true : layout?.mobileOrder === "text-first" ? false : mediaFirstByDefault;
  return mediaFirst === (position === "media") ? " hm-duo-first-mobile" : "";
}

function presentation(content: Content): string {
  const title = content.title ?? "Presentation";
  const paragraphs = richList(content.paragraphs).map((paragraph) => tag("p", "hm-s-body", paragraph)).join("");
  const quote = tag("blockquote", "hm-s-quote hm-note", content.quote);
  const picture = text(content.image) ? image(text(content.image)) : "";

  return `<section class="hm-duo hm-duo--presentation"><div class="hm-duo-text${mobileFirstClass(content, "text", false)}"><div class="hm-s-line"></div>${tag("h2", "hm-s-title", title)}${paragraphs}${quote}</div><div class="hm-portrait${mobileFirstClass(content, "media", false)}">${picture}</div></section>`;
}

function approche(content: Content): string {
  const sources = (Array.isArray(content.images) ? content.images : []).filter((source): source is string => typeof source === "string" && source !== "");
  const images = (sources.length > 0 ? sources : text(content.image) ? [text(content.image)] : []).slice(0, 4);
  const title = filled(content.title) ? content.title : "Approche";
  const bulletsTitle = content.bulletsTitle ?? "Ce qui guide mes mains :";
  const bullets = richList(content.bullets);
  const quote = content.quote ?? "Chaque soin est pense comme une pause pour vous recentrer et vous alleger.";
  const list = bullets.length > 0 ? `<ul class="hm-note-list hm-s-body">${bullets.map((bullet) => `<li>• ${rich(bullet)}</li>`).join("")}</ul>` : "";
  const note = filled(bulletsTitle) || list ? `<div class="hm-note">${tag("h3", `hm-s-card-title${list ? " hm-note-title" : ""}`, bulletsTitle)}${list}</div>` : "";
  const collageClass = `hm-collage${images.length === 1 ? " hm-collage--single" : ""}${mobileFirstClass(content, "media", true)}`;

  return `<section class="hm-duo"><div class="${collageClass}">${images.map((path) => image(path, "hm-collage-img")).join("")}</div><div class="hm-duo-text${mobileFirstClass(content, "text", true)}"><div class="hm-s-line"></div>${tag("h2", "hm-s-title", title)}${note}${tag("p", "hm-s-quote", quote)}</div></section>`;
}

function offerPrice(raw: string): string {
  const { label, price, unit } = parsePrice(raw);
  const value = typeof price === "number" ? formatPrice(price) : "";
  const unitHtml = unit ? `<span class="hm-s-body hm-offer-price-unit">/ ${escapeHtml(unit)}</span>` : "";

  return `<div class="hm-offer-price"><span class="hm-s-body hm-offer-price-label">${escapeHtml(label)}</span><span class="hm-offer-price-value">${value}${unitHtml}</span></div>`;
}

function tarifs(content: Content): string {
  const offers = records(content.offers).filter((offer) => filled(offer.title) || filled(offer.description));
  const hasBookingField = Object.prototype.hasOwnProperty.call(content, "bookingLink");
  const customLink = text(content.bookingLink).trim();
  const showButton = hasBookingField ? customLink.length > 0 : true;
  const newTab = String(content.bookingLinkNewTab ?? "false") === "true";
  const gridClass = offers.length === 1 ? " hm-offer-grid--1" : offers.length === 2 ? " hm-offer-grid--2" : "";

  const cards = offers.map((offer) => {
    const prices = (Array.isArray(offer.prices) ? offer.prices : []).filter((price): price is string => typeof price === "string" && price.trim() !== "");
    const pricesHtml = prices.length > 0 ? `<div class="hm-offer-prices">${prices.map(offerPrice).join("")}</div>` : "";
    const button = showButton ? link("hm-offer-button", customLink || "/reservation", "Réserver ce soin", newTab) : "";

    return `<article class="hm-offer">${tag("p", "hm-s-eyebrow hm-offer-eyebrow", content.title)}${tag("h3", "hm-s-card-title", offer.title)}<div class="hm-offer-line"></div><p class="hm-s-body hm-offer-text">${rich(offer.description)}</p>${pricesHtml}${button}</article>`;
  });

  return `<section class="hm-offers"><div class="hm-centered"><div class="hm-centered-line"></div>${tag("h2", "hm-s-title", content.title)}${tag("p", "hm-s-body hm-centered-text", content.subtitle)}</div><div class="hm-offer-grid${gridClass}">${cards.join("")}</div></section>`;
}

function contactCta(content: Content): string {
  const title = content.title ?? "Pret(e) a vous offrir une pause bien-etre ?";
  const subtitle = content.subtitle ?? "Reservez votre seance et decouvrez les bienfaits d'un massage personnalise";
  const button = text(content.buttonText ?? "Prendre rendez-vous").trim();

  return `<section class="hm-cta"><div class="hm-cta-inner">${tag("h2", "hm-cta-title", title)}${tag("p", "hm-cta-text", subtitle)}${button ? link("hm-cta-button", text(content.buttonLink).trim() || "/contact", escapeHtml(button)) : ""}</div></section>`;
}

function textSection(content: Content): string {
  const paragraphs = richList(content.paragraphs).map((paragraph) => tag("p", "", paragraph).replace(' class=""', "")).join("");
  const body = paragraphs ? `<div class="hm-prose-text hm-s-body">${paragraphs}</div>` : "";
  const picture = text(content.image) ? `<div class="hm-landscape">${image(text(content.image))}</div>` : "";

  return `<section class="hm-prose">${tag("h2", "hm-s-title hm-prose-title", content.title)}${picture ? `<div class="hm-prose-columns">${picture}${body}</div>` : body}</section>`;
}

function imageSection(content: Content): string {
  if (!text(content.image)) return "";
  return `<section class="hm-prose"><figure class="hm-figure"><div class="hm-wide-image">${image(text(content.image), "hm-cover", text(content.alt))}</div>${tag("figcaption", "hm-s-body hm-caption", content.caption)}</figure></section>`;
}

function spacer(content: Content): string {
  const size = ["xs", "sm", "md", "lg", "xl"].includes(text(content.size)) ? text(content.size) : "md";
  return `<div class="hm-spacer-${size}"></div>`;
}

function benefitsCard(icon: string, title: unknown, items: unknown): string {
  const list = richList(items).map((item) => `<li class="hm-check"><span class="hm-check-mark">✓</span><span>${rich(item)}</span></li>`).join("");
  return `<div class="hm-company-card"><div class="hm-company-icon">${icon}</div>${tag("h3", "hm-s-card-title hm-company-card-title", title)}${list ? `<ul class="hm-check-list hm-s-body">${list}</ul>` : ""}</div>`;
}

function entreprise(content: Content): string {
  const defaults = ["10-20 min", "Dans vos locaux", "Sans huile", "Chaise ergo"];
  const facts = richList(content.characteristics);
  const icons = ["◷", "⌂", "✓", "✦"];
  const factsHtml = (facts.length > 0 ? facts : defaults)
    .slice(0, 4)
    .map((fact, index) => `<div class="hm-fact"><div class="hm-fact-icon">${icons[index]}</div><span class="hm-s-body">${rich(fact)}</span></div>`)
    .join("");
  const quote = filled(content.quote) ? `<div class="hm-company-rule"></div>${tag("p", "hm-s-quote hm-company-quote", content.quote)}` : "";

  return `<section class="hm-company"><div class="hm-company-head"><div class="hm-company-line"></div>${tag("h2", "hm-s-title", content.title)}${tag("p", "hm-s-body hm-company-text", content.subtitle)}</div><div class="hm-company-grid">${benefitsCard("☺", content.teamTitle, content.teamBenefits)}${benefitsCard("▦", content.companyTitle, content.companyBenefits)}</div><div class="hm-company-facts"><div class="hm-fact-list">${factsHtml}</div>${quote}</div></section>`;
}

function serviceImagePath(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const { path, url } = value as { path?: unknown; url?: unknown };
    return text(path) || text(url);
  }
  return "";
}

function servicesPreview(content: Content): string {
  const items = records(content.items);
  const cards = items.map((item) => {
    const imagePath = serviceImagePath(item.image);
    const price = text(item.price).trim();
    const category = filled(item.category) ? `<span>${rich(item.category)}</span>` : "";
    const separator = category && price ? " • " : "";
    const meta = category || price ? `<div class="hm-service-meta">${category}${separator}${price ? `<span class="hm-service-price">${escapeHtml(price)}</span>` : ""}</div>` : "";

    return `<article class="hm-service">${imagePath ? `<div class="hm-service-image">${image(imagePath)}</div>` : ""}<div class="hm-service-body">${meta}${tag("h3", "hm-s-card-title hm-service-title", item.name)}${tag("p", "hm-s-body hm-service-text", item.description)}${link("hm-service-link", text(item.link) || "/soins", "Découvrir →")}</div></article>`;
  });
  const gridClass = items.length === 1 ? " hm-services-grid--1" : items.length === 2 ? " hm-services-grid--2" : "";

  return `<section class="hm-services"><div class="hm-services-inner"><div class="hm-services-head">${tag("p", "hm-s-eyebrow hm-services-eyebrow", content.subtitle)}${tag("h2", "hm-s-title", content.title)}</div><div class="hm-services-grid${gridClass}">${cards.join("")}</div></div></section>`;
}

function stars(rating: number): string {
  const rounded = Math.round(rating);
  return `<p class="hm-stars" aria-label="${rating} étoiles sur 5">${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}</p>`;
}

function normalizedRating(value: unknown, fallback: number): number {
  const parsed = Number.parseFloat(String(value ?? fallback).replace(",", "."));
  return Number.isFinite(parsed) ? Math.max(0, Math.min(5, parsed)) : fallback;
}

function googleReviews(content: Content): string {
  const average = normalizedRating(content.averageRating, 5);
  const count = text(content.totalReviews);
  const cards = records(content.reviews)
    .filter((review) => filled(review.text))
    .map((review) => {
      const date = text(review.date) ? `<p class="hm-s-body hm-review-date">${escapeHtml(text(review.date))}</p>` : "";
      return `<article class="hm-review"><div class="hm-review-top">${stars(normalizedRating(review.rating, 5))}<span class="hm-review-mark">”</span></div>${tag("p", "hm-s-body hm-review-text", review.text)}<footer class="hm-review-footer"><p class="hm-review-name">${escapeHtml(text(review.name) || "Cliente Google")}</p>${date}</footer></article>`;
    })
    .join("");
  const more = text(content.googleUrl)
    ? `<div class="hm-reviews-more">${link("hm-reviews-button", text(content.googleUrl), escapeHtml(text(content.buttonText) || "Voir tous les avis Google"), true)}</div>`
    : "";

  return `<section class="hm-reviews"><div class="hm-reviews-inner"><div class="hm-reviews-head"><div>${tag("p", "hm-s-eyebrow", content.eyebrow ?? "Avis Google")}${tag("h2", "hm-s-title hm-reviews-title", content.title ?? "Elles partagent leur expérience")}${tag("p", "hm-s-body hm-reviews-text", content.subtitle)}</div><div class="hm-reviews-score"><span class="hm-s-title">${average.toFixed(1)}</span><div>${stars(average)}<p class="hm-s-body hm-reviews-count">${count ? `${escapeHtml(count)} avis sur Google` : "Avis publiés sur Google"}</p></div></div></div>${cards ? `<div class="hm-reviews-grid">${cards}</div>` : ""}${more}</div></section>`;
}

const CONVERTERS: Record<string, (content: Content) => string> = {
  "hero-home": heroHome,
  hero: heroCompact,
  "hero-simple": heroCompact,
  "hero-compact": heroCompact,
  presentation,
  approche,
  tarifs,
  "contact-cta": contactCta,
  text: textSection,
  image: imageSection,
  spacer,
  entreprise,
  "services-preview": servicesPreview,
  "google-reviews": googleReviews,
  "contact-layout": () => `<section data-dynamic="contact"></section>`,
  "contact-info": () => `<section data-dynamic="contact"></section>`,
  "contact-form": () => `<section data-dynamic="contact"></section>`,
  "google-map": () => `<section data-dynamic="map"></section>`,
};

function withFrame(content: Content, inner: string): string {
  const appearance = (content._appearance ?? {}) as Record<string, string | undefined>;
  const outer = [appearance.paddingTop, appearance.paddingBottom]
    .map((size, index) => (size && size !== "none" ? `hm-frame-${index === 0 ? "pt" : "pb"}-${size}` : ""))
    .filter(Boolean);
  const box = [
    appearance.width && appearance.width !== "full" ? `hm-frame-${appearance.width}` : "",
    appearance.radius && appearance.radius !== "none" ? `hm-frame-r-${appearance.radius}` : "",
    appearance.background && appearance.background !== "transparent" ? `hm-frame-${appearance.background}` : "",
  ].filter(Boolean);

  const boxed = box.length > 0 ? `<div class="${box.join(" ")}">${inner}</div>` : inner;
  return outer.length > 0 ? `<div class="${outer.join(" ")}">${boxed}</div>` : boxed;
}

function hideTitleIfAsked(content: Content): Content {
  const appearance = content._appearance as { showTitle?: boolean } | undefined;
  return appearance?.showTitle === false ? { ...content, title: "" } : content;
}

export interface SectionsConversion {
  html: string;
  /** Section types with no equivalent block: they are left out and must be reported to the editor. */
  unsupported: string[];
}

/** Translates the sections of the former page builder into GrapesJS content, with the same text, images and layout. */
export function sectionsToGrapes(sections: PageSection[]): SectionsConversion {
  const unsupported: string[] = [];
  const html = [...sections]
    .filter((section) => section.visible !== false)
    .sort((first, second) => first.sortOrder - second.sortOrder)
    .map((section) => {
      const convert = CONVERTERS[section.type];
      if (!convert) {
        unsupported.push(section.type);
        return "";
      }
      const content = hideTitleIfAsked(section.content ?? {});
      return withFrame(content, convert(content));
    })
    .join("");

  return { html, unsupported };
}
