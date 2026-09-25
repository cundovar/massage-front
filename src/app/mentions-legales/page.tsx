import type { Metadata } from "next";
import { HeroCompact } from "@/components/sections/HeroCompact";
import { SectionRenderer } from "@/components/dynamic/SectionRenderer";
import { getPage } from "@/lib/api";
import { DEFAULT_MENTIONS } from "@/lib/defaultContent";

const SLUG = "mentions-legales";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG, { fallback: false });
  return {
    title: page?.metaTitle || page?.title || DEFAULT_MENTIONS.content.title,
    description: page?.metaDescription ?? undefined,
  };
}

export default async function MentionsLegalesPage() {
  // Contenu edite dans l'admin (Gestion des pages > Mentions legales).
  const page = await getPage(SLUG, { fallback: false });

  const sections = page
    ? Object.entries(page.sections)
        .filter(([, section]) => Boolean(section.type))
        .map(([key, section]) => ({
          sectionKey: key,
          type: section.type,
          title: section.title,
          content: section.content,
          sortOrder: section.sortOrder ?? 0,
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  if (sections.length > 0) {
    return (
      <main className="page-transition">
        <SectionRenderer sections={sections} />
      </main>
    );
  }

  // Secours si l'API est indisponible ou la page vide.
  return (
    <main className="page-transition">
      <HeroCompact title={DEFAULT_MENTIONS.content.title} />
      <section className="mx-auto max-w-4xl px-6 py-20" data-animate="section">
        <div className="space-y-6">
          {DEFAULT_MENTIONS.content.sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" data-animate="section">
              <h2 className="text-2xl" style={{ fontFamily: "var(--font-serif)" }} data-animate="title">{section.title}</h2>
              <p className="mt-3 text-gray-600 leading-loose" data-animate="text">{section.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
