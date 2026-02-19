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
      tl.from("[data-animate='title']", {
        y: 40,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      })
        .from(
          "[data-animate='text']",
          {
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .from(
          "[data-animate='image']",
          {
            y: 25,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.35",
        )
        .from(
          "[data-animate='section']",
          {
            y: 20,
            opacity: 0,
            duration: 0.4,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.3",
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
