import { TransitionLink } from "@/components/transitions/TransitionLink";

interface ContactCTAContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

interface ContactCTAProps {
  content?: ContactCTAContent;
}

export function ContactCTA({ content }: ContactCTAProps) {
  const title = content?.title ?? "Pret(e) a vous offrir une pause bien-etre ?";
  const subtitle =
    content?.subtitle ??
    "Reservez votre seance et decouvrez les bienfaits d'un massage personnalise";
  const buttonText = content?.buttonText ?? "Prendre rendez-vous";

  return (
    <section
      className="py-24 text-white md:py-32"
      style={{ background: "var(--gradient-primary)" }}
      data-animate="section"
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 data-animate="title" className="mb-6 text-4xl font-serif md:text-5xl">
          {title}
        </h2>
        <p data-animate="text" className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
          {subtitle}
        </p>
        <TransitionLink
          href="/contact"
          className="inline-flex rounded-full bg-[var(--card-bg)] px-8 py-4 font-medium text-[var(--text-primary)] transition hover:shadow-lg"
        >
          {buttonText}
        </TransitionLink>
      </div>
    </section>
  );
}
