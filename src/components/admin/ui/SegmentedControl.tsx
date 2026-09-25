"use client";

import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import { FieldLabel } from "./FieldLabel";

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedControlProps {
  label: string;
  value: string;
  options: SegmentedOption[];
  onChange: (value: string) => void;
  help?: string;
  optional?: boolean;
}

/**
 * Choix court affiche en boutons cote a cote (Aucun · Leger · Moyen · Fort).
 */
export function SegmentedControl({ label, value, options, onChange, help, optional }: SegmentedControlProps) {
  const labelId = useId();

  return (
    <div>
      <FieldLabel as="span" id={labelId} label={label} help={help} optional={optional} />
      <div role="radiogroup" aria-labelledby={labelId} className="flex flex-wrap gap-1 rounded-lg bg-stone-100 p-1">
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
                "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                isSelected
                  ? "bg-white font-medium text-amber-700 shadow-sm"
                  : "text-stone-600 hover:text-stone-900",
              ].join(" ")}
            >
              {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
              <span className="truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
