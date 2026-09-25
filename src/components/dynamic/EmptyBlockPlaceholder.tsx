"use client";

import type { LucideIcon } from "lucide-react";
import { usePreviewMode } from "@/contexts/PreviewModeContext";

interface EmptyBlockPlaceholderProps {
  icon: LucideIcon;
  /** Nom du bloc, ex. "Carte". */
  title: string;
  /** Ce qu'il faut remplir pour que le bloc s'affiche. */
  hint: string;
}

/**
 * Bloc vide : repere visible uniquement dans l'apercu admin.
 * Sur le site public, rien n'est affiche.
 */
export function EmptyBlockPlaceholder({ icon: Icon, title, hint }: EmptyBlockPlaceholderProps) {
  const isPreview = usePreviewMode();

  if (!isPreview) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-5 py-6 text-stone-500">
        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-stone-700">{title} vide — non affiché sur le site</p>
          <p className="text-xs">{hint}</p>
        </div>
      </div>
    </section>
  );
}
