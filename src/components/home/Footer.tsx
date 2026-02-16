export function Footer() {
  return (
    <section className="mt-20 rounded-3xl bg-black inset-0 px-6 py-12 text-sand-100 md:px-10">
      <div className="text-center">
        <p className="text-3xl text-amber-500/40">✦</p>
        <h2 className="mt-3 text-4xl" style={{ fontFamily: "var(--font-title)" }}>
          Les Massages d&apos;Helene
        </h2>
        <p className="mt-3 text-sand-300/80">Le mieux-etre par le toucher</p>
      </div>

      <div className="mt-8 grid gap-8 border-y border-white/10 py-8 md:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-sand-400">Contact</p>
          <a href="tel:+33123456789" className="mt-2 block hover:text-amber-400">
            +33 1 23 45 67 89
          </a>
          <a href="mailto:contact@lesmassagesdhelene.fr" className="mt-1 block hover:text-amber-400">
            contact@lesmassagesdhelene.fr
          </a>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-sand-400">Horaires</p>
          <p className="mt-2">Sur rendez-vous</p>
          <p>Du lundi au samedi</p>
          <p>9h - 19h</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-sand-400">Adresse</p>
          <p className="mt-2">123 Rue de la Serenite</p>
          <p>75000 Paris</p>
          <p>France</p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-sand-500">
        © {new Date().getFullYear()} Les Massages d&apos;Helene - Tous droits reserves
      </p>
    </section>
  );
}
