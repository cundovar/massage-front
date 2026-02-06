import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/api";
import type { HeroContent } from "@/lib/api";

interface HeroProps {
  content: HeroContent;
}

export function Hero({ content }: HeroProps) {
  const slides = content.slides?.length
    ? content.slides
    : [
        {
          image: "/images/default/hero-1.jpg",
          title: "Une pause pour vous recentrer",
          subtitle: "Massages ayurvediques • Kobido • Reflexologie • Prenatal",
        },
      ];
  const firstSlide = slides[0];

  return (
    <section className="glass-panel relative min-h-[82vh] overflow-hidden rounded-3xl px-6 py-16 md:px-12 md:py-20">
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          const imageUrl = getImageUrl(slide.image);
          const heroClass = `hero-slide hero-slide-${(index % 3) + 1}`;

          return (
            <div
              key={`${slide.title ?? "slide"}-${index}`}
              className={heroClass}
              style={{ animationDelay: `${index * 6}s` }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={slide.title ?? `Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              ) : null}
            </div>
          );
        })}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
      </div>

      <div className="js-hero-content relative z-10 mx-auto flex min-h-[65vh] max-w-4xl flex-col items-center justify-center text-center text-sand-100">
        <div className="h-px w-24 bg-amber-500" />
        <h1 className="mt-6 text-5xl font-extralight leading-[0.95] text-sand-100 md:text-7xl" style={{ fontFamily: "var(--font-title)" }}>
          {content.siteTitle ?? "Les Massages d'Helene"}
        </h1>
        <p className="mt-5 text-xl text-sand-100/90 md:text-3xl">
          {firstSlide?.title ?? "Pause ayurvedique"}
        </p>
        {firstSlide?.subtitle && (
          <p className="mt-7 max-w-2xl text-lg text-sand-100/80">{firstSlide.subtitle}</p>
        )}
        <Link
          href="#tarifs"
          className="mt-10 inline-flex rounded-full bg-amber-500 px-7 py-3 text-sm font-semibold tracking-[0.1em] text-black uppercase hover:bg-amber-600"
        >
          Decouvrir la carte
        </Link>
      </div>
    </section>
  );
}
