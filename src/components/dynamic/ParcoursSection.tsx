import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getImageUrl } from "@/lib/api";
import type { ParcoursContent } from "@/types";

interface ParcoursSectionProps {
  content: ParcoursContent;
}

export function ParcoursSection({ content }: ParcoursSectionProps) {
  const imageUrl = getImageUrl(content.image);
  const paragraphs = content.paragraphs ?? [];

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
            <h2 className="text-4xl font-extralight" style={{ fontFamily: "var(--font-title)" }}>
              Mon parcours
            </h2>
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph}-${index}`} className="text-lg leading-loose text-[var(--text-secondary)]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
