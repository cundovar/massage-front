"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreviewMode } from "@/contexts/PreviewModeContext";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isPreview = usePreviewMode();

  useLayoutEffect(() => {
    if (isPreview) {
      return;
    }

    const element = containerRef.current;

    if (!element) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 28, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, element);

    return () => {
      context.revert();
    };
  }, [delay, isPreview]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
