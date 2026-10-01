"use client";

import { RichText } from "@/components/dynamic/RichText";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { hasRichText } from "@/lib/richText";

export interface ServicePrice {
  label: string;
  price?: number;
  unit?: string;
}

export interface ServiceCardProps {
  category?: string;
  title: string;
  description: string;
  prices: ServicePrice[];
  bookingUrl?: string;
  bookingLinkNewTab?: boolean;
  showBookingButton?: boolean;
  className?: string;
}

function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(price)}€`;
}

export function ServiceCard({
  category,
  title,
  description,
  prices,
  bookingUrl = "/reservation",
  bookingLinkNewTab = false,
  showBookingButton = true,
  className = "",
}: ServiceCardProps) {
  return (
    <article
      className={`
        group
        flex flex-col
        rounded-[24px]
        border border-[var(--primary-start)]/15
        bg-[var(--card-bg)]/90
        p-8 md:p-10
        shadow-xl shadow-black/[0.03]
        backdrop-blur-md
        transition-all duration-500
        hover:border-[var(--primary-start)]/25
        hover:shadow-2xl hover:shadow-black/[0.08]
        ${className}
      `}
    >
      {/* Catégorie / Sous-titre */}
      {hasRichText(category) ? (
        <p className="block-eyebrow mb-3">
          <RichText value={category} />
        </p>
      ) : null}

      {/* Titre principal */}
      <h3 className="block-card-title">
        <RichText value={title} />
      </h3>

      {/* Ligne décorative */}
      <div className="my-5 h-px w-16 bg-gradient-to-r from-[var(--primary-start)] to-transparent" />

      {/* Description */}
      {hasRichText(description) ? (
        <p className="block-body flex-grow">
          <RichText value={description} />
        </p>
      ) : (
        <div className="flex-grow" />
      )}

      {/* Bloc prix */}
      {prices.length > 0 ? (
        <div className="mt-8 space-y-3">
          {prices.map((price, index) => (
            <div
              key={`${price.label}-${index}`}
              className="
                flex items-center justify-between
                rounded-2xl
                border border-[var(--card-border)]
                bg-[var(--background-alt)]/80
                px-5 py-4
                transition-colors duration-300
                hover:bg-[var(--background-alt)]
              "
            >
              <span className="block-body text-sm font-medium">
                {price.label}
              </span>
              <span className="text-2xl font-semibold text-[var(--primary-start)]">
                {typeof price.price === "number" ? formatPrice(price.price) : null}
                {price.unit ? (
                  <span className="block-body ml-1 text-sm font-normal">
                    / {price.unit}
                  </span>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {/* Bouton CTA */}
      {showBookingButton ? (
        <div className="mt-8">
          <TransitionLink
            href={bookingUrl}
            target={bookingLinkNewTab ? "_blank" : undefined}
            rel={bookingLinkNewTab ? "noopener noreferrer" : undefined}
            className="
              inline-flex w-full items-center justify-center
              rounded-full
              px-8 py-4
              text-sm font-semibold text-[var(--btn-text)]
              shadow-lg shadow-[var(--primary-start)]/20
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--primary-start)]/30
              active:scale-[0.98]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-start)] focus-visible:ring-offset-2
            "
            style={{ background: "var(--btn-bg)" }}
          >
            Réserver ce soin
          </TransitionLink>
        </div>
      ) : null}
    </article>
  );
}
