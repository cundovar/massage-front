"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@/lib/api";
import { FALLBACK_NAV, FALLBACK_SETTINGS } from "@/lib/defaultContent";
import { HorizontalNav } from "@/components/layout/HorizontalNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import type { NavItem } from "@/types/navigation";
import type { PublicSettings } from "@/types/settings";

interface HeaderProps {
  initialNavItems?: NavItem[];
  initialSettings?: PublicSettings;
}

export function Header({ initialNavItems, initialSettings }: HeaderProps) {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItem[]>(
    initialNavItems?.length ? initialNavItems : FALLBACK_NAV,
  );
  const [settings, setSettings] = useState<PublicSettings>(initialSettings ?? FALLBACK_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

    async function refreshNavigation() {
      try {
        const response = await fetch(`${baseUrl}/api/navigation`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { items?: NavItem[] };
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          setNavItems(data.items);
        }
      } catch {
        // Keep initial/fallback navigation if refresh fails
      }
    }

    async function refreshSettings() {
      try {
        const response = await fetch(`${baseUrl}/api/settings`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as PublicSettings;
        if (!cancelled && data?.general?.siteName) {
          setSettings(data);
        }
      } catch {
        // Keep fallback settings
      }
    }

    void refreshNavigation();
    void refreshSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const isAdminRoute = useMemo(() => pathname?.startsWith("/admin"), [pathname]);
  if (isAdminRoute) {
    return null;
  }

  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const headerClass =
    settings.appearance.headerStyle === "transparent"
      ? "top-0 left-2 right-2 md:left-4 md:right-4 z-50 fixed rounded-2xl px-4 py-2 md:py-3 backdrop-blur-md border-white/20 shadow-lg bg-transparent"
      : settings.appearance.headerStyle === "solid"
        ? "top-0 left-2 right-2 md:left-4 md:right-4 z-50 fixed rounded-2xl px-4 py-2 md:py-3 border border-[var(--card-border)] bg-[var(--background-alt)] shadow-lg"
        : "top-0 left-2 right-2 md:left-4 md:right-4 z-50 sticky rounded-2xl px-4 py-2 md:py-3 backdrop-blur-md border border-[var(--card-border)] bg-[var(--background-alt)]/90 shadow-lg";

  return (
    <>
      <header className={headerClass}>
        <div className="mx-auto flex items-center justify-between gap-4">
          <TransitionLink href="/" className="flex items-center gap-3 text-3xl leading-none font-serif text-brown-darker">
            {settings.general.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getImageUrl(settings.general.logo) ?? settings.general.logo} alt={settings.general.siteName} className="h-9 w-auto rounded-sm" />
            ) : null}
            <span>{settings.general.siteName || "Helene"}</span>
          </TransitionLink>

          <nav className="hidden flex-1 flex-wrap gap-1 text-sm tracking-wide md:flex" aria-label="Navigation principale">
            {navItems.map((item) =>
              item.isExternal ? (
                <a
                  key={item.slug}
                  href={item.path}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-1 rounded-full px-4 py-2 text-brown-darker transition-all duration-200 hover:bg-sand-light/10 hover:text-gold-default"
                >
                  {item.title}
                  {item.openInNewTab && (
                    <svg className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </a>
              ) : (
                <TransitionLink
                  key={item.slug}
                  href={item.path}
                  className={`rounded-full px-4 py-2 transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gold-default font-medium text-brown-darker"
                      : "text-brown-darker hover:bg-sand-light/10 hover:text-gold-default"
                  }`}
                >
                  {item.title}
                </TransitionLink>
              )
            )}
          </nav>

          <div className="hidden md:block">
            {settings.appearance.showDarkModeToggle ? <ThemeToggle /> : null}
          </div>
        </div>
      </header>

      <HorizontalNav items={navItems} />
    </>
  );
}
