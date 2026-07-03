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

      // Helper: only animate if elements exist
      const animateIfExists = (
        selector: string,
        vars: gsap.TweenVars,
        position?: string,
      ) => {
        if (document.querySelector(selector)) {
          tl.to(selector, vars, position);
        }
      };

      // ============================================
      // SORTIE - Slide vers la gauche, désynchronisé
      // ============================================

      animateIfExists("[data-animate='title']", {
        x: -180,
        opacity: 0,
        scale: 0.95,
        duration: 0.45,
        ease: "power3.in",
      });

      animateIfExists(
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
      );

      animateIfExists(
        "[data-animate='text']",
        {
          x: -150,
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
        },
        "-=0.45",
      );

      animateIfExists(
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
      );

      animateIfExists(
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

export function useTransitionSafe(): TransitionContextType | null {
  return useContext(TransitionContext);
}
