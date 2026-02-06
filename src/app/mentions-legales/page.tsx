import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { DEFAULT_MENTIONS } from "@/lib/defaultContent";

export default function MentionsLegalesPage() {
  return (
    <main className="pt-12">
      <div className="decor-line" />
      <h1 className="mt-5 text-5xl font-extralight md:text-6xl" style={{ fontFamily: "var(--font-title)" }}>
        {DEFAULT_MENTIONS.content.title}
      </h1>
      <div className="mt-10 space-y-5">
        {DEFAULT_MENTIONS.content.sections.map((section) => (
          <ScrollReveal key={section.title}>
            <section className="glass-panel rounded-2xl p-6">
              <h2 className="text-3xl font-extralight" style={{ fontFamily: "var(--font-title)" }}>
                {section.title}
              </h2>
              <p className="mt-3 text-[var(--muted)] leading-loose">{section.content}</p>
            </section>
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}
