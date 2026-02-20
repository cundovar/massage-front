import Image from "next/image";
import { getImageUrl } from "@/lib/api";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface GenericHeroContent {
  title?: string;
  subtitle?: string;
  image?: string;
}

export function GenericHeroSection({ content }: { content: GenericHeroContent }) {
  const imageUrl = getImageUrl(content.image);

  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden rounded-3xl">
      <div className="absolute inset-0">
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill className="object-cover" priority />
        ) : (
          <div className="h-full w-full" style={{ background: "var(--gradient-primary)" }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        {content.title ? (
          <ScrollReveal>
            <h1 className="text-4xl font-serif text-white md:text-6xl">{content.title}</h1>
          </ScrollReveal>
        ) : null}
        {content.subtitle ? (
          <ScrollReveal delay={0.2}>
            <p className="mt-4 text-xl text-white/80">{content.subtitle}</p>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
