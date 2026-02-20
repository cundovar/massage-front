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

      setIsTransitioning(true);
      timelineRef.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => router.push(href),
      });

      timelineRef.current = tl;

      tl.to("[data-animate='title']", {
        y: -30,
        opacity: 0,
        duration: 0.28,
        ease: "power2.in",
      })
        .to(
          "[data-animate='text']",
          {
            y: -20,
            opacity: 0,
            duration: 0.28,
            ease: "power2.in",
          },
          "-=0.18",
        )
        .to(
          "[data-animate='image']",
          {
            y: -15,
            opacity: 0,
            duration: 0.32,
            ease: "power2.in",
          },
          "-=0.22",
        )
        .to(
          "[data-animate='section']",
          {
            y: -10,
            opacity: 0,
            duration: 0.24,
            ease: "power2.in",
            stagger: 0.04,
          },
          "-=0.2",
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

