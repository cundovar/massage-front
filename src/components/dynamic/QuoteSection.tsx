interface QuoteSectionProps {
  content: {
    text?: string;
    author?: string;
  };
}

export function QuoteSection({ content }: QuoteSectionProps) {
  if (!content.text) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <blockquote className="border-l-4 border-orange-400 pl-6">
        <p className="text-2xl italic text-gray-700">{content.text}</p>
        {content.author ? <footer className="mt-4 text-gray-500">- {content.author}</footer> : null}
      </blockquote>
    </section>
  );
}
