import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { RichText } from "@/components/dynamic/RichText";
import { hasRichText } from "@/lib/richText";

interface GenericTextContent {
  title?: string;
  paragraphs?: string[];
  quote?: string;
}

export function GenericTextSection({ content }: { content: GenericTextContent }) {
  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-3xl">
        {hasRichText(content.title) ? (
          <ScrollReveal>
            <h2 className="block-title mb-8"><RichText value={content.title} /></h2>
          </ScrollReveal>
        ) : null}

        {content.paragraphs?.filter((paragraph) => hasRichText(paragraph)).map((paragraph, index) => (
          <ScrollReveal key={`${paragraph.slice(0, 24)}-${index}`} delay={index * 0.1}>
            <p className="block-body mb-4"><RichText value={paragraph} /></p>
          </ScrollReveal>
        ))}

        {hasRichText(content.quote) ? (
          <ScrollReveal delay={0.3}>
            <blockquote className="block-quote mt-8 border-l-4 border-[var(--primary-start)] pl-6 italic"><RichText value={content.quote} /></blockquote>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
