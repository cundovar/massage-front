"use client";

import { useId } from "react";
import type { LucideIcon } from "lucide-react";

interface ToggleRowProps {
  label: string;
  /** Precision courte sous le libelle. */
  description?: string;
  icon?: LucideIcon;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Ligne pleine largeur : icone + libelle + explication a gauche, interrupteur a droite.
 * Toute la ligne est cliquable.
 */
export function ToggleRow({ label, description, icon: Icon, checked, onChange, disabled = false }: ToggleRowProps) {
  const descriptionId = useId();

  return (
    <label
      className={[
        "flex items-center gap-3 rounded-lg border px-3 py-3 transition-colors",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-amber-300",
        checked ? "border-amber-200 bg-amber-50/60" : "border-stone-200 bg-white",
      ].join(" ")}
    >
      {Icon ? (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${checked ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-stone-800">{label}</span>
        {description ? (
          <span id={descriptionId} className="block text-xs text-stone-500">
            {description}
          </span>
        ) : null}
      </span>
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        aria-describedby={description ? descriptionId : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden="true"
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500 peer-focus-visible:ring-offset-2",
          checked ? "bg-amber-500" : "bg-stone-300",
        ].join(" ")}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`}
        />
      </span>
    </label>
  );
}
