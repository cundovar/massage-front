import Image from "next/image";
import type { ServiceItem } from "@/types";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { RichText } from "@/components/dynamic/RichText";
import { getImageUrl } from "@/lib/api";
import { hasRichText, toPlainText } from "@/lib/richText";

interface ImageValueObject {
  path?: string | null;
  url?: string | null;
}

export interface ServicePreviewItem {
  name?: string;
  category?: string;
  description?: string;
  price?: string;
  image?: string | ImageValueObject | null;
  link?: string;
}

export interface ServicesPreviewContent {
  subtitle?: string;
  title?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: ServicePreviewItem[];
}

interface ServicesPreviewProps {
  services?: ServiceItem[];
  content?: ServicesPreviewContent;
}

export function ServicesPreview({ services = [], content }: ServicesPreviewProps) {
  const subtitle = content?.subtitle ?? "Mes soins";
  const title = content?.title ?? "Une gamme de soins pour votre bien-être";

  // Utiliser les items manuels s'ils existent et ont du contenu, sinon utiliser les services API
  const manualItems = content?.items?.filter((item) => hasRichText(item.name)) || [];
  const useManualItems = manualItems.length > 0;

  // Adapter le nombre de colonnes selon le nombre d'items
  const itemCount = useManualItems ? manualItems.length : services.length;
  const gridCols =
    itemCount === 1
      ? "md:grid-cols-1 max-w-md mx-auto"
      : itemCount === 2
        ? "md:grid-cols-2 max-w-3xl mx-auto"
        : "md:grid-cols-3";

  return (
    <section className="bg-transparent py-24 md:py-32" data-animate="section">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16 text-center">
          {hasRichText(subtitle) ? (
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--primary-start)]">
              <RichText value={subtitle} />
            </p>
          ) : null}
          {hasRichText(title) ? (
            <h2 data-animate="title" className="text-4xl font-serif text-[var(--text-primary)] md:text-5xl">
              <RichText value={title} />
            </h2>
          ) : null}
        </AnimatedSection>

        <div className={`grid gap-8 ${gridCols}`}>
          {useManualItems
            ? manualItems.map((item, index) => (
                <ServiceCard
                  key={`manual-${index}`}
                  index={index}
                  name={item.name || ""}
                  category={item.category}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  link={item.link || "/soins"}
                />
              ))
            : services.map((service, index) => {
                const firstPrice = service.prices[0];
                const priceDisplay = firstPrice ? `${firstPrice.price}€` : "Sur devis";

                return (
                  <ServiceCard
                    key={service.id}
                    index={index}
                    name={service.name}
                    category={service.category}
                    description={service.description}
                    price={priceDisplay}
                    image={null}
                    link="/soins"
                  />
                );
              })}
        </div>

      </div>
    </section>
  );
}

interface ServiceCardProps {
  index: number;
  name: string;
  category?: string;
  description?: string;
  price?: string;
  image?: string | ImageValueObject | null;
  link: string;
}

function resolveImageValue(image?: string | ImageValueObject | null): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (typeof image.path === "string" && image.path.trim().length > 0) return image.path;
  if (typeof image.url === "string" && image.url.trim().length > 0) return image.url;
  return null;
}

function ServiceCard({ index, name, category, description, price, image, link }: ServiceCardProps) {
  const imageUrl = getImageUrl(resolveImageValue(image));

  return (
    <AnimatedSection delay={index * 150} className="group">
      <article
        className="h-full overflow-hidden bg-transparent shadow-sm transition-all duration-300 hover:shadow-xl"
        style={{ borderRadius: "var(--card-radius)" }}
      >
        {/* Image ou placeholder */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={toPlainText(name)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background: "linear-gradient(to bottom right, var(--primary-start), var(--primary-end))",
                opacity: 0.15,
              }}
            >
              <span className="text-6xl opacity-50">✨</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Catégorie + Prix */}
          {(hasRichText(category) || price?.trim()) && (
            <div className="mb-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              {hasRichText(category) && (
                <span>
                  <RichText value={category} />
                </span>
              )}
              {hasRichText(category) && price?.trim() && <span>•</span>}
              {price?.trim() && <span className="font-medium text-[var(--primary-start)]">{price}</span>}
            </div>
          )}

          {/* Nom */}
          <h3 className="mb-2 text-xl font-serif text-[var(--text-primary)]">
            <RichText value={name} />
          </h3>

          {/* Description */}
          {hasRichText(description) && (
            <p className="mb-4 line-clamp-2 text-[var(--text-secondary)]">
              <RichText value={description} />
            </p>
          )}

          {/* Lien */}
          <TransitionLink
            href={link}
            className="group/link inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"
          >
            Découvrir
            <span className="transition-transform group-hover/link:translate-x-1">→</span>
          </TransitionLink>
        </div>
      </article>
    </AnimatedSection>
  );
}
