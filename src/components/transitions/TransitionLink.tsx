"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useTransitionSafe } from "@/context/TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export function TransitionLink({ href, children, className, onClick, style }: TransitionLinkProps) {
  const pathname = usePathname();
  const ctx = useTransitionSafe();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
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
