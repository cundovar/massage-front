"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fond animé "ensō + encens" façon sumi-e.
 * - Le cercle ensō se dessine (stroke-dashoffset animé).
 * - La fumée d'encens ondule via un drift lent de la turbulence SVG en rAF
 *   (pas de SMIL, donc compatible Safari).
 * Respecte prefers-reduced-motion. À placer en `absolute inset-0` derrière le
 * contenu du Hero. Styles associés : `.enso-hero` dans globals.css.
 */
export function EnsoBackdrop() {
  const ensoRef = useRef<SVGSVGElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const [draw, setDraw] = useState(false);

  // Mesure la longueur réelle des tracés (sécurité cross-browser) puis lance le dessin.
  useEffect(() => {
    const svg = ensoRef.current;
    if (!svg) return;
    svg.querySelectorAll<SVGPathElement>("path").forEach((p) => {
      const len = Math.ceil(p.getTotalLength()) + 10;
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });
    const id = requestAnimationFrame(() => setDraw(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Fumée vivante : oscillation lente de baseFrequency => ondulation sans répétition.
  useEffect(() => {
    const turb = turbRef.current;
    if (!turb) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start: number | null = null;
    const drift = (ts: number) => {
      if (start === null) start = ts;
      const t = (ts - start) / 1000;
      const fx = 0.012 + 0.004 * Math.sin(t * 0.21);
      const fy = 0.045 + 0.008 * Math.sin(t * 0.13 + 1.7);
      turb.setAttribute("baseFrequency", `${fx.toFixed(4)} ${fy.toFixed(4)}`);
      raf = requestAnimationFrame(drift);
    };
    raf = requestAnimationFrame(drift);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="enso-hero" aria-hidden="true">
      {/* Ensō */}
      <div className="enso-wrap">
        <svg ref={ensoRef} className={`enso${draw ? " draw" : ""}`} viewBox="0 0 500 500">
          <defs>
            <filter id="enso-brosse" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={3} seed={7} result="t" />
              <feDisplacementMap in="SourceGraphic" in2="t" scale={9} />
            </filter>
            <filter id="enso-brosse2" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={21} result="t" />
              <feDisplacementMap in="SourceGraphic" in2="t" scale={16} />
            </filter>
          </defs>
          {/* cercle ouvert (ensō), ouverture ~30° */}
          <path
            className="trait-seconde"
            d="M 318 78 C 420 118, 462 220, 428 314 C 394 408, 284 452, 192 420 C 100 388, 48 292, 76 198 C 102 112, 186 62, 276 70"
          />
          <path
            className="trait-principal"
            d="M 318 78 C 420 118, 462 220, 428 314 C 394 408, 284 452, 192 420 C 100 388, 48 292, 76 198 C 102 112, 186 62, 276 70"
          />
        </svg>
      </div>

      {/* Encens */}
      <div className="encens">
        <svg viewBox="0 0 260 620" preserveAspectRatio="xMidYMax meet">
          <defs>
            <filter id="enso-fumee" x="-60%" y="-20%" width="220%" height="140%">
              <feTurbulence
                ref={turbRef}
                type="fractalNoise"
                baseFrequency="0.012 0.045"
                numOctaves={2}
                seed={3}
                result="t"
              />
              <feDisplacementMap in="SourceGraphic" in2="t" scale={34} xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation={1.1} />
            </filter>
            <linearGradient id="enso-fade" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="white" stopOpacity="1" />
              <stop offset=".75" stopColor="white" stopOpacity=".5" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="enso-fadeMask">
              <rect x="-100" y="0" width="460" height="620" fill="url(#enso-fade)" />
            </mask>
          </defs>

          {/* bâton + braise */}
          <line className="baton" x1="130" y1="618" x2="130" y2="560" />
          <circle className="braise-halo" cx="130" cy="556" r="7" />
          <circle className="braise" cx="130" cy="556" r="3" />

          {/* volutes de fumée */}
          <g filter="url(#enso-fumee)" mask="url(#enso-fadeMask)">
            <path className="volute v1" d="M130 552 C 128 480, 142 430, 126 360 C 112 300, 140 240, 128 170 C 120 115, 134 60, 128 10" />
            <path className="volute v2" d="M130 552 C 136 490, 118 420, 134 355 C 148 295, 118 230, 132 165 C 142 110, 124 55, 132 5" />
            <path className="volute v3" d="M130 552 C 124 470, 146 400, 124 330 C 108 270, 146 200, 126 130 C 114 80, 138 40, 130 0" />
          </g>
        </svg>
      </div>
    </div>
  );
}
