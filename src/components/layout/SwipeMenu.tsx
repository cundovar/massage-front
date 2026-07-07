"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { WindTreeAnimation } from "@/components/animations/WindTreeAnimation";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import type { NavItem } from "@/types/navigation";

const PANEL_WIDTH = 300; // largeur du tiroir en px
const EDGE_ZONE = 28; // px depuis le bord gauche où un swipe d'ouverture peut démarrer
const OPEN_THRESHOLD = 70; // px glissés pour valider l'ouverture/fermeture
const SCROLL_HIDE = 140; // au-delà de ce scrollY, le header est considéré masqué

interface SwipeMenuProps {
  initialNavItems?: NavItem[];
}

/**
 * Menu latéral mobile qui s'ouvre en glissant du bord gauche vers la droite.
 * Une languette (couleur = thème courant via --gradient-primary) apparaît sur le
 * bord gauche uniquement quand le header du haut a disparu au scroll.
 */
export function SwipeMenu({ initialNavItems }: SwipeMenuProps) {
  const pathname = usePathname();
  const navItems = initialNavItems ?? [];
  const [open, setOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  // Décalage du doigt pendant le geste (0..PANEL_WIDTH), null quand on ne glisse pas.
  const [dragX, setDragX] = useState<number | null>(null);

  const gesture = useRef<{ active: boolean; startX: number; startY: number; dx: number; mode: "open" | "close" | null }>(
    { active: false, startX: 0, startY: 0, dx: 0, mode: null },
  );
  const rafId = useRef<number | null>(null);
  const pendingDrag = useRef<number | null>(null);

  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // Détecte si le header est masqué par le scroll.
  useEffect(() => {
    const onScroll = () => setHeaderHidden(window.scrollY > SCROLL_HIDE);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Verrouille le scroll du body quand le tiroir est ouvert.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Ferme sur Échap (la fermeture au clic sur un lien est gérée sur chaque lien).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const scheduleDrag = useCallback((x: number) => {
    pendingDrag.current = Math.max(0, Math.min(PANEL_WIDTH, x));
    if (rafId.current != null) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (pendingDrag.current != null) setDragX(pendingDrag.current);
    });
  }, []);

  const endDrag = useCallback(() => {
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    pendingDrag.current = null;
    setDragX(null);
  }, []);

  // Gestion des gestes tactiles (mobile uniquement).
  useEffect(() => {
    if (isAdmin) return;

    const onStart = (e: TouchEvent) => {
      if (window.innerWidth >= 768) return; // desktop : ignoré
      if (e.touches.length !== 1) return;
      const t = e.touches[0];

      if (open) {
        // Geste de fermeture : démarre depuis l'intérieur du tiroir.
        if (t.clientX > PANEL_WIDTH) return;
        gesture.current = { active: true, startX: t.clientX, startY: t.clientY, dx: 0, mode: "close" };
      } else {
        // Geste d'ouverture : seulement si le header est masqué et depuis le bord gauche.
        if (!headerHidden || t.clientX > EDGE_ZONE) return;
        gesture.current = { active: true, startX: t.clientX, startY: t.clientY, dx: 0, mode: "open" };
      }
    };

    const onMove = (e: TouchEvent) => {
      const g = gesture.current;
      if (!g.active) return;
      const t = e.touches[0];
      const dx = t.clientX - g.startX;
      const dy = t.clientY - g.startY;

      // Intention de scroll vertical : on abandonne le geste.
      if (Math.abs(dx) < 10 && Math.abs(dy) > 12) {
        g.active = false;
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault(); // empêche le scroll vertical pendant le swipe horizontal
      }

      g.dx = dx;
      if (g.mode === "open") {
        scheduleDrag(dx); // 0..PANEL_WIDTH
      } else {
        scheduleDrag(PANEL_WIDTH + dx); // dx négatif => referme
      }
    };

    const onEnd = () => {
      const g = gesture.current;
      if (!g.active) return;
      g.active = false;
      if (g.mode === "open") {
        setOpen(g.dx > OPEN_THRESHOLD);
      } else {
        setOpen(g.dx > -OPEN_THRESHOLD);
      }
      endDrag();
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [open, headerHidden, isAdmin, scheduleDrag, endDrag]);

  if (isAdmin || navItems.length === 0) {
    return null;
  }

  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const dragging = dragX != null;
  const translate = dragging ? dragX - PANEL_WIDTH : open ? 0 : -PANEL_WIDTH;
  const overlayOpacity = dragging ? dragX / PANEL_WIDTH : open ? 1 : 0;
  const panelTransition = dragging ? "none" : "transform 0.32s cubic-bezier(0.22, 0.61, 0.36, 1)";
  const overlayActive = open || dragging;

  return (
    <div className="md:hidden">
      {/* Languette sur le bord gauche */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu de navigation"
        aria-expanded={open}
        className={`fixed top-1/2 left-0 z-40 flex h-16 w-7 -translate-y-1/2 items-center justify-center rounded-r-xl text-white shadow-lg transition-[opacity,transform] duration-300 ${
          headerHidden && !open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-0"
        }`}
        style={{ background: "var(--gradient-primary)" }}
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
      </button>

      {/* Voile / backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/40 ${
          overlayActive ? "" : "pointer-events-none"
        }`}
        style={{
          opacity: overlayOpacity,
          transition: dragging ? "none" : "opacity 0.32s ease",
        }}
      />

      {/* Tiroir */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        aria-hidden={!overlayActive}
        className="fixed top-0 left-0 z-50 flex h-full max-w-[85vw] flex-col overflow-hidden border-r border-[var(--card-border)] bg-[var(--background-alt)] shadow-2xl"
        style={{
          width: PANEL_WIDTH,
          transform: `translateX(${translate}px)`,
          transition: panelTransition,
        }}
      >
        <WindTreeAnimation className="wind-tree--menu" />
        <div
          className="relative z-10 flex items-center justify-between px-5 py-4"
          style={{ background: "var(--gradient-primary)" }}
        >
          <span className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation principale">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = !item.isExternal && isActive(item.path);
              return (
                <li key={item.slug}>
                  {item.isExternal ? (
                    <a
                      href={item.path}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-[var(--text-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--primary-start)_12%,transparent)] hover:text-[var(--text-primary)]"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <TransitionLink
                      href={item.path}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-xl px-4 py-3 font-medium transition-colors ${
                        active
                          ? "text-white"
                          : "text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--primary-start)_12%,transparent)]"
                      }`}
                      style={active ? { background: "var(--gradient-primary)" } : undefined}
                    >
                      {item.title}
                    </TransitionLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
