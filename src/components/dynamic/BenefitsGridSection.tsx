import { AnimationWrapper, type AnimationEffect } from "@/components/animations/AnimationWrapper";
import { RichText } from "@/components/dynamic/RichText";
import { hasRichText } from "@/lib/richText";

export interface BenefitsGridContent {
  leftTitle?: string;
  leftSubtitle?: string;
  leftItems?: string[];
  rightTitle?: string;
  rightSubtitle?: string;
  rightItems?: string[];
  tags?: string[];
  quote?: string;
  animation?: AnimationEffect;
  animationDelay?: number;
}

interface BenefitsGridSectionProps {
  content: BenefitsGridContent;
}

function BenefitsColumn({ subtitle, title, items }: { subtitle: string; title: string; items: string[] }) {
  const visibleItems = items.filter((item) => hasRichText(item));

  if (!hasRichText(subtitle) && !hasRichText(title) && visibleItems.length === 0) return null;

  return (
    <div>
      {hasRichText(subtitle) ? (
        <p className="mb-4 font-medium text-orange-500">
          <RichText value={subtitle} />
        </p>
      ) : null}
      {hasRichText(title) ? (
        <h2 className="heading-section">
          <RichText value={title} />
        </h2>
      ) : null}
      {visibleItems.length > 0 ? (
        <ul className="mt-6 space-y-3 text-lg text-gray-600">
          {visibleItems.map((item, index) => (
            <li key={`${index}-${item.slice(0, 24)}`} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
              <span>
                <RichText value={item} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function BenefitsGridSection({ content }: BenefitsGridSectionProps) {
  const {
    leftTitle = "Pour vos equipes",
    leftSubtitle = "Avantages",
    leftItems = [],
    rightTitle = "Pour votre entreprise",
    rightSubtitle = "Benefices",
    rightItems = [],
    tags = [],
    quote,
    animation = "fade-up",
    animationDelay = 0,
  } = content;
  const visibleTags = tags.filter((tag) => hasRichText(tag));

  return (
    <AnimationWrapper effect={animation} delay={animationDelay}>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <BenefitsColumn subtitle={leftSubtitle} title={leftTitle} items={leftItems} />
          <BenefitsColumn subtitle={rightSubtitle} title={rightTitle} items={rightItems} />
        </div>

        {visibleTags.length > 0 ? (
          <div className="mt-12 flex flex-wrap gap-3">
            {visibleTags.map((tag, index) => (
              <span
                key={`${index}-${tag.slice(0, 24)}`}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600"
              >
                <RichText value={tag} />
              </span>
            ))}
          </div>
        ) : null}

        {hasRichText(quote) ? (
          <blockquote className="mt-12 border-l-4 border-orange-400 pl-6 text-xl italic text-gray-700">
            <RichText value={quote} />
          </blockquote>
        ) : null}
      </section>
    </AnimationWrapper>
  );
}
