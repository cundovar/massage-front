import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { RichText } from "@/components/dynamic/RichText";
import { getImageUrl } from "@/lib/api";
import { hasRichText } from "@/lib/richText";
import type { FormationsContent } from "@/types";

interface FormationsSectionProps {
  content: FormationsContent;
}

export function FormationsSection({ content }: FormationsSectionProps) {
  const images = content.images ?? [];
  // Titre vide = titre par defaut (le titre etait fixe avant d'etre modifiable).
  const title = hasRichText(content.title) ? content.title : "Formations";
  const items = (content.items ?? []).filter((item) => hasRichText(item.title) || item.year?.trim());

  return (
    <section className="py-16">
      <ScrollReveal>
        <div className="space-y-8">
          {hasRichText(title) ? (
            <h2 className="text-4xl font-extralight" style={{ fontFamily: "var(--font-title)" }}>
              <RichText value={title} />
            </h2>
          ) : null}

          {images.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {images.map((img, index) => {
                const url = getImageUrl(img);
                if (!url) {
                  return null;
                }

                return (
                  <div key={`${img}-${index}`} className="relative h-20 w-20">
                    <Image src={url} alt={`Certification ${index + 1}`} fill className="object-contain" />
                  </div>
                );
              })}
            </div>
          ) : null}

          {items.length > 0 ? (
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li key={`${item.year}-${index}`} className="flex items-baseline gap-4">
                  {item.year?.trim() ? (
                    <span className="text-sm font-semibold text-[var(--primary-start)]">{item.year}</span>
                  ) : null}
                  <span className="text-lg text-[var(--text-secondary)]">
                    <RichText value={item.title} />
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </ScrollReveal>
    </section>
  );
}
