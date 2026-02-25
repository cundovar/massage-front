"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/api";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import type { HeroContent } from "@/lib/api";

interface HeroVisualOptions {
  siteSubtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundType?: "image" | "gradient";
  gradientStart?: string;
  gradientEnd?: string;
  textColor?: string;
  backgroundBlur?: string | number;
  overlayOpacity?: string | number;
}

interface HeroProps {
  content: HeroContent & HeroVisualOptions;
}

export function Hero({ content }: HeroProps) {
  const slides = useMemo(
    () =>
      content.slides?.length
        ? content.slides
        : [
            {
              image: "",
              title: "Une pause pour vous recentrer",
              subtitle: "Massages ayurvediques • Kobido • Reflexologie • Prenatal",
            },
          ],
    [content.slides],
  );
  const backgroundType = content.backgroundType === "gradient" ? "gradient" : "image";
  const imageSlides = useMemo(
    () =>
      slides
        .map((slide) => ({ ...slide, imageUrl: getImageUrl(slide.image) }))
        .filter((slide) => Boolean(slide.imageUrl)),
    [slides],
  );
  const useImageBackground = backgroundType === "image" && imageSlides.length > 0;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const gradientStart = content.gradientStart || "var(--primary-start)";
  const gradientEnd = content.gradientEnd || "var(--primary-end)";
  const textColor = content.textColor || "#F5F5F4";

  const blurValue = Number.parseInt(String(content.backgroundBlur ?? "0"), 10);
  const backgroundBlur = Number.isFinite(blurValue) ? Math.max(0, Math.min(8, blurValue)) : 0;

  const overlayValue = Number.parseInt(String(content.overlayOpacity ?? "45"), 10);
  const overlayOpacity = Number.isFinite(overlayValue) ? Math.max(0, Math.min(90, overlayValue)) / 100 : 0.45;
  const normalizedActiveSlideIndex =
    useImageBackground && imageSlides.length > 0
      ? activeSlideIndex % imageSlides.length
      : 0;
  const activeSlide = useImageBackground ? imageSlides[normalizedActiveSlideIndex] : slides[0];

  useEffect(() => {
    if (!useImageBackground || imageSlides.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlideIndex((current) => (current + 1) % imageSlides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [useImageBackground, imageSlides.length]);

  return (
    <section
      className="glass-panel w-full overflow-hidden rounded-3xl px-4 sm:px-6 md:px-12 min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh]"
      data-animate="section"
    >
      <div className="absolute inset-0">
        {useImageBackground ? (
          imageSlides.map((slide, index) => (
            <div
              key={`${slide.title ?? "slide"}-${index}`}
              className={`absolute inset-0 transition-opacity duration-1200 ${index === normalizedActiveSlideIndex ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={slide.imageUrl!}
                alt={slide.title ?? `Slide ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                style={backgroundBlur > 0 ? { filter: `blur(${backgroundBlur}px)`, transform: "scale(1.03)" } : undefined}
                sizes="100vw"
              />
            </div>
          ))
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` }}
          />
        )}
        <div className="absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/30 to-black/90" style={{ opacity: useImageBackground ? overlayOpacity : overlayOpacity * 0.35 }} />
      </div>

      <div className="js-hero-content relative z-10 mx-auto flex min-h-[60vh] md:min-h-[65vh] max-w-4xl flex-col items-center justify-center py-8 text-center md:py-12" style={{ color: textColor }}>
        <div className="h-px w-24 bg-gold-default" />
        <h1 data-animate="title" className="mt-6 font-serif text-5xl leading-[0.95] font-extralight md:text-7xl">
          {content.siteTitle ?? "Les Massages d'Helene"}
        </h1>
        {content.siteSubtitle ? (
          <p className="mt-4 text-base md:text-lg" style={{ color: textColor, opacity: 0.9 }}>
            {content.siteSubtitle}
          </p>
        ) : null}
        <p data-animate="text" className="mt-5 text-xl md:text-3xl" style={{ opacity: 0.9 }}>
          {activeSlide?.title ?? "Pause ayurvedique"}
        </p>
        {activeSlide?.subtitle && (
          <p data-animate="text" className="mt-7 max-w-2xl text-lg" style={{ opacity: 0.8 }}>
            {activeSlide.subtitle}
          </p>
        )}
        {content.buttonText ? (
          content.buttonLink ? (
            <TransitionLink
              href={content.buttonLink}
              className="mt-10 inline-flex rounded-full bg-gold-default px-7 py-3 text-sm font-semibold tracking-[0.1em] text-brown-darker uppercase hover:bg-gold-dark"
            >
              {content.buttonText}
            </TransitionLink>
          ) : (
            <span className="mt-10 inline-flex rounded-full bg-gold-default px-7 py-3 text-sm font-semibold tracking-[0.1em] text-brown-darker uppercase">
              {content.buttonText}
            </span>
          )
        ) : null}
      </div>
    </section>
  );
}
