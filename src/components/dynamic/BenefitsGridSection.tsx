import { AnimationWrapper, type AnimationEffect } from "@/components/animations/AnimationWrapper";
import { RichText } from "@/components/dynamic/RichText";
import { hasRichText } from "@/lib/richText";
import { getBlockLayout, getCardGrid } from "@/components/dynamic/responsiveLayout";

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
        <p className="block-eyebrow mb-4">
          <RichText value={subtitle} />
        </p>
      ) : null}
      {hasRichText(title) ? (
        <h3 className="block-card-title">
          <RichText value={title} />
        </h3>
      ) : null}
      {visibleItems.length > 0 ? (
        <ul className="block-body mt-6 space-y-3">
          {visibleItems.map((item, index) => (
            <li key={`${index}-${item.slice(0, 24)}`} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--primary-start)]" />
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
  const grid = getCardGrid(getBlockLayout(content), { defaultTablet: 2, defaultDesktop: 2, max: 2 });

  return (
    <AnimationWrapper effect={animation} delay={animationDelay}>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className={`grid gap-10 ${grid.className}`}>
          <BenefitsColumn subtitle={leftSubtitle} title={leftTitle} items={leftItems} />
          <BenefitsColumn subtitle={rightSubtitle} title={rightTitle} items={rightItems} />
        </div>

        {visibleTags.length > 0 ? (
          <div className="mt-12 flex flex-wrap gap-3">
            {visibleTags.map((tag, index) => (
              <span
                key={`${index}-${tag.slice(0, 24)}`}
                className="block-body rounded-full border border-[var(--card-border)] px-4 py-2 text-sm"
              >
                <RichText value={tag} />
              </span>
            ))}
          </div>
        ) : null}

        {hasRichText(quote) ? (
          <blockquote className="block-quote mt-12 border-l-4 border-[var(--primary-start)] pl-6 italic">
            <RichText value={quote} />
          </blockquote>
        ) : null}
      </section>
    </AnimationWrapper>
  );
}
