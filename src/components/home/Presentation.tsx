import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getImageUrl } from "@/lib/api";
import type { PresentationContent } from "@/lib/api";
import { hasRichText } from "@/lib/richText";
import { RichText } from "@/components/dynamic/RichText";

interface PresentationProps {
  content: PresentationContent;
}

export function Presentation({ content }: PresentationProps) {
  const imageUrl = getImageUrl(content.image);
  const title = content.title ?? "Presentation";
  const paragraphs = (content.paragraphs ?? []).filter((paragraph) => hasRichText(paragraph));

  return (
    <section id="bienvenue" className="mt-16 grid gap-10 md:grid-cols-[5fr_2fr]">
      <ScrollReveal>
        <div className="js-section-left space-y-6">
          <div className="h-px w-16 bg-[var(--primary-start)]" />
          {hasRichText(title) ? (
            <h2 className="text-5xl font-extralight md:text-6xl" style={{ fontFamily: "var(--font-title)" }}>
              <RichText value={title} />
            </h2>
          ) : null}
          {paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`} className="text-lg leading-loose text-[var(--text-secondary)]">
              <RichText value={paragraph} />
            </p>
          ))}
          {hasRichText(content.quote) ? (
            <blockquote
              className="rounded-r-xl px-5 py-4 text-xl italic text-[var(--text-primary)]"
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

      <ScrollReveal>
        <div className="js-section-right glass-panel group relative aspect-[3/4] overflow-hidden rounded-2xl">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Presentation"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 30vw"
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
