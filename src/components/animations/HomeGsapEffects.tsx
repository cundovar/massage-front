"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HomeGsapEffects() {
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        ".js-hero-content",
        { autoAlpha: 0, y: 30, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, delay: 0.4, ease: "power2.out" },
      );

      gsap.utils.toArray<HTMLElement>(".js-section-left").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, x: -80 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 80%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".js-section-right").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, x: 80 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 80%", once: true },
          },
        );
      });

      gsap.fromTo(
        ".js-tarifs-header",
        { autoAlpha: 0, y: -24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".js-tarifs-header", start: "top 82%", once: true },
        },
      );

      gsap.fromTo(
        ".js-offer-card",
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: { trigger: ".js-offers-grid", start: "top 82%", once: true },
        },
      );
    });

    return () => {
      context.revert();
    };
  }, []);

  return null;
}

