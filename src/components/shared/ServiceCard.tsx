"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";

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
        bg-white/90
        p-8 md:p-10
        shadow-xl shadow-black/[0.03]
        backdrop-blur-md
        transition-all duration-500
        hover:border-[var(--primary-start)]/25
        hover:shadow-2xl hover:shadow-black/[0.08]
        dark:bg-[var(--card-bg)]/90
        ${className}
      `}
    >
      {/* Catégorie / Sous-titre */}
      {category ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-start)]/80">
          {category}
        </p>
      ) : null}

      {/* Titre principal */}
      <h3
        className="text-3xl font-light tracking-tight text-[var(--text-primary)] md:text-4xl"
        style={{ fontFamily: "var(--font-title)" }}
      >
        {title}
      </h3>

      {/* Ligne décorative */}
      <div className="my-5 h-px w-16 bg-gradient-to-r from-[var(--primary-start)] to-transparent" />

      {/* Description */}
      <p className="flex-grow leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>

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
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {price.label}
              </span>
              <span className="text-2xl font-semibold text-[var(--primary-start)]">
                {typeof price.price === "number" ? formatPrice(price.price) : null}
                {price.unit ? (
                  <span className="ml-1 text-sm font-normal text-[var(--text-secondary)]">
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
            className="
              inline-flex w-full items-center justify-center
              rounded-full
              px-8 py-4
              text-sm font-semibold uppercase tracking-wider text-white
              shadow-lg shadow-[var(--primary-start)]/20
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--primary-start)]/30
              active:scale-[0.98]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-start)] focus-visible:ring-offset-2
            "
            style={{ background: "var(--gradient-primary)" }}
          >
            Réserver ce soin
          </TransitionLink>
        </div>
      ) : null}
    </article>
  );
}
