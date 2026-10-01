import type { CSSProperties, ReactNode } from "react";

export interface BlockResponsiveLayout {
  mobileOrder?: "default" | "text-first" | "image-first";
  tabletLayout?: "default" | "stacked" | "two-columns";
  desktopLayout?: "default" | "stacked" | "two-columns";
  tabletColumns?: "default" | "1" | "2";
  desktopColumns?: "default" | "1" | "2" | "3";
}

export interface BlockVisibility {
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
}

export interface BlockAppearance {
  background?: "transparent" | "soft" | "surface" | "accent";
  width?: "full" | "wide" | "normal" | "narrow";
  paddingTop?: "none" | "sm" | "md" | "lg";
  paddingBottom?: "none" | "sm" | "md" | "lg";
  radius?: "none" | "md" | "lg";
  layout?: BlockResponsiveLayout;
  visibility?: BlockVisibility;
  /** false masque le titre principal du bloc (.block-title) sans effacer son contenu. */
  showTitle?: boolean;
}

interface BlockAppearanceFrameProps {
  appearance?: BlockAppearance;
  children: ReactNode;
}

const spacingClasses: Record<NonNullable<BlockAppearance["paddingTop"]>, string> = {
  none: "",
  sm: "pt-6",
  md: "pt-12",
  lg: "pt-20",
};

const bottomSpacingClasses: Record<NonNullable<BlockAppearance["paddingBottom"]>, string> = {
  none: "",
  sm: "pb-6",
  md: "pb-12",
  lg: "pb-20",
};

const widthClasses: Record<NonNullable<BlockAppearance["width"]>, string> = {
  full: "",
  wide: "mx-auto max-w-7xl px-6",
  normal: "mx-auto max-w-5xl px-6",
  narrow: "mx-auto max-w-3xl px-6",
};

const radiusClasses: Record<NonNullable<BlockAppearance["radius"]>, string> = {
  none: "",
  md: "rounded-2xl",
  lg: "rounded-3xl",
};

const visibilityClasses: Record<string, string> = {
  "true-true-true": "",
  "false-true-true": "hidden md:block",
  "true-false-true": "block md:hidden lg:block",
  "true-true-false": "block lg:hidden",
  "false-false-true": "hidden lg:block",
  "false-true-false": "hidden md:block lg:hidden",
  "true-false-false": "block md:hidden",
  "false-false-false": "hidden",
};

function getBackgroundStyle(background: NonNullable<BlockAppearance["background"]>): CSSProperties | undefined {
  if (background === "transparent") return undefined;

  if (background === "surface") {
    return {
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
    };
  }

  if (background === "accent") {
    return {
      background: "linear-gradient(135deg, color-mix(in srgb, var(--primary-start) 18%, transparent), color-mix(in srgb, var(--primary-end) 12%, transparent))",
    };
  }

  return {
    background: "color-mix(in srgb, var(--primary-start) 8%, transparent)",
  };
}

export function BlockAppearanceFrame({ appearance, children }: BlockAppearanceFrameProps) {
  const background = appearance?.background ?? "transparent";
  const width = appearance?.width ?? "full";
  const paddingTop = appearance?.paddingTop ?? "none";
  const paddingBottom = appearance?.paddingBottom ?? "none";
  const radius = appearance?.radius ?? "none";
  const visibility = appearance?.visibility;
  const mobileVisible = visibility?.mobile ?? true;
  const tabletVisible = visibility?.tablet ?? true;
  const desktopVisible = visibility?.desktop ?? true;
  const visibilityClass = visibilityClasses[`${mobileVisible}-${tabletVisible}-${desktopVisible}`];
  const titleClass = appearance?.showTitle === false ? "[&_.block-title]:hidden" : "";

  const hasFrame =
    background !== "transparent" ||
    width !== "full" ||
    paddingTop !== "none" ||
    paddingBottom !== "none" ||
    radius !== "none";

  if (!hasFrame && !visibilityClass && !titleClass) {
    return <>{children}</>;
  }

  return (
    <div className={`${visibilityClass} ${titleClass} ${spacingClasses[paddingTop]} ${bottomSpacingClasses[paddingBottom]}`}>
      <div
        className={`${widthClasses[width]} ${radiusClasses[radius]} ${background === "transparent" ? "" : "overflow-hidden p-6 md:p-8"}`}
        style={getBackgroundStyle(background)}
      >
        {children}
      </div>
    </div>
  );
}
