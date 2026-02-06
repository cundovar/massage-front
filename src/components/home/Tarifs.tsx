import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const OFFERS = [
  {
    title: "Ayurveda",
    description:
      "Les massages ayurvediques apaisent le corps et l'esprit, redonnent de l'ancrage et relancent la flamme interieure.",
    prices: ["Abhyanga · 1h · 80 EUR", "Abhyanga · 1h30 · 100 EUR"],
  },
  {
    title: "Bol Kansu",
    description:
      "Le bol aux trois alliages est frotte contre la plante des pieds pour apaiser les esprits agites et reequilibrer l'element feu.",
    prices: ["Massage des pieds · 1h · 60 EUR"],
  },
  {
    title: "Padhabyanga",
    description: "Massage des jambes complete d'une reflexologie plantaire ou d'un bol Kansu pour delier les tensions.",
    prices: ["1h · 70 EUR"],
  },
  {
    title: "Massage prenatal",
    description:
      "Un accompagnement en douceur pendant la grossesse. Le soin est adapte a chaque etape selon vos besoins.",
    prices: ["Tarif communique lors de l'entretien prealable."],
  },
  {
    title: "Reflexologie plantaire",
    description: "En regulant les differents systemes du corps par le pied, cette pratique aide a reequilibrer le moment.",
    prices: ["Seance decouverte · 45 min · 50 EUR"],
  },
  {
    title: "Kobido",
    description:
      "Massage du visage de tradition japonaise. Il fait circuler la lymphe et redonne du tonus pour un visage lumineux.",
    prices: ["Seance decouverte · 70 EUR"],
  },
];

export function Tarifs() {
  return (
    <section id="tarifs" className="mt-20">
      <ScrollReveal>
        <div className="js-tarifs-header mx-auto max-w-3xl text-center">
          <div className="mx-auto h-px w-24 bg-amber-500" />
          <h2 className="mt-6 text-5xl font-extralight md:text-6xl" style={{ fontFamily: "var(--font-title)" }}>
            Carte & tarifs
          </h2>
          <p className="mt-5 text-lg text-[var(--muted)]">
            Une selection de soins ayurvediques, reflexologie plantaire, Kobido et massage prenatal.
          </p>
        </div>
      </ScrollReveal>

      <div className="js-offers-grid mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {OFFERS.map((offer) => (
          <ScrollReveal key={offer.title}>
            <article className="js-offer-card rounded-xl border border-amber-900/20 bg-gradient-to-br from-amber-900/10 to-[var(--panel)] p-6 transition-colors duration-500 hover:border-amber-700/40">
              <h3 className="text-3xl font-light" style={{ fontFamily: "var(--font-title)" }}>
                {offer.title}
              </h3>
              <p className="mt-4 leading-loose text-[var(--muted)]">{offer.description}</p>
              <ul className="mt-5 space-y-1 text-sm text-stone-700">
                {offer.prices.map((price) => (
                  <li key={price}>{price}</li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-12 border-t border-[var(--line)] pt-8 text-center">
        <p className="text-lg text-[var(--muted)]">Chaque massage commence par un echange pour personnaliser le soin.</p>
        <Link href="/contact" className="mt-5 inline-flex rounded-full bg-amber-500 px-6 py-3 font-semibold text-black hover:bg-amber-600">
          Me contacter
        </Link>
      </div>
    </section>
  );
}
