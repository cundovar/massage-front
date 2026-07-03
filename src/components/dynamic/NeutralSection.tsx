"use client";

import { TransitionLink } from "@/components/transitions/TransitionLink";

export interface NeutralSectionContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  paragraphs?: string[];
  buttonText?: string;
  buttonLink?: string;
  align?: "left" | "center";
  width?: "narrow" | "normal" | "wide";
  background?: "transparent" | "soft" | "card";
  spacing?: "compact" | "normal" | "large";
}

const widthClasses: Record<NonNullable<NeutralSectionContent["width"]>, string> = {
  narrow: "max-w-3xl",
  normal: "max-w-5xl",
  wide: "max-w-7xl",
};

const spacingClasses: Record<NonNullable<NeutralSectionContent["spacing"]>, string> = {
  compact: "py-10 md:py-14",
  normal: "py-16 md:py-20",
  large: "py-24 md:py-28",
};

const backgroundClasses: Record<NonNullable<NeutralSectionContent["background"]>, string> = {
  transparent: "",
  soft: "bg-[color-mix(in_srgb,var(--primary-start)_8%,transparent)]",
  card: "border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm",
};

export function NeutralSection({ content }: { content: NeutralSectionContent }) {
  const align = content.align ?? "left";
  const width = content.width ?? "normal";
  const background = content.background ?? "transparent";
  const spacing = content.spacing ?? "normal";
  const paragraphs = content.paragraphs?.filter((paragraph) => paragraph.trim() !== "") ?? [];
  const isCentered = align === "center";

  return (
    <section className={`px-6 ${spacingClasses[spacing]}`}>
      <div className={`mx-auto ${widthClasses[width]}`}>
        <div
          className={[
            backgroundClasses[background],
            background === "transparent" ? "" : "rounded-2xl px-6 py-10 md:px-10",
            isCentered ? "text-center" : "text-left",
          ].join(" ")}
        >
          {content.eyebrow ? (
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-[var(--primary-start)]">
              {content.eyebrow}
            </p>
          ) : null}

          {content.title ? (
            <h2 className="text-3xl font-light tracking-normal text-[var(--text-primary)] md:text-5xl">
              {content.title}
            </h2>
          ) : null}

          {content.subtitle ? (
            <p className={`mt-4 text-lg text-[var(--text-secondary)] ${isCentered ? "mx-auto max-w-3xl" : "max-w-3xl"}`}>
              {content.subtitle}
            </p>
          ) : null}

          {paragraphs.length > 0 ? (
            <div className={`mt-7 space-y-4 text-base leading-8 text-[var(--text-secondary)] md:text-lg ${isCentered ? "mx-auto max-w-3xl" : "max-w-3xl"}`}>
              {paragraphs.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {content.buttonText && content.buttonLink ? (
            <TransitionLink
              href={content.buttonLink}
              className="mt-8 inline-flex rounded-full px-6 py-3 text-sm font-medium text-[var(--btn-text)] transition hover:opacity-90"
              style={{ background: "var(--btn-bg)" }}
            >
              {content.buttonText}
            </TransitionLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
