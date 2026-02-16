"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { NavItem } from "@/types/navigation";

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

export function Header({ initialNavItems }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(initialNavItems?.length ? initialNavItems : FALLBACK_NAV);

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

    void refreshNavigation();

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
    <header className="glass-panel fixed left-4 right-4 top-4 z-50 rounded-2xl px-4 py-3 md:left-8 md:right-8">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-3xl leading-none font-serif text-brown-darker">
          Helene
        </Link>

        <nav className="hidden flex-1 flex-wrap gap-1 text-sm tracking-wide md:flex" aria-label="Navigation principale">
          {navItems.map((item) => (
            <Link
              key={item.slug}
              href={item.path}
              className={`rounded-full px-4 py-2 transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-gold-default font-medium text-brown-darker"
                  : "text-brown-darker hover:bg-sand-light/10 hover:text-gold-default"
              }`}
            >
              {item.title}
            </Link>
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
              <Link
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
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
import { useState, useEffect } from "react";
import Link from "next/link";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-300
      ${isScrolled
        ? "bg-white/95 backdrop-blur-md shadow-sm"
        : "bg-transparent"
      }
    `}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif">
          Hélène
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/soins" className="hover:text-orange-500 transition">Soins</Link>
          <Link href="/a-propos" className="hover:text-orange-500 transition">À propos</Link>
          <Link href="/contact" className="hover:text-orange-500 transition">Contact</Link>
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          className="hidden md:inline-flex px-6 py-2 bg-gradient-to-r from-[#FFCE67] to-[#F67E54] text-white rounded-full hover:shadow-lg transition"
        >
          Réserver
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Menu</span>
          {/* Hamburger icon */}
        </button>
      </div>
    </header>
  );
}
