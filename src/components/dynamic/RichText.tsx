import { Fragment, type ReactNode } from "react";
import { getRichTextColor, parseRichText, type RichTextNode } from "@/lib/richText";

interface RichTextProps {
  /** Texte stocke par l'admin (brut ou enrichi). */
  value: string | null | undefined;
}

function renderNodes(nodes: RichTextNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;

    if (node.type === "text") return <Fragment key={key}>{node.text}</Fragment>;
    if (node.type === "br") return <br key={key} />;

    const children = renderNodes(node.children, key);

    switch (node.mark) {
      case "strong":
        return <strong key={key} className="font-semibold">{children}</strong>;
      case "em":
        return <em key={key}>{children}</em>;
      case "u":
        return <u key={key} className="underline decoration-1 underline-offset-4">{children}</u>;
      case "color": {
        const color = getRichTextColor(node.color);
        return color ? (
          <span key={key} style={{ color: color.css }}>
            {children}
          </span>
        ) : (
          <Fragment key={key}>{children}</Fragment>
        );
      }
      default:
        return <Fragment key={key}>{children}</Fragment>;
    }
  });
}

/**
 * Affiche un texte de bloc avec sa mise en forme, a l'interieur de la balise
 * du composant (titre, paragraphe...). Seules les mises en forme autorisees
 * sont rendues : pas de HTML arbitraire.
 */
export function RichText({ value }: RichTextProps) {
  return <>{renderNodes(parseRichText(value), "rt")}</>;
}
