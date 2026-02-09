import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import type { TarifsContent } from "@/types";

interface TarifsProps {
  content: TarifsContent;
}

export function Tarifs({ content }: TarifsProps) {
  return (
    <section id="tarifs" className="mt-20">
      <ScrollReveal>
        <div className="js-tarifs-header mx-auto max-w-3xl text-center">
          <div className="mx-auto h-px w-24 bg-amber-500" />
          <h2 className="mt-6 text-5xl font-extralight md:text-6xl" style={{ fontFamily: "var(--font-title)" }}>
            {content.title}
          </h2>
          {content.subtitle ? <p className="mt-5 text-lg text-[var(--muted)]">{content.subtitle}</p> : null}
        </div>
      </ScrollReveal>

      <div className="js-offers-grid mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {content.offers.map((offer) => (
          <ScrollReveal key={offer.title}>
            <article className="js-offer-card rounded-xl border border-amber-900/20 bg-gradient-to-br from-amber-900/10 to-[var(--panel)] p-6 transition-colors duration-500 hover:border-amber-700/40">
              <h3 className="text-3xl font-light" style={{ fontFamily: "var(--font-title)" }}>
                {offer.title}
              </h3>
              <p className="mt-4 leading-loose text-[var(--muted)]">{offer.description}</p>
              <ul className="mt-5 space-y-1 text-sm text-stone-700">
                {offer.prices.map((price) => (
                  <li key={price}>{price}</li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-12 border-t border-[var(--line)] pt-8 text-center">
        <p className="text-lg text-[var(--muted)]">Chaque massage commence par un echange pour personnaliser le soin.</p>
        <Link href="/contact" className="mt-5 inline-flex rounded-full bg-amber-500 px-6 py-3 font-semibold text-black hover:bg-amber-600">
          Me contacter
        </Link>
      </div>
    </section>
  );
}
