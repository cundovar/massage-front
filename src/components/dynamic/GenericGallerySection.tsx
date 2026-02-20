import Image from "next/image";
import { getImageUrl } from "@/lib/api";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface GenericGalleryContent {
  title?: string;
  images?: string[];
}

export function GenericGallerySection({ content }: { content: GenericGalleryContent }) {
  const images = content.images ?? [];

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        {content.title ? (
          <ScrollReveal>
            <h2 className="mb-8 text-center text-3xl font-serif text-brown-darker">{content.title}</h2>
          </ScrollReveal>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => {
            const url = getImageUrl(image);
            if (!url) return null;
            return (
              <ScrollReveal key={`gallery-${index}`} delay={index * 0.1}>
                <div className="glass-panel relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
