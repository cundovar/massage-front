import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getImageUrl } from "@/lib/api";
import type { FormationsContent } from "@/types";

interface FormationsSectionProps {
  content: FormationsContent;
}

export function FormationsSection({ content }: FormationsSectionProps) {
  const images = content.images ?? [];
  const items = content.items ?? [];

  return (
    <section className="py-16">
      <ScrollReveal>
        <div className="space-y-8">
          <h2 className="text-4xl font-extralight" style={{ fontFamily: "var(--font-title)" }}>
            Formations
          </h2>

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

          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={`${item.year}-${item.title}-${index}`} className="flex items-baseline gap-4">
                <span className="text-sm font-semibold text-[var(--primary-start)]">{item.year}</span>
                <span className="text-lg text-[var(--text-secondary)]">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </section>
  );
}
