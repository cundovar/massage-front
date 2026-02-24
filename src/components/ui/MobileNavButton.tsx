"use client";

import type { CSSProperties, ReactNode } from "react";
import { TransitionLink } from "@/components/transitions/TransitionLink";

type MobileNavVariant = "default" | "primary" | "outline";

interface MobileNavBaseProps {
  icon: ReactNode;
  label: string;
  variant?: MobileNavVariant;
  isActive?: boolean;
}

interface MobileNavLinkButtonProps extends MobileNavBaseProps {
  href: string;
  ariaLabel?: string;
}

interface MobileNavButtonProps extends MobileNavBaseProps {
  onClick?: () => void;
  ariaLabel?: string;
}

function getVariantClasses(variant: MobileNavVariant, isActive: boolean): string {
  if (variant === "primary") {
    return "text-[var(--btn-text)] shadow-md shadow-[color-mix(in_srgb,var(--primary-start)_35%,transparent)]";
  }

  if (variant === "outline") {
    return "border-[1.5px] text-[var(--primary-start)]";
  }

  return isActive
    ? "text-[var(--primary-start)]"
    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]";
}

function getVariantStyle(variant: MobileNavVariant, isActive: boolean): CSSProperties | undefined {
  if (variant === "primary") {
    return { background: "var(--gradient-primary)" };
  }

  if (variant === "outline") {
    return { borderColor: "var(--primary-start)" };
  }

  if (isActive) {
    return {
      background: "color-mix(in srgb, var(--primary-start) 12%, transparent)",
    };
  }

  return undefined;
}

function getBaseClasses(variant: MobileNavVariant, isActive: boolean): string {
  const radius = variant === "default" ? "rounded-xl" : "rounded-[var(--btn-radius)]";
  const padding = variant === "primary" ? "px-4 py-2" : "px-3 py-2";

  return `relative flex flex-col items-center gap-1 ${radius} ${padding} transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--primary-start)] focus-visible:ring-offset-2 focus-visible:outline-none ${getVariantClasses(
    variant,
    isActive,
  )}`;
}

export function MobileNavLinkButton({
  href,
  icon,
  label,
  variant = "default",
  isActive = false,
  ariaLabel,
}: MobileNavLinkButtonProps) {
  return (
    <TransitionLink
      href={href}
      aria-label={ariaLabel ?? label}
      aria-current={isActive ? "page" : undefined}
      className={getBaseClasses(variant, isActive)}
      style={getVariantStyle(variant, isActive)}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
      {variant === "default" && isActive ? (
        <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-[var(--primary-start)]" />
      ) : null}
    </TransitionLink>
  );
}

export function MobileNavButton({
  icon,
  label,
  variant = "default",
  isActive = false,
  onClick,
  ariaLabel,
}: MobileNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={getBaseClasses(variant, isActive)}
      style={getVariantStyle(variant, isActive)}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
      {variant === "default" && isActive ? (
        <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-[var(--primary-start)]" />
      ) : null}
    </button>
  );
}
