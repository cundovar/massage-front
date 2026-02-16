import Image from "next/image";
import Link from "next/link";
import type { ServiceItem } from "@/types";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface ServicesPreviewProps {
  services: ServiceItem[];
}

export function ServicesPreview({ services }: ServicesPreviewProps) {
  return (
    <section className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <p className="text-orange-500 font-medium mb-4 uppercase tracking-wide text-sm">
            Mes soins
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
            Une gamme de soins<br />pour votre bien-être
          </h2>
        </AnimatedSection>

        {/* Services Grid - Données depuis /api/services */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            // Premier prix pour l'affichage
            const firstPrice = service.prices[0];
            const priceDisplay = firstPrice
              ? `${firstPrice.price}€`
              : "Sur devis";

            return (
              <AnimatedSection
                key={service.id}
                delay={index * 150}
                className="group"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">

                  {/* Image (si disponible) */}
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#FFCE67]/20 to-[#F67E54]/20">
                    {/* Placeholder ou image du service */}
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl opacity-50">✨</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Catégorie et prix */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span>{service.category}</span>
                      <span>•</span>
                      <span className="text-orange-500 font-medium">
                        {priceDisplay}
                      </span>
                    </div>

                    {/* Nom du service (depuis API) */}
                    <h3 className="text-xl font-serif mb-2 text-gray-900">
                      {service.name}
                    </h3>

                    {/* Description (depuis API) */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <Link
                      href="/soins"
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 group/link"
                    >
                      Découvrir
                      <span className="transition-transform group-hover/link:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>

                </article>
              </AnimatedSection>
            );
          })}
        </div>

        {/* CTA */}
        <AnimatedSection delay={500} className="text-center mt-12">
          <Link
            href="/soins"
            className="inline-flex px-8 py-4 bg-gradient-to-r from-[#FFCE67] to-[#F67E54] text-white rounded-full font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
          >
            Voir tous les soins
          </Link>
        </AnimatedSection>

      </div>
    </section>
  );
}