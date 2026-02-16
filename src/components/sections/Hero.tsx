"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroContent } from "@/types/sections";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface HeroProps {
  content: HeroContent;
}

export function Hero({ content }: HeroProps) {
  const { siteTitle, slides } = content;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Rotation automatique des slides (si plusieurs)
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide];
  if (!slide) return null;

  // Construire l'URL de l'image (depuis API ou chemin relatif)
  const imageUrl = slide.image.startsWith("http")
    ? slide.image
    : `${API_URL}${slide.image}`;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={slide.title}
          fill
          priority
          className="object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        {/* Site Title (éditable) */}
        {siteTitle && (
          <p className="text-lg md:text-xl mb-4 opacity-90 tracking-wide">
            {siteTitle}
          </p>
        )}

        {/* Slide Title (éditable) */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight">
          {slide.title}
        </h1>

        {/* Slide Subtitle (éditable) */}
        {slide.subtitle && (
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {slide.subtitle}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/soins"
            className="px-8 py-4 bg-gradient-to-r from-[#FFCE67] to-[#F67E54] rounded-full text-white font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
          >
            Découvrir les soins
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 border-2 border-white rounded-full text-white font-medium hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </div>

      {/* Slide Indicators (si plusieurs slides) */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce hidden md:block">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}