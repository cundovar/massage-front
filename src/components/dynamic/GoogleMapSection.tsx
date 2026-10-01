"use client";

import { Map as MapIcon } from "lucide-react";
import { EmptyBlockPlaceholder } from "@/components/dynamic/EmptyBlockPlaceholder";
import { RichText } from "@/components/dynamic/RichText";
import { hasRichText, toPlainText } from "@/lib/richText";

interface GoogleMapContent {
  embedUrl?: string;
  title?: string;
}

interface GoogleMapSectionProps {
  content: GoogleMapContent;
}

export function GoogleMapSection({ content }: GoogleMapSectionProps) {
  const embedUrl = content.embedUrl || "";

  if (!embedUrl.trim()) {
    return (
      <EmptyBlockPlaceholder
        icon={MapIcon}
        title="Carte"
        hint="Collez l'URL d'intégration Google Maps (ou Google My Maps) dans la section « Textes » du bloc."
      />
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10" data-animate="section">
      {hasRichText(content.title) ? (
        <h2 className="block-title mb-6">
          <RichText value={content.title} />
        </h2>
      ) : null}
      <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[var(--background-alt)]">
        <iframe
          title={toPlainText(content.title) || "Carte Google Maps"}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
        />
      </div>
    </section>
  );
}
