"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@/lib/api";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import type { NavItem } from "@/types/navigation";
import type { PublicSettings } from "@/types/settings";

interface HeaderProps {
  initialNavItems?: NavItem[];
}

const FALLBACK_NAV: NavItem[] = [
  { slug: "home", title: "Accueil", path: "/" },
  { slug: "soins", title: "Carte & tarifs", path: "/soins" },
  { slug: "entreprise", title: "Entreprise", path: "/entreprise" },
  { slug: "about", title: "A propos", path: "/a-propos" },
  { slug: "contact", title: "Contact", path: "/contact" },
];

const FALLBACK_SETTINGS: PublicSettings = {
  general: {
    siteName: "Helene Massage & Ayurveda",
    logo: null,
    favicon: null,
    defaultMetaDescription: "Massages ayurvediques, reflexologie et Kobido a Paris.",
  },
  contact: {
    address: { street: "123 Rue du Bien-Etre", postalCode: "75011", city: "Paris" },
    phone: "06 12 34 56 78",
    email: "contact@helene-massage.fr",
    googleMapsUrl: null,
    googleMapsEmbed: null,
  },
  hours: {
    schedule: [
      { days: "Lundi - Vendredi", hours: "10h - 20h" },
      { days: "Samedi", hours: "10h - 18h" },
    ],
    closedMessage: "Ferme le dimanche",
  },
  social: { instagram: null, facebook: null, linkedin: null },
  booking: {
    minDelayHours: 24,
    confirmationMessage: "Merci pour votre demande. Je vous recontacte dans les 24h.",
  },
  appearance: { primaryColor: "#D4A574", darkModeDefault: false },
  footer: { copyrightText: "© 2024 Helene Massage & Ayurveda", quickLinks: [] },
};

export function Header({ initialNavItems }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(initialNavItems?.length ? initialNavItems : FALLBACK_NAV);
  const [settings, setSettings] = useState<PublicSettings>(FALLBACK_SETTINGS);

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

  return (
    <header className="top-0 h-20 left-4 right-4 z-50 fixed rounded-2xl px-4 py-3 backdrop-blur-md  border-white/20 shadow-lg">
      <div className=" mx-auto flex flex-wrap items-center justify-between gap-4">
        <TransitionLink href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-3xl leading-none font-serif text-brown-darker">
          {settings.general.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getImageUrl(settings.general.logo) ?? settings.general.logo} alt={settings.general.siteName} className="h-9 w-auto rounded-sm" />
          ) : null}
          <span>{settings.general.siteName || "Helene"}</span>
        </TransitionLink>

        <nav className="hidden flex-1 flex-wrap gap-1 text-sm tracking-wide md:flex" aria-label="Navigation principale">
          {navItems.map((item) => (
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
          ))}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded p-2 text-brown-darker focus:outline-none focus:ring-2 focus:ring-gold-default"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-sand-warm/20 pb-2 pt-4" aria-label="Navigation mobile">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <TransitionLink
                key={item.slug}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-full px-4 py-3 text-left transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gold-default font-medium text-brown-darker"
                    : "text-brown-darker hover:bg-sand-light/10 hover:text-gold-default"
                }`}
              >
                {item.title}
              </TransitionLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
