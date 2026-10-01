import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ServiceCard, type ServicePrice } from "@/components/shared/ServiceCard";
import type { TarifsContent } from "@/types";
import { RichText } from "@/components/dynamic/RichText";
import { hasRichText } from "@/lib/richText";
import { getBlockLayout, getCardGrid, type GridColumnCount } from "@/components/dynamic/responsiveLayout";

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
  // Grille adaptative : 1, 2 ou 3 colonnes selon le nombre d'offres, ajustable dans « Apparence ».
  const maxColumns: GridColumnCount = offers.length <= 1 ? 1 : offers.length === 2 ? 2 : 3;
  const grid = getCardGrid(getBlockLayout(content), {
    defaultTablet: Math.min(maxColumns, 2) as GridColumnCount,
    defaultDesktop: maxColumns,
    max: maxColumns,
    desktopBreakpoint: "xl",
  });
  const widestColumns = Math.max(grid.tabletColumns, grid.desktopColumns);
  const gridWidth = widestColumns === 1 ? "max-w-xl" : widestColumns === 2 ? "max-w-3xl" : "max-w-6xl";

  return (
    <section id="tarifs" className="mt-20 px-5 sm:px-0" data-animate="section">
      <ScrollReveal>
        <div className="js-tarifs-header mx-auto max-w-3xl text-center">
          <div className="mx-auto h-px w-24 bg-[var(--primary-start)]" />
          {hasRichText(content.title) ? (
            <h2 data-animate="title" className="block-title mt-6">
              <RichText value={content.title} />
            </h2>
          ) : null}
          {hasRichText(content.subtitle) ? (
            <p data-animate="text" className="block-body mt-5">
              <RichText value={content.subtitle} />
            </p>
          ) : null}
        </div>
      </ScrollReveal>

      <div className={`js-offers-grid mx-auto mt-12 grid gap-8 ${gridWidth} ${grid.className}`}>
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
