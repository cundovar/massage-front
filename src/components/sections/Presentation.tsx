import Image from "next/image";
import Link from "next/link";
import type { PresentationContent } from "@/types/sections";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface PresentationProps {
  content: PresentationContent;
}

export function Presentation({ content }: PresentationProps) {
  const { title, paragraphs, quote, image } = content;

  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${API_URL}${image}`
    : "/images/default/presentation.jpg";

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Image */}
          <AnimatedSection className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#FFCE67] to-[#F67E54] rounded-full -z-10 opacity-80" />
          </AnimatedSection>

          {/* Text Content - Tout vient du backoffice */}
          <AnimatedSection delay={200}>
            <p className="text-orange-500 font-medium mb-4 uppercase tracking-wide text-sm">
              À propos
            </p>

            {/* Titre éditable */}
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
              {title}
            </h2>

            {/* Paragraphes éditables */}
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Citation éditable */}
            {quote && (
              <blockquote className="mt-8 pl-6 border-l-4 border-orange-400 italic text-xl text-gray-700">
                "{quote}"
              </blockquote>
            )}

            <Link
              href="/a-propos"
              className="inline-flex items-center gap-2 mt-8 text-gray-900 font-medium group"
            >
              En savoir plus
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
}