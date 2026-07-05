"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ViewportAnimationProps {
  children: ReactNode | ((active: boolean) => ReactNode);
  className?: string;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  mountOnEnter?: boolean;
}

/**
 * Monte ou active une animation quand son conteneur devient visible.
 * Utile pour les animations CSS comme pour les composants en requestAnimationFrame :
 * le montage du contenu ne se fait qu'au premier passage dans le viewport par defaut.
 */
export function ViewportAnimation({
  children,
  className,
  once = true,
  threshold = 0.18,
  rootMargin = "0px 0px -10% 0px",
  mountOnEnter = true,
}: ViewportAnimationProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const active = once ? entered : visible;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      setEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setVisible(isVisible);

        if (isVisible) {
          setEntered(true);
          if (once) observer.unobserve(entry.target);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  const content = typeof children === "function" ? children(active) : children;

  return (
    <div ref={ref} className={className} data-viewport-active={active ? "true" : "false"}>
      {mountOnEnter && !active ? null : content}
    </div>
  );
}
