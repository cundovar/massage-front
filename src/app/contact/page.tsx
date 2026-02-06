import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getImageUrl, getPage, getSectionContent } from "@/lib/api";
import { DEFAULT_CONTACT } from "@/lib/defaultContent";
import type { ContactHeroContent, ContactInfosContent } from "@/lib/api";

export default async function ContactPage() {
  const page = await getPage("contact");
  const heroContent = getSectionContent<ContactHeroContent>(page, "hero", DEFAULT_CONTACT.hero);
  const infosContent = getSectionContent<ContactInfosContent>(page, "infos", DEFAULT_CONTACT.infos);
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
        </div>
      </section>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <ScrollReveal>
          <section className="glass-panel rounded-2xl p-6" aria-label="Informations pratiques">
            <h2 className="text-2xl font-extralight" style={{ fontFamily: "var(--font-title)" }}>
              Informations pratiques
            </h2>
            <p className="mt-4 text-[var(--muted)]">{infosContent.address.street}</p>
            <p className="text-[var(--muted)]">{infosContent.address.city}</p>
            <p className="mt-4 text-[var(--muted)]">Tel: {infosContent.phone}</p>
            <p className="text-[var(--muted)]">Email: {infosContent.email}</p>
          </section>
        </ScrollReveal>
        <ScrollReveal>
          <section className="glass-panel rounded-2xl p-6" aria-label="Horaires">
            <h2 className="text-2xl font-extralight" style={{ fontFamily: "var(--font-title)" }}>
              Horaires
            </h2>
            <ul className="mt-4 space-y-2 text-[var(--muted)]">
              {infosContent.hours?.map((row) => (
                <li key={row.days}>
                  {row.days}: {row.hours}
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}
