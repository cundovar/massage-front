"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import type { NavItem } from "@/types/navigation";

interface HorizontalNavProps {
  items: NavItem[];
}

export function HorizontalNav({ items }: HorizontalNavProps) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string): boolean => {
      if (!pathname) return false;
      if (path === "/") return pathname === "/";
      return pathname === path || pathname.startsWith(`${path}/`);
    },
    [pathname],
  );

  useEffect(() => {
    const activeItem = items.find((item) => !item.isExternal && isActive(item.path));
    if (!activeItem) return;

    const container = scrollRef.current;
    const activeEl = itemRefs.current[activeItem.slug];
    if (!container || !activeEl) return;

    const targetLeft = activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;
    const maxLeft = container.scrollWidth - container.clientWidth;
    const nextLeft = Math.max(0, Math.min(targetLeft, maxLeft));

    container.scrollTo({ left: nextLeft, behavior: "smooth" });
  }, [isActive, items, pathname]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className="sticky top-16 z-40 border-b border-[var(--card-border)] bg-[var(--background)]/95 backdrop-blur-sm md:hidden"
      aria-label="Navigation principale mobile"
    >
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r from-[var(--background)] to-transparent" />

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 py-3 scroll-smooth"
      >
        {items.map((item) => {
          const active = !item.isExternal && isActive(item.path);

          if (item.isExternal) {
            return (
              <div
                key={item.slug}
                ref={(el) => {
                  itemRefs.current[item.slug] = el;
                }}
                className="shrink-0 snap-start"
              >
                <a
                  href={item.path}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-1 rounded-full bg-[var(--background-alt)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary-start)] focus-visible:outline-none"
                >
                  <span>{item.title}</span>
                  {item.openInNewTab ? (
                    <svg className="h-3 w-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  ) : null}
                </a>
              </div>
            );
          }

          return (
            <div
              key={item.slug}
              ref={(el) => {
                itemRefs.current[item.slug] = el;
              }}
              className="shrink-0 snap-start"
            >
              <TransitionLink
                href={item.path}
                className={`block rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--primary-start)] focus-visible:outline-none ${
                  active
                    ? "text-[var(--btn-text)] shadow-md"
                    : "bg-[var(--background-alt)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                style={active ? { background: "var(--gradient-primary)" } : undefined}
              >
                {item.title}
              </TransitionLink>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-[var(--background)] to-transparent" />
    </nav>
  );
}
