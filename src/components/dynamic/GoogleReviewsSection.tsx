import { ExternalLink, Quote, Star } from "lucide-react";
import { RichText } from "@/components/dynamic/RichText";
import { hasRichText } from "@/lib/richText";

export interface GoogleReviewItem {
  name?: string;
  rating?: number | string;
  text?: string;
  date?: string;
}

export interface GoogleReviewsContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  averageRating?: number | string;
  totalReviews?: number | string;
  googleUrl?: string;
  buttonText?: string;
  reviews?: GoogleReviewItem[];
}

function normalizeRating(value: number | string | undefined, fallback = 5): number {
  const rating = Number(value ?? fallback);
  return Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : fallback;
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex gap-1" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`h-4 w-4 ${index < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`}
        />
      ))}
    </div>
  );
}

export function GoogleReviewsSection({ content }: { content: GoogleReviewsContent }) {
  const averageRating = normalizeRating(content.averageRating, 5);
  // Un avis sans texte n'est pas affiche aux visiteurs.
  const reviews = (Array.isArray(content.reviews) ? content.reviews : []).filter((review) => hasRichText(review.text));
  const eyebrow = content.eyebrow ?? "Avis Google";
  const title = content.title ?? "Elles partagent leur expérience";

  return (
    <section className="relative overflow-hidden px-6 py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--primary-start)_15%,transparent),transparent_42%)]" />
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_2fr] lg:items-end">
          <div>
            {hasRichText(eyebrow) ? (
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--primary-start)]">
                <RichText value={eyebrow} />
              </p>
            ) : null}
            {hasRichText(title) ? (
              <h2 className="mt-3 font-serif text-4xl font-light text-[var(--text-primary)] md:text-5xl">
                <RichText value={title} />
              </h2>
            ) : null}
            {hasRichText(content.subtitle) ? (
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
                <RichText value={content.subtitle} />
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:justify-end">
            <span className="font-serif text-5xl text-[var(--text-primary)]">{averageRating.toFixed(1)}</span>
            <div>
              <Stars rating={averageRating} label={`Note moyenne ${averageRating.toFixed(1)} sur 5`} />
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {content.totalReviews ? `${content.totalReviews} avis sur Google` : "Avis publiés sur Google"}
              </p>
            </div>
          </div>
        </div>

        {reviews.length > 0 ? (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((review, index) => {
            const rating = normalizeRating(review.rating);
            return (
              <article
                key={`${review.name || "avis"}-${index}`}
                className="glass-panel flex min-h-64 flex-col rounded-3xl p-7 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <Stars rating={rating} label={`${rating} étoiles sur 5`} />
                  <Quote className="h-7 w-7 text-[var(--primary-start)] opacity-45" aria-hidden="true" />
                </div>
                <p className="mt-6 flex-1 text-base leading-relaxed text-[var(--text-secondary)]">
                  <RichText value={review.text} />
                </p>
                <footer className="mt-7 border-t border-[var(--card-border)] pt-5">
                  <p className="font-medium text-[var(--text-primary)]">{review.name || "Cliente Google"}</p>
                  {review.date ? <p className="mt-1 text-sm text-[var(--text-secondary)]">{review.date}</p> : null}
                </footer>
              </article>
            );
          })}
        </div>
        ) : null}

        {content.googleUrl ? (
          <div className="mt-10 text-center">
            <a
              href={content.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-start)] px-7 py-3 font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              {content.buttonText || "Voir tous les avis Google"}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
