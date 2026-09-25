"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface FieldGroupProps {
  title: string;
  icon: LucideIcon;
  /** Phrase courte qui dit a quoi sert la section. */
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Section repliable d'un formulaire admin (Textes, Bouton, Apparence...).
 */
export function FieldGroup({ title, icon: Icon, description, defaultOpen = true, children }: FieldGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section className="rounded-xl border border-stone-200 bg-white">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-stone-800">{title}</span>
          {description ? <span className="block text-xs text-stone-500">{description}</span> : null}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {isOpen ? (
        <div id={contentId} className="space-y-4 border-t border-stone-100 px-4 py-4">
          {children}
        </div>
      ) : null}
    </section>
  );
}
