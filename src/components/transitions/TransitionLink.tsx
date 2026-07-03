"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useTransitionSafe } from "@/contexts/TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

export function TransitionLink({ href, children, className, onClick, style, target, rel }: TransitionLinkProps) {
  const pathname = usePathname();
  const ctx = useTransitionSafe();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (target === "_blank") {
      onClick?.();
      return;
    }

    // Si pas de provider (admin preview), comportement standard
    if (!ctx) {
      onClick?.();
      return;
    }

    // Si même page ou ancre, comportement normal
    if (href === pathname || href.startsWith("#")) {
      onClick?.();
      return;
    }

    event.preventDefault();
    onClick?.();
    ctx.navigateTo(href);
  };

  const isTransitioning = ctx?.isTransitioning ?? false;

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      target={target}
      rel={rel}
      aria-disabled={isTransitioning}
      style={{
        ...style,
        pointerEvents: isTransitioning ? "none" : "auto",
      }}
    >
      {children}
    </Link>
  );
}
