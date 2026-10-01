import { Quote } from "lucide-react";
import { EmptyBlockPlaceholder } from "@/components/dynamic/EmptyBlockPlaceholder";
import { RichText } from "@/components/dynamic/RichText";
import { hasRichText } from "@/lib/richText";

interface QuoteSectionProps {
  content: {
    text?: string;
    author?: string;
  };
}

export function QuoteSection({ content }: QuoteSectionProps) {
  if (!hasRichText(content.text)) {
    return <EmptyBlockPlaceholder icon={Quote} title="Citation" hint="Écrivez la citation dans la section « Textes » du bloc." />;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <blockquote className="border-l-4 border-[var(--primary-start)] pl-6">
        <p className="block-quote italic">
          <RichText value={content.text} />
        </p>
        {hasRichText(content.author) ? (
          <footer className="block-body mt-4 text-sm">
            - <RichText value={content.author} />
          </footer>
        ) : null}
      </blockquote>
    </section>
  );
}
