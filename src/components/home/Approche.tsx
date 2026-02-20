"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageUrl } from "@/lib/api";
import type { ApprocheContent } from "@/lib/api";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ApprocheProps {
  content: ApprocheContent;
}

export function Approche({ content }: ApprocheProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const imageSources =
    Array.isArray(content.images) && content.images.length > 0
      ? content.images
      : content.image
        ? [content.image]
        : [];
  const imageUrls = imageSources
    .map((src) => getImageUrl(src))
    .filter((src): src is string => Boolean(src));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;

    // Attendre que le DOM soit prêt
    const timeout = setTimeout(() => {
      ctx = gsap.context(() => {
        // Animation du bloc gauche (images)
        if (leftRef.current) {
          gsap.fromTo(
            leftRef.current,
            { opacity: 0, x: -50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: leftRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // Animation du bloc droit (texte)
        if (rightRef.current) {
          const children = rightRef.current.querySelectorAll("[data-anim-child]");
          gsap.fromTo(
            children,
            { opacity: 0, x: 50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: rightRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      }, section);
    }, 100);

    return () => {
      clearTimeout(timeout);
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="parcours" className="mb-10 mt-20 grid gap-10 lg:grid-cols-2">
      <div className="lg:hidden">
        {imageUrls.length > 0 ? (
          <div className="glass-panel group relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={imageUrls[0]}
              alt="Approche"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
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
          <div className="aspect-[4/3] rounded-2xl" style={{ background: "var(--background-alt)" }} />
        )}
      </div>

      <div ref={leftRef} className="hidden lg:block">
        {imageUrls.length > 0 ? (
          imageUrls.length === 1 ? (
            <div className="glass-panel group relative h-[500px] overflow-hidden rounded-2xl" data-approche-card>
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
            <div className="grid h-[500px] grid-cols-2 grid-rows-2 gap-3">
              {imageUrls.slice(0, 4).map((url, index) => (
                <div key={`approche-img-${index}`} className="glass-panel group relative overflow-hidden rounded-2xl" data-approche-card>
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
          <div className="grid h-[500px] grid-cols-6 grid-rows-4 gap-1">
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
