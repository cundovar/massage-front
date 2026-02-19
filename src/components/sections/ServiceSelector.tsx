"use client";

import { useEffect, useState } from "react";
import type { TarifsContent } from "@/types";

interface ServiceSelectorProps {
  content: TarifsContent;
}

export function ServiceSelector({ content }: ServiceSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOffer = content.offers[activeIndex] ?? content.offers[0];

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (!hash) return;
      const index = content.offers.findIndex((offer) =>
        offer.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(hash),
      );
      if (index >= 0) {
        setActiveIndex(index);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [content.offers]);

  return (
    <section className="py-20" id="soins">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <h2 className="heading-section">{content.title}</h2>
          {content.subtitle ? <p className="mt-4 text-lg text-gray-600">{content.subtitle}</p> : null}
        </div>

        <div className="grid gap-6 md:gap-10 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
          <aside className="w-full md:w-60 lg:w-64 flex-shrink-0 border-b border-gray-200 pb-4 md:border-b-0 md:border-r md:pr-4 md:pb-0">
            <div className="space-y-2 overflow-x-auto whitespace-nowrap md:overflow-visible md:whitespace-normal scrollbar-hide">
            {content.offers.map((offer, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={offer.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`inline-flex w-auto min-w-[44px] md:w-full rounded-full border px-4 py-2 text-left text-sm transition ${
                    isActive
                      ? "border-orange-400 bg-orange-50 text-gray-900"
                      : "border-gray-200 text-gray-600 hover:border-orange-300"
                  }`}
                >
                  {offer.title}
                </button>
              );
            })}
            </div>
          </aside>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="text-3xl" style={{ fontFamily: "var(--font-serif)" }}>
              {activeOffer?.title}
            </h3>
            {activeOffer?.description ? (
              <p className="mt-4 text-gray-600">{activeOffer.description}</p>
            ) : null}
            <div className="mt-6 space-y-2">
              {activeOffer?.prices.map((price) => (
                <p key={price} className="text-lg text-gray-800">
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
