"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroParallax() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const orbPrimaryRef = useRef<HTMLDivElement | null>(null);
  const orbSecondaryRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const orbPrimary = orbPrimaryRef.current;
    const orbSecondary = orbSecondaryRef.current;

    if (!wrapper || !orbPrimary || !orbSecondary) {
      return;
    }

    const context = gsap.context(() => {
      gsap.to(orbPrimary, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          scrub: true,
          start: "top top",
          end: "bottom top",
        },
      });

      gsap.to(orbSecondary, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          scrub: true,
          start: "top top",
          end: "bottom top",
        },
      });
    }, wrapper);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      <div
        ref={orbPrimaryRef}
        className="absolute -left-12 -top-8 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl md:h-64 md:w-64"
      />
      <div
        ref={orbSecondaryRef}
        className="absolute -bottom-16 right-4 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl md:h-80 md:w-80"
      />
    </div>
  );
}
