import Image from "next/image";
import { RichText } from "@/components/dynamic/RichText";
import { getImageUrl } from "@/lib/api";
import { hasRichText } from "@/lib/richText";

interface TextSectionProps {
  content: {
    title?: string;
    paragraphs?: string[];
    image?: string | null;
  };
}

export function TextSection({ content }: TextSectionProps) {
  const imageUrl = content.image ? getImageUrl(content.image) : null;
  const paragraphs = (content.paragraphs ?? []).filter((paragraph) => hasRichText(paragraph));

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      {hasRichText(content.title) ? (
        <h2 className="heading-section mb-8">
          <RichText value={content.title} />
        </h2>
      ) : null}
      <div className={imageUrl ? "grid items-center gap-8 md:grid-cols-2" : ""}>
        {imageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={imageUrl} alt="" fill className="object-cover" />
          </div>
        ) : null}
        {paragraphs.length > 0 ? (
          <div className="space-y-4 text-lg text-gray-600">
            {paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`}>
                <RichText value={paragraph} />
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
