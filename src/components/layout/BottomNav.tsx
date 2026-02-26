"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Flower2, CalendarHeart, MessageCircle, Moon, Sun } from "lucide-react";
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

  const isDark = theme === "dark";

  const navStyle: React.CSSProperties = isDark
    ? {
        background: "linear-gradient(135deg, rgba(41,37,36,0.95) 0%, rgba(28,25,23,0.98) 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,206,103,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
      }
    : {
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(253,248,243,0.98) 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,206,103,0.3)",
        boxShadow: "0 8px 32px rgba(246,126,84,0.15), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
      };

  return (
    <nav
      className={`fixed right-0 bottom-0 left-0 z-50 safe-bottom transition-transform duration-300 md:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-label="Navigation mobile"
    >
      <div
        className="mx-3 mb-3 flex items-center justify-around rounded-2xl px-2 py-3 transition-all duration-300"
        style={navStyle}
      >
        <MobileNavLinkButton
          href="/"
          icon={<Flower2 className="h-5 w-5" strokeWidth={1.75} />}
          label="Accueil"
          isActive={isActive("/")}
        />
        <MobileNavLinkButton
          href="/reservation"
          icon={<CalendarHeart className="h-5 w-5" strokeWidth={1.75} />}
          label="Réserver"
          variant="primary"
          isActive={isActive("/reservation")}
          ariaLabel="Réserver un massage"
        />
        <MobileNavLinkButton
          href="/contact"
          icon={<MessageCircle className="h-5 w-5" strokeWidth={1.75} />}
          label="Contact"
          variant="outline"
          isActive={isActive("/contact")}
          ariaLabel="Contacter le cabinet"
        />

        {showThemeToggle ? (
          <MobileNavButton
            icon={isDark ? <Sun className="h-5 w-5" strokeWidth={1.75} /> : <Moon className="h-5 w-5" strokeWidth={1.75} />}
            label="Mode"
            onClick={toggleTheme}
            ariaLabel={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
          />
        ) : null}
      </div>
    </nav>
  );
}
