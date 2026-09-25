"use client";

import { useId } from "react";
import { ExternalLink, MousePointerClick } from "lucide-react";
import { FieldLabel } from "./FieldLabel";
import { Input } from "./Input";
import { PageLinkPicker } from "./PageLinkPicker";

export interface ButtonFieldValue {
  text: string;
  link: string;
  newTab?: boolean;
}

interface ButtonFieldProps {
  token: string;
  value: ButtonFieldValue;
  onChange: (value: ButtonFieldValue) => void;
  /** Affiche l'interrupteur "ouvrir dans un nouvel onglet". */
  withNewTab?: boolean;
  textPlaceholder?: string;
}

function isExternalLink(link: string): boolean {
  return /^https?:\/\//i.test(link);
}

/**
 * Bouton complet en une seule carte : texte, destination, nouvel onglet et apercu.
 */
export function ButtonField({ token, value, onChange, withNewTab = false, textPlaceholder }: ButtonFieldProps) {
  const textId = useId();
  const newTabId = useId();
  const text = value.text ?? "";
  const link = value.link ?? "";
  const hasText = text.trim() !== "";

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel
          label="Texte du bouton"
          htmlFor={textId}
          optional
          help="Laissez vide pour ne pas afficher de bouton."
        />
        <Input
          id={textId}
          type="text"
          value={text}
          onChange={(event) => onChange({ ...value, text: event.target.value })}
          placeholder={textPlaceholder ?? "Réserver un soin"}
        />
      </div>

      {hasText ? (
        <>
          <PageLinkPicker
            label="Où mène le bouton ?"
            placeholder="https://www.planity.com/... ou /contact"
            value={link}
            token={token}
            onChange={(nextLink) => onChange({ ...value, link: nextLink })}
          />

          {withNewTab ? (
            <label htmlFor={newTabId} className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input
                id={newTabId}
                type="checkbox"
                checked={value.newTab === true}
                onChange={(event) => onChange({ ...value, newTab: event.target.checked })}
                className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              Ouvrir dans un nouvel onglet
            </label>
          ) : null}

          <div className="rounded-lg bg-stone-50 p-3">
            <p className="mb-2 text-xs font-medium text-stone-500">Aperçu</p>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-stone-900">
              <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" />
              {text}
              {isExternalLink(link) ? <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            </span>
            {!link.trim() ? (
              <p className="mt-2 text-xs text-amber-700">Choisissez où mène le bouton, sinon il ne sera pas cliquable.</p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
