"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/navigation", label: "Navigation" },
  { href: "/admin/footer", label: "Footer" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!touchStartX.current || !touchEndX.current) return;

      const distance = touchEndX.current - touchStartX.current;
      const isLeftSwipe = distance < -minSwipeDistance;
      const isRightSwipe = distance > minSwipeDistance;

      // Swipe droite depuis le bord gauche = ouvrir
      if (isRightSwipe && touchStartX.current < 30 && !isOpen) {
        setIsOpen(true);
      }

      // Swipe gauche = fermer
      if (isLeftSwipe && isOpen) {
        setIsOpen(false);
      }

      touchStartX.current = null;
      touchEndX.current = null;
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bo-sidebar fixed inset-y-0 left-0 z-40 w-64 flex-col p-5 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:flex ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Languette accrochee a la sidebar */}
        <div
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchMove={(e) => {
            touchEndX.current = e.touches[0].clientX;
          }}
          onTouchEnd={() => {
            if (!touchStartX.current || !touchEndX.current) return;
            const distance = touchEndX.current - touchStartX.current;
            if (distance > 30 && !isOpen) setIsOpen(true);
            if (distance < -30 && isOpen) setIsOpen(false);
            touchStartX.current = null;
            touchEndX.current = null;
          }}
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-6 top-20 flex h-16 w-6 cursor-pointer items-center justify-center rounded-r-full bg-gradient-to-r from-stone-800 to-stone-700 shadow-lg lg:hidden"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <div className="flex flex-col gap-1">
            <div className={`h-0.5 w-3 rounded-full bg-amber-400 transition-transform duration-300 ${isOpen ? "rotate-[-20deg] translate-y-[3px]" : ""}`} />
            <div className={`h-0.5 w-3 rounded-full bg-amber-400 transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <div className={`h-0.5 w-3 rounded-full bg-amber-400 transition-transform duration-300 ${isOpen ? "rotate-[20deg] -translate-y-[3px]" : ""}`} />
          </div>
        </div>
        <p className="text-2xl leading-none text-amber-300">Helene</p>
        <p className="mt-1 text-xs tracking-[0.18em] text-stone-400 uppercase">Backoffice</p>

        <nav className="mt-8 space-y-1" aria-label="Navigation admin">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm transition-colors duration-150 ${
                  active
                    ? "bg-amber-500/20 text-amber-300"
                    : "text-stone-300 hover:bg-white/5 hover:text-amber-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-stone-700 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-300 transition-colors duration-150 hover:bg-white/5 hover:text-amber-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Voir le site
          </Link>
        </div>
      </aside>
    </>
  );
}
