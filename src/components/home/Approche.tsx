import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getImageUrl } from "@/lib/api";
import type { ApprocheContent } from "@/lib/api";

interface ApprocheProps {
  content: ApprocheContent;
}

export function Approche({ content }: ApprocheProps) {
  const imageSources = Array.isArray(content.images) && content.images.length > 0 ? content.images : content.image ? [content.image] : [];
  const imageUrls = imageSources.map((src) => getImageUrl(src)).filter((src): src is string => Boolean(src));

  return (
    <section id="parcours" className="mt-20 grid gap-10 lg:grid-cols-2">
      <ScrollReveal className="js-section-left hidden lg:block">
        {imageUrls.length > 0 ? (
          imageUrls.length === 1 ? (
            <div className="glass-panel group relative h-[500px] overflow-hidden rounded-2xl">
              <Image
                src={imageUrls[0]}
                alt="Approche"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent" />
            </div>
          ) : (
            <div className="grid h-[500px] grid-cols-2 grid-rows-2 gap-3">
              {imageUrls.slice(0, 4).map((url, index) => (
                <div key={url} className="glass-panel group relative overflow-hidden rounded-2xl">
                  <Image
                    src={url}
                    alt={`Approche ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent" />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="grid h-[500px] grid-cols-6 grid-rows-4 gap-1">
            <div className="rounded-lg bg-stone-300/70 shadow-xl [grid-area:1/1/4/5]" />
            <div className="rounded-lg bg-stone-400/70 shadow-xl [grid-area:1/5/3/7]" />
            <div className="rounded-lg bg-stone-500/70 shadow-xl [grid-area:3/5/5/7]" />
            <div className="rounded-lg bg-stone-600/70 shadow-xl [grid-area:4/1/5/5]" />
          </div>
        )}
      </ScrollReveal>

      <ScrollReveal>
        <div className="js-section-right space-y-6">
          <div className="h-px w-16 bg-amber-500" />
          <h2 className="text-5xl font-extralight md:text-6xl" style={{ fontFamily: "var(--font-title)" }}>
            Approche
          </h2>
          <div className="rounded-r-xl border-l-2 border-amber-500/40 bg-amber-50/60 px-5 py-4 text-stone-700">
            <p className="mb-2 text-xl font-semibold text-stone-800">{content.bulletsTitle ?? "Ce qui guide mes mains :"}</p>
            <ul className="space-y-2 text-lg leading-relaxed">
              {(content.bullets ?? []).map((bullet) => (
                <li key={bullet}>• {bullet}</li>
              ))}
            </ul>
          </div>
          <p className="text-xl italic font-semibold text-stone-700">
            Chaque soin est pense comme une pause pour vous recentrer et vous alleger.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
