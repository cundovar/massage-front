import { HeroCompact } from "@/components/sections/HeroCompact";
import { DEFAULT_MENTIONS } from "@/lib/defaultContent";

export default function MentionsLegalesPage() {
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
