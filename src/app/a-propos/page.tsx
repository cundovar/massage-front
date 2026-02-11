import Image from "next/image";
import { HeroCompact } from "@/components/sections/HeroCompact";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { getImageUrl, fetchPage, getSectionContent } from "@/lib/api";
import { DEFAULT_ABOUT } from "@/lib/defaultContent";
import type { AboutHeroContent, FormationsContent, ParcoursContent } from "@/lib/api";

export default async function AboutPage() {
  const page = await fetchPage("about");
  const heroContent = getSectionContent<AboutHeroContent>(page, "hero", DEFAULT_ABOUT.hero);
  const parcoursContent = getSectionContent<ParcoursContent>(page, "parcours", DEFAULT_ABOUT.parcours);
  const formationsContent = getSectionContent<FormationsContent>(page, "formations", DEFAULT_ABOUT.formations);
  const philosophieContent = getSectionContent<{ quote?: string }>(page, "philosophie", DEFAULT_ABOUT.philosophie);
  const heroImageUrl = getImageUrl(heroContent.image);
  const parcoursImageUrl = getImageUrl(parcoursContent.image);

  return (
    <main className="page-transition">
      <HeroCompact title={heroContent.title} imageUrl={heroImageUrl} />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        {parcoursImageUrl ? (
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src={parcoursImageUrl}
              alt="Portrait"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        ) : null}
        <div>
          <p className="text-orange-500 font-medium mb-4">Parcours</p>
          <h2 className="heading-section">Mon parcours</h2>
          <div className="mt-6 space-y-4 text-lg text-gray-600">
            {parcoursContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-background-alt)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="heading-section">Formations</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {formationsContent.images?.map((imagePath) => {
              const imageUrl = getImageUrl(imagePath);
              if (!imageUrl) return null;
              return (
                <div key={imagePath} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={imageUrl}
                    alt="Certification"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                </div>
              );
            })}
          </div>
          {formationsContent.items?.length ? (
            <ul className="mt-6 space-y-2 text-gray-600">
              {formationsContent.items.map((item) => (
                <li key={`${item.year}-${item.title}`}>
                  <span className="font-medium text-gray-900">{item.year}</span> — {item.title}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {philosophieContent.quote ? (
        <section className="mx-auto max-w-4xl px-6 py-20">
          <blockquote className="border-l-4 border-orange-400 pl-6 text-2xl italic text-gray-700">
            {philosophieContent.quote}
          </blockquote>
        </section>
      ) : null}

      <ContactCTA />
    </main>
  );
}
