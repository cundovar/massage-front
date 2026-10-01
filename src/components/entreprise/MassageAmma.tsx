"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import type { EntrepriseContent } from "@/types";
import { RichText } from "@/components/dynamic/RichText";
import { hasRichText } from "@/lib/richText";

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
  const filledCharacteristics = (content.characteristics ?? []).filter((item) => hasRichText(item));
  const characteristicItems =
    filledCharacteristics.length > 0 ? filledCharacteristics : characteristics.map((item) => item.label);
  const teamBenefits = (content.teamBenefits ?? []).filter((item) => hasRichText(item));
  const companyBenefits = (content.companyBenefits ?? []).filter((item) => hasRichText(item));

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
    <section className="scroll-mt-28 overflow-hidden border-t border-[var(--card-border)] px-5 pt-24 sm:px-0 sm:pt-28 lg:pt-0" aria-labelledby="entreprise">
      <div className="space-y-16">
        <ScrollReveal>
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-px w-12 bg-[color-mix(in_srgb,var(--primary-start)_60%,transparent)]" />
            </div>
            {hasRichText(content.title) ? (
              <h2 id="entreprise" className="block-title">
                <RichText value={content.title} />
              </h2>
            ) : null}
            {hasRichText(content.subtitle) ? (
              <p className="block-body mx-auto max-w-3xl">
                <RichText value={content.subtitle} />
              </p>
            ) : null}
          </div>
        </ScrollReveal>

        <div className="grid gap-16 md:grid-cols-2 max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="border border-[var(--card-border)] bg-[var(--card-bg)] p-10">
              <div className="mb-8 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--primary-start)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary-start)_10%,transparent)]">
                  <svg className="h-7 w-7 text-[var(--primary-start)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              {hasRichText(content.teamTitle) ? (
                <h3 className="block-card-title mb-8 text-center">
                  <RichText value={content.teamTitle} />
                </h3>
              ) : null}
              {teamBenefits.length > 0 ? (
              <ul className="block-body space-y-4">
                {teamBenefits.map((item, index) => (
                  <li key={`${index}-${item.slice(0, 24)}`} className="flex items-start">
                    <svg className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-[color-mix(in_srgb,var(--primary-start)_60%,transparent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                      <RichText value={item} />
                    </span>
                  </li>
                ))}
              </ul>
              ) : null}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="border border-[var(--card-border)] bg-[var(--card-bg)] p-10">
              <div className="mb-8 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--primary-start)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary-start)_10%,transparent)]">
                  <svg className="h-7 w-7 text-[var(--primary-start)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              {hasRichText(content.companyTitle) ? (
                <h3 className="block-card-title mb-8 text-center">
                  <RichText value={content.companyTitle} />
                </h3>
              ) : null}
              {companyBenefits.length > 0 ? (
              <ul className="block-body space-y-4">
                {companyBenefits.map((item, index) => (
                  <li key={`${index}-${item.slice(0, 24)}`} className="flex items-start">
                    <svg className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-[color-mix(in_srgb,var(--primary-start)_60%,transparent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                      <RichText value={item} />
                    </span>
                  </li>
                ))}
              </ul>
              ) : null}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="mx-auto max-w-4xl border-2 border-[color-mix(in_srgb,var(--primary-start)_30%,transparent)] bg-[var(--card-bg)] p-12">
            <div ref={iconContainerRef} className="flex flex-wrap items-center justify-center gap-8">
              {characteristicItems.slice(0, 4).map((label, index) => (
                <div key={`${index}-${label.slice(0, 24)}`} data-amma-icon className="flex max-lg:w-1/2 flex-col items-center space-y-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--primary-start)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary-start)_10%,transparent)]">
                    <svg className="h-8 w-8 text-[var(--primary-start)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={characteristics[index]?.path ?? characteristics[0].path} />
                    </svg>
                  </div>
                  <span className="block-body text-sm">
                    <RichText value={label} />
                  </span>
                </div>
              ))}
            </div>

            {hasRichText(content.quote) ? (
              <>
                <div className="my-8 flex justify-center">
                  <div className="h-px w-24 bg-[color-mix(in_srgb,var(--primary-start)_30%,transparent)]" />
                </div>

                <p className="block-quote mx-auto max-w-2xl text-center italic">
                  <RichText value={content.quote} />
                </p>
              </>
            ) : null}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
