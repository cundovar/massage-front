import Image from "next/image";
import { getImageUrl } from "@/lib/api";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { HERO_ANIMATION_COMPONENTS } from "@/components/animations/heroAnimationComponents";
import { getAnimationMeta } from "@/lib/heroAnimations";

export interface GenericHeroContent {
  title?: string;
  subtitle?: string;
  image?: string;
  compact?: boolean;
  backgroundType?: "image" | "gradient" | "transparent";
  gradientStart?: string;
  gradientEnd?: string;
  textColor?: string;
  backgroundBlur?: string | number;
  overlayOpacity?: string | number;
  animation?: string;
  backgroundAnimation?: string;
}

export function GenericHeroSection({ content }: { content: GenericHeroContent }) {
  const imageUrl = getImageUrl(content.image);
  const isCompact = content.compact ?? false;
  const hasImage = Boolean(imageUrl);
  const backgroundType = content.backgroundType === "gradient" || content.backgroundType === "transparent" ? content.backgroundType : "image";
  const isTransparent = backgroundType === "transparent";
  const useImageBackground = backgroundType === "image" && hasImage;
  const gradientStart = content.gradientStart || "var(--primary-start)";
  const gradientEnd = content.gradientEnd || "var(--primary-end)";
  const animationMeta = getAnimationMeta(content.backgroundAnimation ?? content.animation);
  const AnimationComponent = HERO_ANIMATION_COMPONENTS[animationMeta.id];
  const isBackgroundAnimation = animationMeta.mode === "background" && Boolean(AnimationComponent);
  const configuredTextColor = content.textColor || (useImageBackground ? "#FFFFFF" : "var(--color-text-primary)");
  const useThemeText = isTransparent || isBackgroundAnimation;
  const textColor = useThemeText && ["#ffffff", "#fff", "#f5f5f4"].includes(configuredTextColor.toLowerCase())
    ? "var(--color-text-primary)"
    : configuredTextColor;

  const blurValue = Number.parseInt(String(content.backgroundBlur ?? "0"), 10);
  const backgroundBlur = Number.isFinite(blurValue) ? Math.max(0, Math.min(8, blurValue)) : 0;

  const overlayValue = Number.parseInt(String(content.overlayOpacity ?? (isCompact ? "35" : "45")), 10);
  const overlayOpacity = Number.isFinite(overlayValue) ? Math.max(0, Math.min(90, overlayValue)) / 100 : 0.45;

  if (isCompact) {
    return (
      <section className="relative overflow-hidden py-20">
        {isBackgroundAnimation ? (
          <div className="absolute inset-0">
            <AnimationComponent />
          </div>
        ) : isTransparent ? null : useImageBackground ? (
          <Image
            src={imageUrl!}
            alt={content.title ?? ""}
            fill
            className="object-cover"
            style={backgroundBlur > 0 ? { filter: `blur(${backgroundBlur}px)`, transform: "scale(1.03)" } : undefined}
            sizes="100vw"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` }}
          />
        )}
        {!isTransparent && !isBackgroundAnimation ? (
          <div className="absolute inset-0 bg-black" style={{ opacity: useImageBackground ? overlayOpacity : overlayOpacity * 0.4 }} />
        ) : null}
        {AnimationComponent && animationMeta.mode === "overlay" ? <AnimationComponent /> : null}
        <div className="relative z-10 mx-auto max-w-7xl px-6" style={{ color: textColor }}>
          {content.title ? <h1 className="heading-hero">{content.title}</h1> : null}
          {content.subtitle ? (
            <p className="mt-4 text-xl opacity-90">
              {content.subtitle}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className={`relative min-h-[60vh] w-full overflow-hidden ${isTransparent ? "" : "rounded-3xl"}`}>
      <div className="absolute inset-0">
        {isBackgroundAnimation ? (
          <AnimationComponent />
        ) : isTransparent ? null : useImageBackground ? (
          <Image
            src={imageUrl!}
            alt=""
            fill
            className="object-cover"
            style={backgroundBlur > 0 ? { filter: `blur(${backgroundBlur}px)`, transform: "scale(1.03)" } : undefined}
            priority
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` }}
          />
        )}
        {!isTransparent && !isBackgroundAnimation ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" style={{ opacity: useImageBackground ? overlayOpacity : overlayOpacity * 0.35 }} />
        ) : null}
        {AnimationComponent && animationMeta.mode === "overlay" ? <AnimationComponent /> : null}
      </div>
      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        {content.title ? (
          <ScrollReveal>
            <h1 className="text-4xl font-serif md:text-6xl" style={{ color: textColor }}>{content.title}</h1>
          </ScrollReveal>
        ) : null}
        {content.subtitle ? (
          <ScrollReveal delay={0.2}>
            <p className="mt-4 text-xl opacity-90" style={{ color: textColor }}>{content.subtitle}</p>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
