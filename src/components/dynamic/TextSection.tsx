import Image from "next/image";
import type { BlockAppearance } from "@/components/dynamic/BlockAppearanceFrame";
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
  const layout = (content as { _appearance?: BlockAppearance })._appearance?.layout;
  const imageFirstOnMobile = layout?.mobileOrder !== "text-first";
  const tabletLayout = layout?.tabletLayout ?? "default";
  const desktopLayout = layout?.desktopLayout ?? "default";
  const contentLayoutClasses =
    tabletLayout === "stacked"
      ? desktopLayout === "stacked"
        ? ""
        : "lg:grid-cols-2"
      : `md:grid-cols-2${desktopLayout === "stacked" ? " lg:grid-cols-1" : ""}`;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      {hasRichText(content.title) ? (
        <h2 className="block-title mb-8">
          <RichText value={content.title} />
        </h2>
      ) : null}
      <div className={imageUrl ? `grid items-center gap-8 ${contentLayoutClasses}` : ""}>
        {imageUrl ? (
          <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${imageFirstOnMobile ? "order-1" : "order-2 md:order-none"}`}>
            <Image src={imageUrl} alt="" fill className="object-cover" />
          </div>
        ) : null}
        {paragraphs.length > 0 ? (
          <div className={`block-body space-y-4 ${imageFirstOnMobile ? "order-2" : "order-1 md:order-none"}`}>
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
