import type { TarifsContent } from "@/types/sections";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface TarifsProps {
  content: TarifsContent;
}

export function Tarifs({ content }: TarifsProps) {
  const { title, subtitle, offers } = content;

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header - Titre et sous-titre éditables */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </AnimatedSection>

        {/* Offers - Liste éditable depuis le backoffice */}
        <div className="space-y-6">
          {offers.map((offer, index) => (
            <AnimatedSection
              key={index}
              delay={index * 100}
              className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                {/* Offer Info */}
                <div className="flex-1">
                  {/* Titre de l'offre (éditable) */}
                  <h3 className="text-2xl font-serif mb-3 text-gray-900">
                    {offer.title}
                  </h3>
                  {/* Description (éditable) */}
                  <p className="text-gray-600 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                {/* Prices */}
                <div className="md:text-right md:min-w-[200px]">
                  {/* Prix (éditables) */}
                  {offer.prices.map((price, priceIndex) => (
                    <p
                      key={priceIndex}
                      className="text-lg text-gray-700 mb-1 last:mb-0"
                    >
                      {price}
                    </p>
                  ))}
                </div>

              </div>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  );
}