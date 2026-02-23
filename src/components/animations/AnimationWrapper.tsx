"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type AnimationEffect =
  | "none"
  | "fade-up"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "zoom-out"
  | "bounce";

interface AnimationWrapperProps {
  children: ReactNode;
  effect?: AnimationEffect;
  delay?: number;
  duration?: number;
  className?: string;
}

const ANIMATION_CONFIG: Record<AnimationEffect, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  none: {
    from: {},
    to: {},
  },
  "fade-up": {
    from: { autoAlpha: 0, y: 30 },
    to: { autoAlpha: 1, y: 0 },
  },
  "fade-down": {
    from: { autoAlpha: 0, y: -30 },
    to: { autoAlpha: 1, y: 0 },
  },
  "slide-left": {
    from: { autoAlpha: 0, x: -80 },
    to: { autoAlpha: 1, x: 0 },
  },
  "slide-right": {
    from: { autoAlpha: 0, x: 80 },
    to: { autoAlpha: 1, x: 0 },
  },
  "zoom-in": {
    from: { autoAlpha: 0, scale: 0.8 },
    to: { autoAlpha: 1, scale: 1 },
  },
  "zoom-out": {
    from: { autoAlpha: 0, scale: 1.2 },
    to: { autoAlpha: 1, scale: 1 },
  },
  bounce: {
    from: { autoAlpha: 0, y: 50 },
    to: { autoAlpha: 1, y: 0 },
  },
};

export function AnimationWrapper({
  children,
  effect = "fade-up",
  delay = 0,
  duration = 0.8,
  className,
}: AnimationWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const element = containerRef.current;

    if (!element || effect === "none") {
      return;
    }

    const config = ANIMATION_CONFIG[effect];
    const ease = effect === "bounce" ? "bounce.out" : "power2.out";

    const context = gsap.context(() => {
      gsap.fromTo(element, config.from, {
        ...config.to,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          once: true,
        },
      });
    }, element);

    return () => {
      context.revert();
    };
  }, [effect, delay, duration]);

  if (effect === "none") {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={className} style={{ visibility: "hidden" }}>
      {children}
    </div>
  );
}
