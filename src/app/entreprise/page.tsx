import { ContactCTA } from "@/components/sections/ContactCTA";
import { HeroCompact } from "@/components/sections/HeroCompact";
import { fetchPage, getSectionContent } from "@/lib/api";
import { DEFAULT_ENTREPRISE } from "@/lib/defaultContent";
import type { EntrepriseContent } from "@/lib/api";

export default async function EntreprisePage() {
  const page = await fetchPage("entreprise");
  const content = getSectionContent<EntrepriseContent>(page, "entreprise", DEFAULT_ENTREPRISE.entreprise);

  return (
    <main className="page-transition">
      <HeroCompact title={content.title} subtitle={content.subtitle} />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-orange-500 font-medium mb-4">Pour vos equipes</p>
            <h2 className="heading-section">{content.teamTitle}</h2>
            <ul className="mt-6 space-y-3 text-lg text-gray-600">
              {content.teamBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-orange-500 font-medium mb-4">Pour votre entreprise</p>
            <h2 className="heading-section">{content.companyTitle}</h2>
            <ul className="mt-6 space-y-3 text-lg text-gray-600">
              {content.companyBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {content.characteristics.map((item) => (
            <span key={item} className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600">
              {item}
            </span>
          ))}
        </div>

        <blockquote className="mt-12 border-l-4 border-orange-400 pl-6 text-xl italic text-gray-700">
          {content.quote}
        </blockquote>
      </section>

      <ContactCTA />
    </main>
  );
}
