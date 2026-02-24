"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Home, Calendar, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TransitionLink } from "@/components/transitions/TransitionLink";

interface BottomNavProps {
  showThemeToggle?: boolean;
}

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

export function BottomNav({ showThemeToggle = true }: BottomNavProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;

      if (scrollingDown && currentY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav
      className={`fixed right-0 bottom-0 left-0 z-50 safe-bottom transition-transform duration-300 md:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around rounded-t-3xl border border-white/25 bg-white/55 px-2 py-3 shadow-lg shadow-black/10 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-stone-900/55">
        <NavItem href="/" icon={<Home className="h-5 w-5" />} label="Accueil" isActive={isActive("/")} />

        <TransitionLink
          href="/reservation"
          aria-label="Réserver un massage"
          aria-current={isActive("/reservation") ? "page" : undefined}
          className="flex flex-col items-center gap-1 rounded-[var(--btn-radius)] px-4 py-2 text-[var(--btn-text)] shadow-md shadow-[color-mix(in_srgb,var(--primary-start)_35%,transparent)] transition-all duration-200 active:scale-95"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs font-medium">Réserver</span>
        </TransitionLink>

        <TransitionLink
          href="/contact"
          aria-label="Contacter le cabinet"
          aria-current={isActive("/contact") ? "page" : undefined}
          className="flex flex-col items-center gap-1 rounded-[var(--btn-radius)] border-[1.5px] px-3 py-2 text-[var(--primary-start)] transition-all duration-200 active:scale-95"
          style={{ borderColor: "var(--primary-start)" }}
        >
          <Phone className="h-5 w-5" />
          <span className="text-xs font-medium">Contact</span>
        </TransitionLink>

        {showThemeToggle ? (
          <div className="flex flex-col items-center gap-1">
            <ThemeToggle />
            <span className="text-xs text-[var(--text-secondary)]">Mode</span>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  const activeStyle: CSSProperties | undefined = isActive
    ? {
        color: "var(--primary-start)",
        background: "color-mix(in srgb, var(--primary-start) 12%, transparent)",
      }
    : undefined;

  return (
    <TransitionLink
      href={href}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className="relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[var(--text-secondary)] transition-all duration-200 hover:text-[var(--text-primary)] active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--primary-start)] focus-visible:ring-offset-2 focus-visible:outline-none"
      style={activeStyle}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
      {isActive ? <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-[var(--primary-start)]" /> : null}
    </TransitionLink>
  );
}
