"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Home, Calendar, Moon, Phone, Sun } from "lucide-react";
import { MobileNavButton, MobileNavLinkButton } from "@/components/ui/MobileNavButton";

interface BottomNavProps {
  showThemeToggle?: boolean;
}

export function BottomNav({ showThemeToggle = true }: BottomNavProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const domTheme = document.documentElement.dataset.theme;
    if (domTheme === "dark") {
      return "dark";
    }

    return window.localStorage.getItem("front_theme") === "dark" ? "dark" : "light";
  });
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

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("front_theme", nextTheme);
  }

  return (
    <nav
      className={`fixed right-0 bottom-0 left-0 z-50 safe-bottom transition-transform duration-300 md:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around rounded-t-3xl border border-white/25 bg-white/55 px-2 py-3 shadow-lg shadow-black/10 backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-stone-900/55">
        <MobileNavLinkButton
          href="/"
          icon={<Home className="h-5 w-5" />}
          label="Accueil"
          isActive={isActive("/")}
        />
        <MobileNavLinkButton
          href="/reservation"
          icon={<Calendar className="h-5 w-5" />}
          label="Réserver"
          variant="primary"
          isActive={isActive("/reservation")}
          ariaLabel="Réserver un massage"
        />
        <MobileNavLinkButton
          href="/contact"
          icon={<Phone className="h-5 w-5" />}
          label="Contact"
          variant="outline"
          isActive={isActive("/contact")}
          ariaLabel="Contacter le cabinet"
        />

        {showThemeToggle ? (
          <MobileNavButton
            icon={theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            label="Mode"
            onClick={toggleTheme}
            ariaLabel={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
          />
        ) : null}
      </div>
    </nav>
  );
}
