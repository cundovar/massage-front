"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageUrl } from "@/lib/api";
import type { ApprocheContent } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

interface ApprocheProps {
  content: ApprocheContent;
}

export function Approche({ content }: ApprocheProps) {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const imageSources =
    Array.isArray(content.images) && content.images.length > 0
      ? content.images
      : content.image
        ? [content.image]
        : [];
  const imageUrls = imageSources
    .map((src) => getImageUrl(src))
    .filter((src): src is string => Boolean(src));

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { opacity: 0, x: -80, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: leftRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      if (rightRef.current) {
        gsap.from(rightRef.current.querySelectorAll("[data-anim-child]"), {
          opacity: 0,
          x: 80,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: rightRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      if (gridRef.current) {
        const images = gridRef.current.querySelectorAll<HTMLImageElement>("img");

        images.forEach((img, index) => {
          if (!img.parentElement) return;

          gsap.fromTo(
            img.parentElement,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: index * 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );

          const direction = index % 2 === 0 ? 1 : -1;
          const distance = index === 0 ? 100 : 70;

          gsap.fromTo(
            img,
            { y: direction * distance, scale: 1.1 },
            {
              y: -direction * distance,
              scale: 1.1,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                toggleActions: "play reverse play reverse",
              },
            },
          );
        });
      }
    });

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section id="parcours" className="mb-10 mt-20 grid gap-10 lg:grid-cols-2">
      <div ref={leftRef} className="hidden lg:block">
        {imageUrls.length > 0 ? (
          imageUrls.length === 1 ? (
            <div ref={gridRef} className="glass-panel group relative h-[500px] overflow-hidden rounded-2xl" data-approche-card>
              <Image
                src={imageUrls[0]}
                alt="Approche"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--text-primary) 20%, transparent), transparent)",
                }}
              />
            </div>
          ) : (
            <div ref={gridRef} className="grid h-[500px] grid-cols-2 grid-rows-2 gap-3">
              {imageUrls.slice(0, 4).map((url, index) => (
                <div key={url} className="glass-panel group relative overflow-hidden rounded-2xl" data-approche-card>
                  <Image
                    src={url}
                    alt={`Approche ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, color-mix(in srgb, var(--text-primary) 20%, transparent), transparent)",
                    }}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <div ref={gridRef} className="grid h-[500px] grid-cols-6 grid-rows-4 gap-1">
            <div
              className="rounded-lg shadow-xl [grid-area:1/1/4/5]"
              style={{ background: "color-mix(in srgb, var(--primary-start) 70%, var(--card-bg))" }}
              data-approche-card
            />
            <div
              className="rounded-lg shadow-xl [grid-area:1/5/3/7]"
              style={{ background: "color-mix(in srgb, var(--primary-start) 60%, var(--card-bg))" }}
              data-approche-card
            />
            <div
              className="rounded-lg shadow-xl [grid-area:3/5/5/7]"
              style={{ background: "color-mix(in srgb, var(--primary-end) 60%, var(--card-bg))" }}
              data-approche-card
            />
            <div
              className="rounded-lg shadow-xl [grid-area:4/1/5/5]"
              style={{ background: "color-mix(in srgb, var(--primary-end) 70%, var(--card-bg))" }}
              data-approche-card
            />
          </div>
        )}
      </div>

      <div ref={rightRef}>
        <div className="space-y-6">
          <div className="h-px w-16 bg-[var(--primary-start)]" data-anim-child />
          <h2 className="text-5xl font-extralight md:text-6xl" style={{ fontFamily: "var(--font-title)" }} data-anim-child>
            Approche
          </h2>
          <div
            className="rounded-r-xl px-5 py-4 text-[var(--text-secondary)]"
            style={{
              borderLeft: "2px solid color-mix(in srgb, var(--primary-start) 40%, transparent)",
              background: "color-mix(in srgb, var(--primary-start) 10%, transparent)",
            }}
            data-anim-child
          >
            <p className="mb-2 text-xl font-semibold text-[var(--text-primary)]">{content.bulletsTitle ?? "Ce qui guide mes mains :"}</p>
            <ul className="space-y-2 text-lg leading-relaxed">
              {(content.bullets ?? []).map((bullet) => (
                <li key={bullet}>• {bullet}</li>
              ))}
            </ul>
          </div>
          <p className="text-xl font-semibold italic text-[var(--text-secondary)]" data-anim-child>
            {content.quote ?? "Chaque soin est pense comme une pause pour vous recentrer et vous alleger."}
          </p>
        </div>
      </div>
    </section>
  );
}
