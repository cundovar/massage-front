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
      gsap.set("[data-animate]", { clearProps: "transform,opacity" });

      const tl = gsap.timeline();

      // ============================================
      // ENTRÉE - Slide depuis la droite, désynchronisé
      // ============================================

      // Les sections arrivent en premier (fond de page)
      tl.from("[data-animate='section']", {
        x: 120,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: {
          each: 0.1,
          from: "end",
        },
      })
        // Les images arrivent avec un mouvement plus ample
        .from(
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
        )
        // Le texte glisse doucement
        .from(
          "[data-animate='text']",
          {
            x: 100,
            opacity: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.55",
        )
        // Le titre arrive avec un effet de rebond
        .from(
          "[data-animate='title']",
          {
            x: 180,
            opacity: 0,
            scale: 0.95,
            duration: 0.65,
            ease: "back.out(1.4)",
          },
          "-=0.5",
        )
        // Les boutons/CTA arrivent en dernier avec rebond
        .from(
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
