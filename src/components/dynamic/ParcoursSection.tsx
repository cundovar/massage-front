import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { RichText } from "@/components/dynamic/RichText";
import { getImageUrl } from "@/lib/api";
import { hasRichText } from "@/lib/richText";
import type { ParcoursContent } from "@/types";

interface ParcoursSectionProps {
  content: ParcoursContent;
}

export function ParcoursSection({ content }: ParcoursSectionProps) {
  const imageUrl = getImageUrl(content.image);
  // Titre vide = titre par defaut (le titre etait fixe avant d'etre modifiable).
  const title = hasRichText(content.title) ? content.title : "Mon parcours";
  const paragraphs = (content.paragraphs ?? []).filter((paragraph) => hasRichText(paragraph));

  return (
    <section className="py-16">
      <ScrollReveal>
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          {imageUrl ? (
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src={imageUrl} alt="Parcours" fill className="object-cover" />
            </div>
          ) : null}

          <div className="space-y-6">
            {hasRichText(title) ? (
              <h2 className="text-4xl font-extralight" style={{ fontFamily: "var(--font-title)" }}>
                <RichText value={title} />
              </h2>
            ) : null}
            {paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`} className="text-lg leading-loose text-[var(--text-secondary)]">
                <RichText value={paragraph} />
              </p>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
