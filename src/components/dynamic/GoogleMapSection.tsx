"use client";

interface GoogleMapContent {
  embedUrl?: string;
  title?: string;
}

interface GoogleMapSectionProps {
  content: GoogleMapContent;
}

export function GoogleMapSection({ content }: GoogleMapSectionProps) {
  const embedUrl = content.embedUrl || "";

  if (!embedUrl) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-10" data-animate="section">
        <div className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
          <p className="text-gray-500">Aucune carte configuree</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10" data-animate="section">
      {content.title ? (
        <h2
          className="mb-6 text-3xl font-light"
          style={{ fontFamily: "var(--font-title)" }}
        >
          {content.title}
        </h2>
      ) : null}
      <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
        <iframe
          title="Carte Google Maps"
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
        />
      </div>
    </section>
  );
}
