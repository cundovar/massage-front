"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import type { EntrepriseContent } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const characteristics = [
  {
    label: "10-20 min",
    path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Dans vos locaux",
    path: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    label: "Sans huile",
    path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Chaise ergo",
    path: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
];

interface MassageAmmaProps {
  content: EntrepriseContent;
}

export function MassageAmma({ content }: MassageAmmaProps) {
  const iconContainerRef = useRef<HTMLDivElement | null>(null);
  const characteristicItems = content.characteristics.length > 0 ? content.characteristics : characteristics.map((item) => item.label);

  useEffect(() => {
    const container = iconContainerRef.current;
    if (!container) return;

    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    if (!mediaQuery.matches) return;

    const icons = Array.from(container.querySelectorAll<HTMLElement>("[data-amma-icon]"));
    if (icons.length === 0) return;

    const context = gsap.context(() => {
      icons.forEach((icon, index) => {
        gsap.fromTo(
          icon,
          { autoAlpha: 0, x: -50, scale: 0.8 },
          {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: icon,
              start: "top 85%",
              end: "top 20%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });
    }, container);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section className="border-t border-sand-800/20 overflow-hidden" aria-labelledby="entreprise">
      <div className="space-y-16">
        <ScrollReveal>
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-px w-12 bg-amber-500/60" />
            </div>
            <h2
              id="entreprise"
              className="font-serif text-5xl font-extralight tracking-tight leading-tight text-sand-100 sm:text-6xl"
              style={{ fontFamily: "var(--font-title)" }}
            >
              {content.title}
            </h2>
            {content.subtitle ? (
              <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-sand-200/70">{content.subtitle}</p>
            ) : null}
          </div>
        </ScrollReveal>

        <div className="grid gap-16 md:grid-cols-2 max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="border border-sand-800/20 bg-gradient-to-br from-sand-900/10 to-transparent p-10">
              <div className="mb-8 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
                  <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-8 text-center text-2xl font-light tracking-wide text-sand-100">{content.teamTitle}</h3>
              <ul className="space-y-4 text-lg font-light leading-relaxed text-sand-200/70">
                {content.teamBenefits.map((item) => (
                  <li key={item} className="flex items-start">
                    <svg className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-amber-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="border border-sand-800/20 bg-gradient-to-br from-sand-900/10 to-transparent p-10">
              <div className="mb-8 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
                  <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-8 text-center text-2xl font-light tracking-wide text-sand-100">{content.companyTitle}</h3>
              <ul className="space-y-4 text-lg font-light leading-relaxed text-sand-200/70">
                {content.companyBenefits.map((item) => (
                  <li key={item} className="flex items-start">
                    <svg className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-amber-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="mx-auto max-w-4xl border-2 border-amber-700/30 bg-gradient-to-br from-sand-900/15 to-transparent p-12">
            <div ref={iconContainerRef} className="flex flex-wrap items-center justify-center gap-8">
              {characteristicItems.slice(0, 4).map((label, index) => (
                <div key={label} data-amma-icon className="flex max-lg:w-1/2 flex-col items-center space-y-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
                    <svg className="h-8 w-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={characteristics[index]?.path ?? characteristics[0].path} />
                    </svg>
                  </div>
                  <span className="text-sm text-sand-300/70">{label}</span>
                </div>
              ))}
            </div>

            <div className="my-8 flex justify-center">
              <div className="h-px w-24 bg-amber-500/30" />
            </div>

            <p className="mx-auto max-w-2xl text-center text-2xl font-light italic leading-relaxed text-sand-100">
              {content.quote}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
