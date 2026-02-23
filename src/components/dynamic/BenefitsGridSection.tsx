import { AnimationWrapper, type AnimationEffect } from "@/components/animations/AnimationWrapper";

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

  return (
    <AnimationWrapper effect={animation} delay={animationDelay}>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 font-medium text-orange-500">{leftSubtitle}</p>
            <h2 className="heading-section">{leftTitle}</h2>
            <ul className="mt-6 space-y-3 text-lg text-gray-600">
              {leftItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-medium text-orange-500">{rightSubtitle}</p>
            <h2 className="heading-section">{rightTitle}</h2>
            <ul className="mt-6 space-y-3 text-lg text-gray-600">
              {rightItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {tags.length > 0 ? (
          <div className="mt-12 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {quote ? (
          <blockquote className="mt-12 border-l-4 border-orange-400 pl-6 text-xl italic text-gray-700">
            {quote}
          </blockquote>
        ) : null}
      </section>
    </AnimationWrapper>
  );
}
