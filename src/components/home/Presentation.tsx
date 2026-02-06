import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getImageUrl } from "@/lib/api";
import type { PresentationContent } from "@/lib/api";

interface PresentationProps {
  content: PresentationContent;
}

export function Presentation({ content }: PresentationProps) {
  const imageUrl = getImageUrl(content.image);

  return (
    <section id="bienvenue" className="mt-16 grid gap-10 md:grid-cols-[5fr_2fr]">
      <ScrollReveal>
        <div className="js-section-left space-y-6">
          <div className="h-px w-16 bg-amber-500" />
          <h2 className="text-5xl font-extralight md:text-6xl" style={{ fontFamily: "var(--font-title)" }}>
            Presentation
          </h2>
          {content.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-loose text-[var(--muted)]">
              {paragraph}
            </p>
          ))}
          <blockquote className="rounded-r-xl border-l-2 border-amber-500/40 bg-amber-50/60 px-5 py-4 text-xl italic text-stone-800">
            Je m&apos;adresse a tous ceux qui souhaitent prendre soin d&apos;eux-memes et s&apos;offrir une pause bienveillante.
          </blockquote>
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
            <div className="absolute inset-0 bg-[linear-gradient(160deg,#bfa379,#7a6347)] transition-transform duration-700 group-hover:scale-105" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-sand-100/10 mix-blend-multiply" />
        </div>
      </ScrollReveal>
    </section>
  );
}
