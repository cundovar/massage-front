import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getImageUrl, getPage, getSectionContent, getServices } from "@/lib/api";
import { DEFAULT_SOINS } from "@/lib/defaultContent";
import type { SoinsHeroContent } from "@/lib/api";

export default async function SoinsPage() {
  const page = await getPage("soins");
  const heroContent = getSectionContent<SoinsHeroContent>(page, "hero", DEFAULT_SOINS.hero);
  const introContent = getSectionContent<{ paragraphs?: string[] }>(page, "intro", DEFAULT_SOINS.intro);
  const services = await getServices();
  const heroImageUrl = getImageUrl(heroContent.image);

  return (
    <main className="pt-12">
      <section className="glass-panel relative overflow-hidden rounded-3xl px-6 py-12 md:px-10">
        {heroImageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={heroImageUrl}
              alt={heroContent.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/45" />
          </div>
        ) : null}
        <div className="relative z-10">
          <div className="decor-line" />
          <h1
            className={`mt-5 text-5xl font-extralight md:text-6xl ${heroImageUrl ? "text-sand-100" : ""}`}
            style={{ fontFamily: "var(--font-title)" }}
          >
            {heroContent.title}
          </h1>
          <p className={`mt-4 max-w-2xl ${heroImageUrl ? "text-sand-100/80" : "text-[var(--muted)]"}`}>
            {introContent.paragraphs?.[0] ?? "Des soins adaptes a vos besoins."}
          </p>
        </div>
      </section>
      {introContent.paragraphs?.length ? (
        <section className="mt-8 glass-panel rounded-2xl p-6">
          {introContent.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mb-3 text-[var(--muted)] leading-loose last:mb-0">
              {paragraph}
            </p>
          ))}
        </section>
      ) : null}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <ScrollReveal key={service.id}>
            <article className="glass-panel rounded-2xl p-6">
              <p className="text-xs tracking-[0.2em] text-[var(--muted)] uppercase">{service.category}</p>
              <h2 className="mt-2 text-3xl font-extralight" style={{ fontFamily: "var(--font-title)" }}>
                {service.name}
              </h2>
              <p className="mt-3 text-[var(--muted)]">{service.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2 text-sm">
                {service.prices.map((price) => (
                  <li key={`${service.id}-${price.label}`} className="rounded-full border border-[var(--line)] px-3 py-1">
                    {price.label} - {price.price} EUR
                  </li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}
