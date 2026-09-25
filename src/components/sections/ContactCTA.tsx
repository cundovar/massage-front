import { RichText } from "@/components/dynamic/RichText";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { hasRichText } from "@/lib/richText";

interface ContactCTAContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
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
  const buttonLink = content?.buttonLink?.trim() || "/contact";

  return (
    <section
      className="py-24 text-white md:py-32"
      style={{ background: "var(--gradient-primary)" }}
      data-animate="section"
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        {hasRichText(title) ? (
          <h2 data-animate="title" className="mb-6 text-4xl font-serif md:text-5xl">
            <RichText value={title} />
          </h2>
        ) : null}
        {hasRichText(subtitle) ? (
          <p data-animate="text" className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            <RichText value={subtitle} />
          </p>
        ) : null}
        {buttonText.trim() ? (
          <TransitionLink
            href={buttonLink}
            className="inline-flex rounded-full bg-[var(--card-bg)] px-8 py-4 font-medium text-[var(--text-primary)] transition hover:shadow-lg"
          >
            {buttonText}
          </TransitionLink>
        ) : null}
      </div>
    </section>
  );
}
