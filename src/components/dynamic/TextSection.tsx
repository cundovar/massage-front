import Image from "next/image";
import { getImageUrl } from "@/lib/api";

interface TextSectionProps {
  content: {
    title?: string;
    paragraphs?: string[];
    image?: string | null;
  };
}

export function TextSection({ content }: TextSectionProps) {
  const imageUrl = content.image ? getImageUrl(content.image) : null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      {content.title ? <h2 className="heading-section mb-8">{content.title}</h2> : null}
      <div className={imageUrl ? "grid items-center gap-8 md:grid-cols-2" : ""}>
        {imageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={imageUrl} alt="" fill className="object-cover" />
          </div>
        ) : null}
        <div className="space-y-4 text-lg text-gray-600">
          {content.paragraphs?.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}
