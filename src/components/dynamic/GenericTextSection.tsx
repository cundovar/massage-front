import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface GenericTextContent {
  title?: string;
  paragraphs?: string[];
  quote?: string;
}

export function GenericTextSection({ content }: { content: GenericTextContent }) {
  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-3xl">
        {content.title ? (
          <ScrollReveal>
            <h2 className="mb-8 text-3xl font-serif text-brown-darker">{content.title}</h2>
          </ScrollReveal>
        ) : null}

        {content.paragraphs?.map((paragraph, index) => (
          <ScrollReveal key={`${paragraph.slice(0, 24)}-${index}`} delay={index * 0.1}>
            <p className="mb-4 leading-relaxed text-brown-dark">{paragraph}</p>
          </ScrollReveal>
        ))}

        {content.quote ? (
          <ScrollReveal delay={0.3}>
            <blockquote className="mt-8 border-l-4 border-gold-default pl-6 italic text-brown-dark">{content.quote}</blockquote>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
