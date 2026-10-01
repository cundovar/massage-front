import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { RichText } from "@/components/dynamic/RichText";
import { getImageUrl } from "@/lib/api";
import { hasRichText } from "@/lib/richText";
import type { ParcoursContent } from "@/types";
import { getBlockLayout, getSplitLayout } from "@/components/dynamic/responsiveLayout";

interface ParcoursSectionProps {
  content: ParcoursContent;
}

export function ParcoursSection({ content }: ParcoursSectionProps) {
  const imageUrl = getImageUrl(content.image);
  // Titre vide = titre par defaut (le titre etait fixe avant d'etre modifiable).
  const title = hasRichText(content.title) ? content.title : "Mon parcours";
  const paragraphs = (content.paragraphs ?? []).filter((paragraph) => hasRichText(paragraph));
  const split = getSplitLayout(getBlockLayout(content), {
    tabletColumns: "md:grid-cols-[1fr_2fr]",
    desktopColumns: "lg:grid-cols-[1fr_2fr]",
    defaultTablet: "two-columns",
    defaultDesktop: "two-columns",
    mediaFirstByDefault: true,
  });

  return (
    <section className="px-5 py-12 sm:px-0 sm:py-16">
      <ScrollReveal>
        <div className={`grid min-w-0 gap-10 ${split.container}`}>
          {imageUrl ? (
            <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl ${split.media}`}>
              <Image src={imageUrl} alt="Parcours" fill className="object-cover" />
            </div>
          ) : null}

          <div className={`min-w-0 space-y-6 ${split.text}`}>
            {hasRichText(title) ? (
              <h2 className="block-title break-words">
                <RichText value={title} />
              </h2>
            ) : null}
            {paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`} className="block-body break-words">
                <RichText value={paragraph} />
              </p>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
