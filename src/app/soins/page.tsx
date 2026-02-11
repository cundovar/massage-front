import { ContactCTA } from "@/components/sections/ContactCTA";
import { HeroCompact } from "@/components/sections/HeroCompact";
import { ServiceSelector } from "@/components/sections/ServiceSelector";
import { getImageUrl, fetchPage, getSectionContent } from "@/lib/api";
import { DEFAULT_SOINS } from "@/lib/defaultContent";
import type { SoinsHeroContent, TarifsContent } from "@/lib/api";

export default async function SoinsPage() {
  const page = await fetchPage("soins");
  const heroContent = getSectionContent<SoinsHeroContent>(page, "hero", DEFAULT_SOINS.hero);
  const introContent = getSectionContent<{ paragraphs?: string[] }>(page, "intro", DEFAULT_SOINS.intro);
  const tarifsContent = getSectionContent<TarifsContent>(page, "tarifs", DEFAULT_SOINS.tarifs);
  const heroImageUrl = getImageUrl(heroContent.image);

  return (
    <main className="page-transition">
      <HeroCompact
        title={heroContent.title}
        subtitle={introContent.paragraphs?.[0] ?? "Des soins adaptes a vos besoins."}
        imageUrl={heroImageUrl}
      />
      {introContent.paragraphs?.length ? (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="space-y-4 text-lg text-gray-600">
            {introContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}
      <ServiceSelector content={tarifsContent} />
      <ContactCTA />
    </main>
  );
}
