import type { ServiceItem } from "@/types";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { getImageUrl } from "@/lib/api";

export interface ServicePreviewItem {
  name?: string;
  category?: string;
  description?: string;
  price?: string;
  image?: string | null;
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
  const subtitle = content?.subtitle || "Mes soins";
  const title = content?.title || "Une gamme de soins pour votre bien-être";
  const buttonText = content?.buttonText || "Voir tous les soins";
  const buttonLink = content?.buttonLink || "/soins";

  // Utiliser les items manuels s'ils existent et ont du contenu, sinon utiliser les services API
  const manualItems = content?.items?.filter((item) => item.name?.trim()) || [];
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
    <section className="bg-[var(--background-alt)] py-24 md:py-32" data-animate="section">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--primary-start)]">{subtitle}</p>
          <h2 data-animate="title" className="text-4xl font-serif text-[var(--text-primary)] md:text-5xl">
            {title}
          </h2>
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

        <AnimatedSection delay={500} className="mt-12 text-center">
          <TransitionLink
            href={buttonLink}
            className="inline-flex rounded-full px-8 py-4 font-medium text-white transition-all duration-300 hover:shadow-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            {buttonText}
          </TransitionLink>
        </AnimatedSection>
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
  image?: string | null;
  link: string;
}

function ServiceCard({ index, name, category, description, price, image, link }: ServiceCardProps) {
  const imageUrl = image ? getImageUrl(image) : null;

  return (
    <AnimatedSection delay={index * 150} className="group">
      <article
        className="h-full overflow-hidden bg-[var(--card-bg)] shadow-sm transition-all duration-300 hover:shadow-xl"
        style={{ borderRadius: "var(--card-radius)" }}
      >
        {/* Image ou placeholder */}
        <div className="aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          {(category || price) && (
            <div className="mb-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              {category && <span>{category}</span>}
              {category && price && <span>•</span>}
              {price && <span className="font-medium text-[var(--primary-start)]">{price}</span>}
            </div>
          )}

          {/* Nom */}
          <h3 className="mb-2 text-xl font-serif text-[var(--text-primary)]">{name}</h3>

          {/* Description */}
          {description && <p className="mb-4 line-clamp-2 text-[var(--text-secondary)]">{description}</p>}

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
