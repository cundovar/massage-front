"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useTransition } from "@/context/TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export function TransitionLink({ href, children, className, onClick, style }: TransitionLinkProps) {
  const pathname = usePathname();
  const { navigateTo, isTransitioning } = useTransition();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Si même page ou ancre, comportement normal
    if (href === pathname || href.startsWith("#")) {
      onClick?.();
      return;
    }

    event.preventDefault();
    onClick?.();
    navigateTo(href);
  };

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
