import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getImageUrl, getPage, getSectionContent } from "@/lib/api";
import { DEFAULT_ABOUT } from "@/lib/defaultContent";
import type { AboutHeroContent, FormationsContent, ParcoursContent } from "@/lib/api";

export default async function AboutPage() {
  const page = await getPage("about");
  const heroContent = getSectionContent<AboutHeroContent>(page, "hero", DEFAULT_ABOUT.hero);
  const parcoursContent = getSectionContent<ParcoursContent>(page, "parcours", DEFAULT_ABOUT.parcours);
  const formationsContent = getSectionContent<FormationsContent>(page, "formations", DEFAULT_ABOUT.formations);
  const philosophieContent = getSectionContent<{ quote?: string }>(page, "philosophie", DEFAULT_ABOUT.philosophie);
  const heroImageUrl = getImageUrl(heroContent.image);
  const parcoursImageUrl = getImageUrl(parcoursContent.image);

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
        </div>
      </section>

      <ScrollReveal className="mt-9">
        <section className="glass-panel grid gap-6 rounded-2xl p-7 md:grid-cols-[1fr_2fr]">
          {parcoursImageUrl ? (
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
              <Image
                src={parcoursImageUrl}
                alt="Portrait"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>
          ) : null}
          <div>
            {parcoursContent.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-4 text-[var(--muted)] leading-loose last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal className="mt-8">
        <section className="glass-panel rounded-2xl p-7">
          <h2 className="text-3xl font-extralight" style={{ fontFamily: "var(--font-title)" }}>
            Formations
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {formationsContent.images?.map((imagePath) => {
              const imageUrl = getImageUrl(imagePath);
              if (!imageUrl) return null;
              return (
                <div key={imagePath} className="relative aspect-[4/3] overflow-hidden rounded-xl">
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
            <ul className="mt-5 space-y-2 text-[var(--muted)]">
              {formationsContent.items.map((item) => (
                <li key={`${item.year}-${item.title}`}>
                  <span className="font-semibold text-[var(--text)]">{item.year}</span> — {item.title}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </ScrollReveal>

      <ScrollReveal className="mt-8">
        <blockquote
          className="rounded-r-2xl border-l-2 border-[var(--accent)] bg-[color:var(--panel)]/30 p-5 text-3xl font-extralight"
          style={{ fontFamily: "var(--font-title)" }}
        >
          {philosophieContent.quote ?? DEFAULT_ABOUT.philosophie.quote}
        </blockquote>
      </ScrollReveal>
    </main>
  );
}
