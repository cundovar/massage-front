import Image from "next/image";

interface HeroCompactProps {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
}

export function HeroCompact({ title, subtitle, imageUrl }: HeroCompactProps) {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : null}
      <div className={`absolute inset-0 ${imageUrl ? "bg-black/40" : "bg-gradient-to-r from-[#ffce67]/30 to-[#f67e54]/30"}`} />

      <div className={`relative mx-auto max-w-7xl px-6 ${imageUrl ? "text-white" : "text-[var(--color-text-primary)]"}`}>
        <h1 className="heading-hero">{title}</h1>
        {subtitle ? (
          <p className={`mt-4 text-xl ${imageUrl ? "text-white/90" : "text-gray-700"}`}>{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
