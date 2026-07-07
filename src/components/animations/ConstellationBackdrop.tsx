"use client";

import { useEffect, useRef } from "react";

/**
 * Fond animé "constellation réflexo" (ciel nocturne + pied de réflexologie).
 * - Silhouette du pied qui se dessine (stroke-dashoffset animé).
 * - Points réflexo dorés qui s'allument en séquence, reliés par des lignes (constellation).
 * - Étoiles ambiantes qui scintillent.
 * Points, liens et étoiles sont générés en JS (comme la maquette d'origine) puis
 * animés via CSS. Respecte prefers-reduced-motion (rendu statique). À placer en
 * `absolute inset-0` derrière le contenu du Hero. Ce backdrop apporte son propre
 * fond nuit (surface sombre). Styles associés : `.constellation-hero` dans globals.css.
 */

/** Zones réflexo (coords viewBox 0 0 400 680). Décor seul : pas d'étiquettes. */
const ZONES: { x: number; y: number; r: number }[] = [
  { x: 103, y: 82, r: 4.5 },
  { x: 210, y: 64, r: 3 },
  { x: 188, y: 138, r: 3.5 },
  { x: 165, y: 195, r: 4 },
  { x: 190, y: 258, r: 4.5 },
  { x: 148, y: 305, r: 3.5 },
  { x: 232, y: 296, r: 3.5 },
  { x: 182, y: 345, r: 4 },
  { x: 178, y: 425, r: 3.5 },
  { x: 172, y: 505, r: 3 },
  { x: 168, y: 572, r: 4.5 },
];

const SVG_NS = "http://www.w3.org/2000/svg";
const DEBUT = 2.6; // départ après le tracé de la silhouette
const PAS = 0.42; // délai entre chaque point

export function ConstellationBackdrop() {
  const svgRef = useRef<SVGSVGElement>(null);
  const liensRef = useRef<SVGGElement>(null);
  const pointsRef = useRef<SVGGElement>(null);
  const cielRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const gLiens = liensRef.current;
    const gPoints = pointsRef.current;
    const ciel = cielRef.current;
    if (!svg || !gLiens || !gPoints || !ciel) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Silhouette : longueur réelle des traits pour un tracé propre cross-browser.
    svg.querySelectorAll<SVGGeometryElement>(".constellation-silhouette").forEach((p) => {
      const len = Math.ceil(p.getTotalLength()) + 5;
      p.style.setProperty("--len", String(len));
    });

    // Liens + points (halo + point).
    ZONES.forEach((z, i) => {
      const t = DEBUT + i * PAS;

      if (i < ZONES.length - 1) {
        const n = ZONES[i + 1];
        const l = document.createElementNS(SVG_NS, "line");
        l.setAttribute("x1", String(z.x));
        l.setAttribute("y1", String(z.y));
        l.setAttribute("x2", String(n.x));
        l.setAttribute("y2", String(n.y));
        l.classList.add("constellation-lien");
        const len = Math.hypot(n.x - z.x, n.y - z.y);
        l.style.setProperty("--len", String(Math.ceil(len)));
        if (!reduced) l.style.animationDelay = `${t + 0.25}s`;
        gLiens.appendChild(l);
      }

      const halo = document.createElementNS(SVG_NS, "circle");
      halo.setAttribute("cx", String(z.x));
      halo.setAttribute("cy", String(z.y));
      halo.setAttribute("r", String(z.r + 3));
      halo.classList.add("constellation-pt-halo");
      halo.style.transformOrigin = `${z.x}px ${z.y}px`;
      if (!reduced) halo.style.animationDelay = `${t + 1 + i * 0.6}s`;
      gPoints.appendChild(halo);

      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx", String(z.x));
      c.setAttribute("cy", String(z.y));
      c.setAttribute("r", String(z.r));
      c.classList.add("constellation-pt");
      if (!reduced) c.style.animationDelay = `${t}s, ${t + 1.2 + i * 0.35}s`;
      gPoints.appendChild(c);
    });

    // Étoiles ambiantes.
    for (let i = 0; i < 26; i++) {
      const e = document.createElement("div");
      e.className = "constellation-etoile";
      e.style.left = `${Math.random() * 100}%`;
      e.style.top = `${Math.random() * 100}%`;
      if (!reduced) {
        e.style.animationDuration = `${2.5 + Math.random() * 4}s`;
        e.style.animationDelay = `${Math.random() * 4}s`;
      }
      if (Math.random() > 0.7) {
        e.style.width = "3px";
        e.style.height = "3px";
      }
      ciel.appendChild(e);
    }

    return () => {
      gLiens.replaceChildren();
      gPoints.replaceChildren();
      ciel.replaceChildren();
    };
  }, []);

  return (
    <div className="constellation-hero" aria-hidden="true">
      <div ref={cielRef} className="constellation-etoiles" />

      <div className="constellation-carte">
        <svg ref={svgRef} viewBox="0 0 400 680">
          {/* silhouette du pied (plante + orteils, trait fin) */}
          <g>
            <path
              className="constellation-silhouette trace"
              d="M 105 135
                C 75 175, 62 250, 78 310
                C 92 345, 92 380, 82 420
                C 72 470, 78 540, 105 585
                C 130 625, 200 630, 230 600
                C 262 570, 268 505, 258 450
                C 250 400, 258 350, 272 305
                C 288 255, 295 200, 285 155
                C 270 120, 240 105, 210 108
                C 180 110, 140 115, 105 135 Z"
            />
            <ellipse className="constellation-silhouette trace" cx="103" cy="82" rx="33" ry="42" />
            <ellipse className="constellation-silhouette trace" cx="168" cy="60" rx="16" ry="23" />
            <ellipse className="constellation-silhouette trace" cx="210" cy="64" rx="14" ry="21" />
            <ellipse className="constellation-silhouette trace" cx="248" cy="76" rx="13" ry="19" />
            <ellipse className="constellation-silhouette trace" cx="282" cy="95" rx="11" ry="16" />
          </g>
          {/* liens + points générés en JS */}
          <g ref={liensRef} />
          <g ref={pointsRef} />
        </svg>
      </div>
    </div>
  );
}
