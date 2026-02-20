"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

interface TransitionContextType {
  isTransitioning: boolean;
  navigateTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isTransitioning) {
      document.body.classList.add("is-transitioning");
      return;
    }
    document.body.classList.remove("is-transitioning");
  }, [isTransitioning]);

  useEffect(() => {
    if (!isTransitioning) return;
    timeoutRef.current = setTimeout(() => setIsTransitioning(false), 120);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, isTransitioning]);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.body.classList.remove("is-transitioning");
    };
  }, []);

  const navigateTo = useCallback(
    (href: string) => {
      if (href === pathname || isTransitioning) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }

      setIsTransitioning(true);
      timelineRef.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => router.push(href),
      });

      timelineRef.current = tl;

      // ============================================
      // SORTIE - Slide vers la gauche, désynchronisé
      // ============================================

      // Le titre part en premier, rapide et loin
      tl.to("[data-animate='title']", {
        x: -180,
        opacity: 0,
        scale: 0.95,
        duration: 0.45,
        ease: "power3.in",
      })
        // Les images partent plus lentement avec rotation subtile
        .to(
          "[data-animate='image']",
          {
            x: -120,
            opacity: 0,
            scale: 0.92,
            rotation: -2,
            duration: 0.55,
            ease: "power2.in",
          },
          "-=0.35",
        )
        // Le texte part avec un délai différent
        .to(
          "[data-animate='text']",
          {
            x: -150,
            opacity: 0,
            duration: 0.5,
            ease: "power3.in",
          },
          "-=0.45",
        )
        // Les sections partent en cascade
        .to(
          "[data-animate='section']",
          {
            x: -80,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
            stagger: {
              each: 0.06,
              from: "start",
            },
          },
          "-=0.4",
        )
        // Les boutons/CTA partent en dernier
        .to(
          "[data-animate='cta']",
          {
            x: -100,
            opacity: 0,
            scale: 0.9,
            duration: 0.35,
            ease: "power3.in",
          },
          "-=0.3",
        );
    },
    [isTransitioning, pathname, router],
  );

  return (
    <TransitionContext.Provider value={{ isTransitioning, navigateTo }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition(): TransitionContextType {
  const ctx = useContext(TransitionContext);
  // Return fallback for components rendered outside TransitionProvider (e.g., admin preview)
  if (!ctx) {
    return {
      isTransitioning: false,
      navigateTo: () => {},
    };
  }
  return ctx;
}

export function useTransitionSafe(): TransitionContextType | null {
  return useContext(TransitionContext);
}
