"use client";

import { useEffect, useMemo, useState } from "react";
import type { TarifsContent } from "@/types";
import { RichText } from "@/components/dynamic/RichText";
import { hasRichText, toPlainText } from "@/lib/richText";

interface ServiceSelectorProps {
  content: TarifsContent;
}

export function ServiceSelector({ content }: ServiceSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const offers = useMemo(() => (content.offers ?? []).filter((offer) => hasRichText(offer.title)), [content.offers]);
  const activeOffer = offers[activeIndex] ?? offers[0];

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (!hash) return;
      const index = offers.findIndex((offer) =>
        toPlainText(offer.title).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(hash),
      );
      if (index >= 0) {
        setActiveIndex(index);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [offers]);

  return (
    <section className="py-20" id="soins">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10">
          {hasRichText(content.title) ? (
            <h2 className="block-title">
              <RichText value={content.title} />
            </h2>
          ) : null}
          {hasRichText(content.subtitle) ? (
            <p className="block-body mt-4">
              <RichText value={content.subtitle} />
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 md:gap-10 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
          <aside className="w-full flex-shrink-0 border-b border-[var(--card-border)] pb-4 md:w-60 md:border-b-0 md:border-r md:pb-0 md:pr-4 lg:w-64">
            <div className="space-y-2 overflow-x-auto whitespace-nowrap md:overflow-visible md:whitespace-normal scrollbar-hide">
            {offers.map((offer, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${index}-${offer.title.slice(0, 24)}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`inline-flex w-auto min-w-[44px] md:w-full rounded-full border px-4 py-2 text-left text-sm transition ${
                    isActive
                      ? "border-[var(--primary-start)] bg-[color-mix(in_srgb,var(--primary-start)_10%,transparent)] text-[var(--text-primary)]"
                      : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--primary-start)]"
                  }`}
                >
                  <RichText value={offer.title} />
                </button>
              );
            })}
            </div>
          </aside>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-sm">
            <h3 className="block-card-title">
              <RichText value={activeOffer?.title} />
            </h3>
            {hasRichText(activeOffer?.description) ? (
              <p className="block-body mt-4">
                <RichText value={activeOffer?.description} />
              </p>
            ) : null}
            <div className="mt-6 space-y-2">
              {(activeOffer?.prices ?? []).filter((price) => price.trim() !== "").map((price, index) => (
                <p key={`${index}-${price}`} className="block-body text-[var(--text-primary)]">
                  {price}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
