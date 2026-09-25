import { HelpTip } from "./HelpTip";

interface FieldLabelProps {
  label: string;
  htmlFor?: string;
  help?: string;
  optional?: boolean;
  /** Rendu en <span> quand le champ n'est pas un input unique (groupe de boutons...). */
  as?: "label" | "span";
  id?: string;
}

/**
 * Libelle de champ admin : texte + mention "facultatif" + bulle d'aide.
 */
export function FieldLabel({ label, htmlFor, help, optional, as = "label", id }: FieldLabelProps) {
  const Tag = as;

  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <Tag id={id} htmlFor={as === "label" ? htmlFor : undefined} className="text-sm font-medium text-stone-700">
        {label}
      </Tag>
      {optional ? <span className="text-xs text-stone-400">facultatif</span> : null}
      {help ? <HelpTip text={help} label={label} /> : null}
    </div>
  );
}
