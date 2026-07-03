"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      gsap.set("[data-animate]", { clearProps: "transform,opacity" });

      const tl = gsap.timeline();

      // Helper: only animate if elements exist
      const animateIfExists = (
        selector: string,
        vars: gsap.TweenVars,
        position?: string,
      ) => {
        if (container.querySelector(selector)) {
          tl.from(selector, vars, position);
        }
      };

      // ============================================
      // ENTRÉE - Slide depuis la droite, désynchronisé
      // ============================================

      animateIfExists("[data-animate='section']", {
        x: 120,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: {
          each: 0.1,
          from: "end",
        },
      });

      animateIfExists(
        "[data-animate='image']",
        {
          x: 200,
          opacity: 0,
          scale: 1.05,
          rotation: 3,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.5",
      );

      animateIfExists(
        "[data-animate='text']",
        {
          x: 100,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        "-=0.55",
      );

      animateIfExists(
        "[data-animate='title']",
        {
          x: 180,
          opacity: 0,
          scale: 0.95,
          duration: 0.65,
          ease: "back.out(1.4)",
        },
        "-=0.5",
      );

      animateIfExists(
        "[data-animate='cta']",
        {
          x: 80,
          opacity: 0,
          scale: 0.85,
          duration: 0.5,
          ease: "back.out(2)",
        },
        "-=0.35",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={containerRef} className="page-content">
      {children}
    </div>
  );
}
