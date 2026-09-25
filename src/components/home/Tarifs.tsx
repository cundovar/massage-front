import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ServiceCard, type ServicePrice } from "@/components/shared/ServiceCard";
import type { TarifsContent } from "@/types";
import { RichText } from "@/components/dynamic/RichText";
import { hasRichText } from "@/lib/richText";

interface TarifsProps {
  content: TarifsContent;
  bookingUrl?: string;
}

function parsePrice(raw: string): ServicePrice {
  const normalized = raw.replace(/\s+/g, " ").trim();
  const priceMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:EUR|EUROS?|€)\b/i);

  if (!priceMatch) {
    return { label: normalized };
  }

  const value = Number.parseFloat(priceMatch[1].replace(",", "."));
  const beforePrice = normalized.slice(0, priceMatch.index).replace(/[·\-–—\s]+$/g, "").trim();
  const afterPrice = normalized.slice((priceMatch.index ?? 0) + priceMatch[0].length).replace(/^[·\-–—\s]+/g, "").trim();

  return {
    label: beforePrice || "Seance",
    price: Number.isNaN(value) ? undefined : value,
    unit: afterPrice || undefined,
  };
}

export function Tarifs({ content, bookingUrl = "/reservation" }: TarifsProps) {
  const hasBookingLinkField = Object.prototype.hasOwnProperty.call(content, "bookingLink");
  const customBookingLink = content.bookingLink?.trim() || "";
  const resolvedBookingUrl = customBookingLink || bookingUrl;
  const showBookingButton = hasBookingLinkField ? customBookingLink.length > 0 : true;
  const bookingLinkNewTab = String(content.bookingLinkNewTab ?? "false") === "true";
  // Une offre sans nom ni description n'est pas affichee.
  const offers = (content.offers ?? []).filter((offer) => hasRichText(offer.title) || hasRichText(offer.description));

  return (
    <section id="tarifs" className="mt-20" data-animate="section">
      <ScrollReveal>
        <div className="js-tarifs-header mx-auto max-w-3xl text-center">
          <div className="mx-auto h-px w-24 bg-[var(--primary-start)]" />
          {hasRichText(content.title) ? (
            <h2
              data-animate="title"
              className="mt-6 text-4xl font-light md:text-5xl"
              style={{ fontFamily: "var(--font-title)" }}
            >
              <RichText value={content.title} />
            </h2>
          ) : null}
          {hasRichText(content.subtitle) ? (
            <p data-animate="text" className="mt-5 text-lg text-[var(--text-secondary)]">
              <RichText value={content.subtitle} />
            </p>
          ) : null}
        </div>
      </ScrollReveal>

      {/* Grille adaptative : centrée si 1-2 items, grille complète si 3+ */}
      <div
        className={`js-offers-grid mx-auto mt-12 grid gap-8 ${
          offers.length === 1
            ? "max-w-xl"
            : offers.length === 2
              ? "max-w-3xl md:grid-cols-2"
              : "max-w-6xl md:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {offers.map((offer, index) => (
          <ScrollReveal key={`${index}-${offer.title.slice(0, 24)}`} className="h-full">
            <div className="js-offer-card h-full">
              <ServiceCard
                category={content.title}
                title={offer.title}
                description={offer.description}
                prices={(offer.prices ?? []).filter((price) => price.trim() !== "").map(parsePrice)}
                bookingUrl={resolvedBookingUrl}
                bookingLinkNewTab={bookingLinkNewTab}
                showBookingButton={showBookingButton}
                className="h-full"
              />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
