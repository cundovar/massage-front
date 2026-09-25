import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { EmptyBlockPlaceholder } from "@/components/dynamic/EmptyBlockPlaceholder";
import { getImageUrl } from "@/lib/api";

interface ImageSectionProps {
  content: {
    image?: string | null;
    alt?: string;
    caption?: string;
  };
}

export function ImageSection({ content }: ImageSectionProps) {
  const imageUrl = content.image ? getImageUrl(content.image) : null;
  if (!imageUrl) return <EmptyBlockPlaceholder icon={ImageIcon} title="Image" hint="Choisissez une photo dans la section « Images » du bloc." />;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <figure>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={imageUrl} alt={content.alt || ""} fill className="object-cover" />
        </div>
        {content.caption ? <figcaption className="mt-4 text-center text-sm text-gray-500">{content.caption}</figcaption> : null}
      </figure>
    </section>
  );
}
