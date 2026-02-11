import type { ApprocheContent } from "@/types/sections";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface ApprocheProps {
  content: ApprocheContent;
}

export function Approche({ content }: ApprocheProps) {
  const { images, bulletsTitle, bullets, quote } = content;

  return (
    <section className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text Content */}
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
              {bulletsTitle}
            </h2>
            <ul className="space-y-4 text-gray-600 text-lg leading-relaxed">
              {bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            {quote && (
              <blockquote className="mt-8 pl-6 border-l-4 border-orange-400 italic text-xl text-gray-700">
                "{quote}"
              </blockquote>
            )}
          </AnimatedSection>

          {/* Images */}
          <AnimatedSection delay={200} className="relative">
            {/* You can map through images here if needed */}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}