import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getImageUrl } from "@/lib/api";
import type { PresentationContent } from "@/lib/api";
import { hasRichText } from "@/lib/richText";
import { RichText } from "@/components/dynamic/RichText";
import type { BlockAppearance } from "@/components/dynamic/BlockAppearanceFrame";

interface PresentationProps {
  content: PresentationContent;
}

export function Presentation({ content }: PresentationProps) {
  const imageUrl = getImageUrl(content.image);
  const title = content.title ?? "Presentation";
  const paragraphs = (content.paragraphs ?? []).filter((paragraph) => hasRichText(paragraph));
  const layout = (content as PresentationContent & { _appearance?: BlockAppearance })._appearance?.layout;
  const imageFirstOnMobile = layout?.mobileOrder === "image-first";
  const tabletLayout = layout?.tabletLayout ?? "default";
  const desktopLayout = layout?.desktopLayout ?? "default";
  const contentLayoutClasses =
    tabletLayout === "stacked"
      ? desktopLayout === "stacked"
        ? ""
        : "lg:grid-cols-[3fr_2fr] lg:items-center xl:grid-cols-[minmax(0,1fr)_28rem]"
      : `md:grid-cols-[3fr_2fr] md:items-center${desktopLayout === "stacked" ? " lg:grid-cols-1" : " xl:grid-cols-[minmax(0,1fr)_28rem]"}`;

  return (
    <section id="bienvenue" className={`mt-16 grid gap-10 px-5 sm:px-0 lg:gap-16 ${contentLayoutClasses}`}>
      <ScrollReveal className={`min-w-0 ${imageFirstOnMobile ? "order-2 md:order-none" : "order-1"}`}>
        <div className="js-section-left space-y-6">
          <div className="h-px w-16 bg-[var(--primary-start)]" />
          {hasRichText(title) ? (
            <h2 className="block-title">
              <RichText value={title} />
            </h2>
          ) : null}
          {paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`} className="block-body">
              <RichText value={paragraph} />
            </p>
          ))}
          {hasRichText(content.quote) ? (
            <blockquote
              className="block-quote rounded-r-xl px-5 py-4 italic"
              style={{
                borderLeft: "2px solid color-mix(in srgb, var(--primary-start) 40%, transparent)",
                background: "color-mix(in srgb, var(--primary-start) 10%, transparent)",
              }}
            >
              <RichText value={content.quote} />
            </blockquote>
          ) : null}
        </div>
      </ScrollReveal>

      <ScrollReveal className={`min-w-0 ${imageFirstOnMobile ? "order-1 md:order-none" : "order-2 md:order-none"}`}>
        <div className="js-section-right glass-panel group relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl md:aspect-[3/4]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Presentation"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          ) : (
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              style={{
                background: "linear-gradient(160deg, var(--primary-start), var(--primary-end))",
              }}
            />
          )}
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background: "linear-gradient(to top, color-mix(in srgb, var(--primary-end) 30%, transparent), transparent)",
            }}
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
