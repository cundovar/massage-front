import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import type { TarifsContent } from "@/types";

interface TarifsProps {
  content: TarifsContent;
}

export function Tarifs({ content }: TarifsProps) {
  return (
    <section id="tarifs" className="mt-20" data-animate="section">
      <ScrollReveal>
        <div className="js-tarifs-header mx-auto max-w-3xl text-center">
          <div className="mx-auto h-px w-24 bg-[var(--primary-start)]" />
          <h2
            data-animate="title"
            className="mt-6 text-5xl font-extralight md:text-6xl"
            style={{ fontFamily: "var(--font-title)" }}
          >
            {content.title}
          </h2>
          {content.subtitle ? (
            <p data-animate="text" className="mt-5 text-lg text-[var(--text-secondary)]">
              {content.subtitle}
            </p>
          ) : null}
        </div>
      </ScrollReveal>

      <div className="js-offers-grid mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {content.offers.map((offer) => (
          <ScrollReveal key={offer.title}>
            <article
              className="js-offer-card bg-[var(--card-bg)] p-6 transition-colors duration-500"
              style={{
                borderRadius: "var(--card-radius)",
                border: "1px solid color-mix(in srgb, var(--primary-start) 20%, transparent)",
              }}
            >
              <h3 className="text-3xl font-light" style={{ fontFamily: "var(--font-title)" }}>
                {offer.title}
              </h3>
              <p className="mt-4 leading-loose text-[var(--text-secondary)]">{offer.description}</p>
              <ul className="mt-5 space-y-1 text-sm text-[var(--text-secondary)]">
                {offer.prices.map((price) => (
                  <li key={price}>{price}</li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-12 pt-8 text-center" style={{ borderTop: "1px solid var(--card-border)" }}>
        <p data-animate="text" className="text-lg text-[var(--text-secondary)]">
          Chaque massage commence par un echange pour personnaliser le soin.
        </p>
        <TransitionLink
          href="/contact"
          className="mt-5 inline-flex rounded-full px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--primary-start)" }}
        >
          Me contacter
        </TransitionLink>
      </div>
    </section>
  );
}
