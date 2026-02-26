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
    return "text-white font-semibold";
  }

  if (variant === "outline") {
    return "border-[1.5px] font-medium";
  }

  // Default variant - improved contrast
  return isActive
    ? "font-semibold"
    : "hover:opacity-100";
}

function getVariantStyle(variant: MobileNavVariant, isActive: boolean): CSSProperties {
  if (variant === "primary") {
    return {
      background: "var(--gradient-primary)",
      boxShadow: "0 4px 14px color-mix(in srgb, var(--primary-end) 40%, transparent)",
    };
  }

  if (variant === "outline") {
    return {
      borderColor: "var(--primary-start)",
      color: "var(--primary-end)",
      background: "color-mix(in srgb, var(--primary-start) 8%, transparent)",
    };
  }

  // Default variant
  if (isActive) {
    return {
      color: "var(--primary-end)",
      background: "color-mix(in srgb, var(--primary-start) 15%, transparent)",
    };
  }

  return {
    color: "var(--text-primary)",
    opacity: 0.75,
  };
}

function getBaseClasses(variant: MobileNavVariant, isActive: boolean): string {
  const radius = variant === "default" ? "rounded-xl" : "rounded-full";
  const padding = variant === "primary" ? "px-5 py-2.5" : "px-3 py-2";

  return `relative flex flex-col items-center gap-0.5 ${radius} ${padding} transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--primary-start)] focus-visible:ring-offset-2 focus-visible:outline-none ${getVariantClasses(
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
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
      {variant === "default" && isActive ? (
        <span
          className="absolute -bottom-0.5 h-1 w-4 rounded-full"
          style={{ background: "var(--gradient-primary)" }}
        />
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
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
      {variant === "default" && isActive ? (
        <span
          className="absolute -bottom-0.5 h-1 w-4 rounded-full"
          style={{ background: "var(--gradient-primary)" }}
        />
      ) : null}
    </button>
  );
}
