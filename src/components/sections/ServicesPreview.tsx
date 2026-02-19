import type { ServiceItem } from "@/types";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { TransitionLink } from "@/components/transitions/TransitionLink";

interface ServicesPreviewProps {
  services: ServiceItem[];
}

export function ServicesPreview({ services }: ServicesPreviewProps) {
  return (
    <section className="bg-[var(--background-alt)] py-24 md:py-32" data-animate="section">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--primary-start)]">Mes soins</p>
          <h2 data-animate="title" className="text-4xl font-serif text-[var(--text-primary)] md:text-5xl">
            Une gamme de soins
            <br />
            pour votre bien-etre
          </h2>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => {
            const firstPrice = service.prices[0];
            const priceDisplay = firstPrice ? `${firstPrice.price}EUR` : "Sur devis";

            return (
              <AnimatedSection key={service.id} delay={index * 150} className="group">
                <article
                  className="overflow-hidden bg-[var(--card-bg)] shadow-sm transition-all duration-300 hover:shadow-xl"
                  style={{ borderRadius: "var(--card-radius)" }}
                >
                  <div
                    className="aspect-[4/3] overflow-hidden"
                    style={{
                      background: "linear-gradient(to bottom right, var(--primary-start), var(--primary-end))",
                      opacity: 0.2,
                    }}
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-6xl opacity-50">✨</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <span>{service.category}</span>
                      <span>•</span>
                      <span className="font-medium text-[var(--primary-start)]">{priceDisplay}</span>
                    </div>

                    <h3 className="mb-2 text-xl font-serif text-[var(--text-primary)]">{service.name}</h3>

                    <p className="mb-4 line-clamp-2 text-[var(--text-secondary)]">{service.description}</p>

                    <TransitionLink
                      href="/soins"
                      className="group/link inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"
                    >
                      Decouvrir
                      <span className="transition-transform group-hover/link:translate-x-1">→</span>
                    </TransitionLink>
                  </div>
                </article>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection delay={500} className="mt-12 text-center">
          <TransitionLink
            href="/soins"
            className="inline-flex rounded-full px-8 py-4 font-medium text-white transition-all duration-300 hover:shadow-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            Voir tous les soins
          </TransitionLink>
        </AnimatedSection>
      </div>
    </section>
  );
}
