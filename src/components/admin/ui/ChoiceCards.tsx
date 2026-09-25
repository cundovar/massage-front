"use client";

import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import { FieldLabel } from "./FieldLabel";

export interface ChoiceCardOption {
  value: string;
  label: string;
  hint?: string;
  icon?: LucideIcon;
}

interface ChoiceCardsProps {
  label: string;
  value: string;
  options: ChoiceCardOption[];
  onChange: (value: string) => void;
  help?: string;
  optional?: boolean;
}

/**
 * Choix important affiche en cartes cliquables avec icone et explication.
 */
export function ChoiceCards({ label, value, options, onChange, help, optional }: ChoiceCardsProps) {
  const labelId = useId();

  return (
    <div>
      <FieldLabel as="span" id={labelId} label={label} help={help} optional={optional} />
      <div role="radiogroup" aria-labelledby={labelId} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const isSelected = option.value === value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              className={[
                "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                isSelected
                  ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500"
                  : "border-stone-200 bg-white hover:border-amber-300",
              ].join(" ")}
            >
              {Icon ? (
                <Icon className={`h-5 w-5 ${isSelected ? "text-amber-600" : "text-stone-500"}`} aria-hidden="true" />
              ) : null}
              <span className={`text-sm font-medium ${isSelected ? "text-amber-800" : "text-stone-800"}`}>
                {option.label}
              </span>
              {option.hint ? <span className="text-xs leading-4 text-stone-500">{option.hint}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
