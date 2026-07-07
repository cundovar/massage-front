"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fond animé "racines plantaires" (ancrage / réflexologie).
 * - Le sol et le pied de profil se dessinent (stroke-dashoffset animé, activé par `.draw`).
 * - Des racines poussent récursivement sous la plante (générées en JS).
 * - Des flux d'énergie et particules montent depuis le pied (rAF + intervalles).
 * Respecte prefers-reduced-motion (rendu statique, sans énergie). À placer en
 * `absolute inset-0` derrière le contenu du Hero. Ce backdrop apporte son propre
 * fond clair (surface claire, override thème sombre). Styles : `.racines-hero` dans globals.css.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const DEBUT_RACINES = 2.6; // après le tracé du pied

interface Mere {
  x: number;
  y: number;
  a: number;
  l: number;
  e: number;
}

export function RootsBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const soucheRef = useRef<SVGGElement>(null);
  const energieRef = useRef<SVGGElement>(null);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    const rootEl = rootRef.current;
    const souche = soucheRef.current;
    const energie = energieRef.current;
    if (!rootEl || !souche || !energie) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = new Set<number>();
    const rafs = new Set<number>();

    // ---- Racines : arbre de branches généré récursivement ----
    const creerBranche = (
      x: number,
      y: number,
      angle: number,
      longueur: number,
      epaisseur: number,
      profondeur: number,
      tDebut: number,
    ) => {
      if (profondeur > 4 || longueur < 18) return;

      const n = 6;
      let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      let px = x;
      let py = y;
      let pa = angle;
      const points: { x: number; y: number; a: number; p: number }[] = [];
      for (let i = 1; i <= n; i++) {
        pa += (Math.random() - 0.5) * 0.5; // la racine serpente
        pa = pa * 0.92 + (Math.PI / 2) * 0.08; // mais retourne vers le bas
        const seg = longueur / n;
        px += Math.cos(pa) * seg;
        py += Math.sin(pa) * seg;
        d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
        points.push({ x: px, y: py, a: pa, p: i / n });
      }

      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("class", "trace");
      path.setAttribute("stroke", profondeur < 2 ? "var(--racine)" : "var(--racine-fine)");
      path.setAttribute("stroke-width", epaisseur.toFixed(2));
      if (profondeur >= 3) path.setAttribute("opacity", ".75");
      const duree = 0.9 + longueur / 90;
      path.style.setProperty("--d", `${duree.toFixed(2)}s`);
      path.style.setProperty("--t", `${tDebut.toFixed(2)}s`);
      souche.appendChild(path);
      path.style.setProperty("--len", String(Math.ceil(path.getTotalLength()) + 4));

      const nbEnfants = profondeur < 2 ? 2 : Math.random() < 0.6 ? 2 : 1;
      for (let e = 0; e < nbEnfants; e++) {
        const noeud = points[2 + Math.floor(Math.random() * 3)];
        const tEnfant = tDebut + duree * noeud.p;
        const devie = (e === 0 ? -1 : 1) * (0.35 + Math.random() * 0.45);
        creerBranche(
          noeud.x,
          noeud.y,
          noeud.a + devie,
          longueur * (0.55 + Math.random() * 0.2),
          epaisseur * 0.62,
          profondeur + 1,
          tEnfant,
        );
      }

      // radicelles : petits poils sur les branches profondes
      if (profondeur >= 2) {
        const noeud = points[3];
        const poil = document.createElementNS(SVG_NS, "path");
        const pa2 = noeud.a + (Math.random() < 0.5 ? -1.2 : 1.2);
        poil.setAttribute(
          "d",
          `M ${noeud.x.toFixed(1)} ${noeud.y.toFixed(1)} l ${(Math.cos(pa2) * 9).toFixed(1)} ${(Math.sin(pa2) * 9).toFixed(1)}`,
        );
        poil.setAttribute("class", "trace");
        poil.setAttribute("stroke", "var(--racine-fine)");
        poil.setAttribute("stroke-width", ".8");
        poil.setAttribute("opacity", ".6");
        poil.style.setProperty("--d", ".4s");
        poil.style.setProperty("--t", `${(tDebut + 1).toFixed(2)}s`);
        souche.appendChild(poil);
        poil.style.setProperty("--len", String(Math.ceil(poil.getTotalLength()) + 2));
      }
    };

    const meres: Mere[] = [
      { x: 168, y: 389, a: Math.PI / 2 + 0.5, l: 120, e: 2.6 }, // orteil
      { x: 192, y: 389, a: Math.PI / 2 + 0.15, l: 150, e: 3 }, // avant-pied
      { x: 258, y: 389, a: Math.PI / 2 - 0.15, l: 145, e: 3 }, // avant du talon
      { x: 276, y: 389, a: Math.PI / 2 - 0.55, l: 115, e: 2.4 }, // talon
    ];
    meres.forEach((r, i) => creerBranche(r.x, r.y, r.a, r.l, r.e, 0, DEBUT_RACINES + i * 0.35));

    // ---- Mesure --len des tracés statiques (pied, sol, détails) ----
    rootEl.querySelectorAll<SVGGeometryElement>(".trace").forEach((p) => {
      if (!p.style.getPropertyValue("--len")) {
        p.style.setProperty("--len", String(Math.ceil(p.getTotalLength()) + 4));
      }
    });

    // Déclenche le tracé une fois les longueurs posées (évite le flash).
    const rafDraw = requestAnimationFrame(() => setDraw(true));
    rafs.add(rafDraw);

    // ---- Énergie : lignes fines montantes + particules ----
    if (!reduced) {
      const DEPARTS = [
        { x: 250, y: 300 },
        { x: 262, y: 250 },
        { x: 272, y: 210 },
        { x: 230, y: 340 },
        { x: 282, y: 180 },
      ];

      const flux = () => {
        const dep = DEPARTS[Math.floor(Math.random() * DEPARTS.length)];
        const hauteur = 130 + Math.random() * 160;
        const amp = 8 + Math.random() * 14;
        const freq = 1.5 + Math.random() * 1.5;
        const ph = Math.random() * Math.PI * 2;

        let d = `M ${dep.x} ${dep.y}`;
        const n = 14;
        for (let i = 1; i <= n; i++) {
          const p = i / n;
          const x = dep.x + Math.sin(p * Math.PI * freq + ph) * amp * p;
          const y = dep.y - hauteur * p;
          d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        }

        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", d);
        path.setAttribute("class", "flux");
        energie.appendChild(path);

        const len = Math.ceil(path.getTotalLength()) + 4;
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        path.style.transition = "stroke-dashoffset 2.4s cubic-bezier(.3,.2,.3,1)";
        const rafId = requestAnimationFrame(() => {
          path.style.strokeDashoffset = "0";
        });
        rafs.add(rafId);

        // puis la ligne s'évapore par le bas
        const to1 = window.setTimeout(() => {
          timers.delete(to1);
          path.style.transition = "stroke-dashoffset 2s ease, opacity 2s ease";
          path.style.strokeDashoffset = String(-len);
          path.style.opacity = "0";
          const to2 = window.setTimeout(() => {
            timers.delete(to2);
            path.remove();
          }, 2100);
          timers.add(to2);
        }, 2600);
        timers.add(to1);
      };

      const particule = () => {
        const dep = DEPARTS[Math.floor(Math.random() * DEPARTS.length)];
        const c = document.createElementNS(SVG_NS, "circle");
        c.setAttribute("class", "particule");
        c.setAttribute("r", (1.2 + Math.random() * 1.4).toFixed(1));
        energie.appendChild(c);

        const hauteur = 160 + Math.random() * 180;
        const amp = 6 + Math.random() * 12;
        const ph = Math.random() * Math.PI * 2;
        const duree = 4 + Math.random() * 3;
        let debut: number | null = null;
        let id = 0;

        const monter = (ts: number) => {
          if (debut === null) debut = ts;
          const t = (ts - debut) / 1000;
          const p = t / duree;
          rafs.delete(id);
          if (p >= 1) {
            c.remove();
            return;
          }
          c.setAttribute("cx", (dep.x + Math.sin(p * Math.PI * 3 + ph) * amp).toFixed(1));
          c.setAttribute("cy", (dep.y - hauteur * p).toFixed(1));
          c.setAttribute("opacity", (Math.sin(p * Math.PI) * 0.85).toFixed(2));
          id = requestAnimationFrame(monter);
          rafs.add(id);
        };
        id = requestAnimationFrame(monter);
        rafs.add(id);
      };

      // partition : l'énergie démarre quand les racines ont bien pris
      const start = window.setTimeout(() => {
        timers.delete(start);
        flux();
        const iFlux = window.setInterval(flux, 3200);
        const iPart = window.setInterval(particule, 1100);
        timers.add(iFlux);
        timers.add(iPart);
      }, 4800);
      timers.add(start);
    }

    return () => {
      timers.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
      rafs.forEach((r) => cancelAnimationFrame(r));
      souche.replaceChildren();
      energie.replaceChildren();
    };
  }, []);

  return (
    <div ref={rootRef} className={`racines-hero${draw ? " draw" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 500 760">
        {/* la terre, sous la ligne de sol */}
        <rect x="-40" y="388" width="580" height="372" className="racines-terre" />

        {/* ligne de sol */}
        <path
          className="trace sol-ligne"
          style={{ "--d": "1.2s", "--t": ".2s" } as React.CSSProperties}
          d="M 55 388 L 445 388"
        />

        {/* LE PIED : profil anatomique, trait fin, posé au sol */}
        <g>
          <path
            className="trace pied"
            style={{ "--d": "2.8s", "--t": ".8s" } as React.CSSProperties}
            d="M 258 160 C 254 210, 250 255, 247 292 C 246 302, 243 310, 238 318 C 226 334, 208 346, 188 354 C 178 358, 170 361, 164 364 C 156 367, 151 372, 151 378 C 151 383, 155 387, 162 388 L 178 388 C 186 389, 195 389, 203 387 C 217 379, 234 375, 248 380 C 256 383, 264 387, 272 386 C 280 385, 285 379, 286 370 C 288 358, 287 344, 283 332 C 279 318, 278 300, 280 282 C 282 245, 285 200, 287 160"
          />
          {/* malléole externe */}
          <path
            className="trace detail"
            style={{ "--d": ".7s", "--t": "3.4s" } as React.CSSProperties}
            d="M 256 306 C 264 304, 270 310, 269 318 C 268 325, 261 328, 255 325"
          />
          {/* pli du gros orteil */}
          <path
            className="trace detail"
            style={{ "--d": ".4s", "--t": "3.7s" } as React.CSSProperties}
            d="M 168 366 C 171 371, 172 377, 171 383"
          />
          {/* suggestion du deuxième orteil */}
          <path
            className="trace detail"
            style={{ "--d": ".4s", "--t": "3.9s" } as React.CSSProperties}
            d="M 157 363 C 161 360, 166 359, 170 361"
          />
          {/* ongle du gros orteil */}
          <path
            className="trace detail"
            style={{ "--d": ".3s", "--t": "4s" } as React.CSSProperties}
            d="M 153 373 C 152 376, 152 379, 153 382"
          />
          {/* ligne de la voûte */}
          <path
            className="trace detail"
            style={{ "--d": ".7s", "--t": "3.6s" } as React.CSSProperties}
            d="M 207 382 C 221 376, 236 374, 247 378"
          />
          {/* naissance du tendon d'Achille */}
          <path
            className="trace detail"
            style={{ "--d": ".5s", "--t": "4.1s" } as React.CSSProperties}
            d="M 279 300 C 276 316, 275 330, 278 342"
          />
          {/* ombre de contact */}
          <ellipse className="ombre-contact" cx="180" cy="389" rx="26" ry="2.6" />
          <ellipse className="ombre-contact" cx="272" cy="389" rx="17" ry="2.2" />
        </g>

        {/* racines générées en JS */}
        <g ref={soucheRef} />

        {/* énergie générée en JS */}
        <g className="energie-groupe" ref={energieRef} />

        {/* cailloux discrets sur la ligne de sol */}
        <g className="racines-cailloux">
          <ellipse cx="110" cy="386" rx="4" ry="2" />
          <ellipse cx="392" cy="386" rx="5" ry="2.4" />
          <ellipse cx="345" cy="387" rx="3" ry="1.6" />
        </g>
      </svg>
    </div>
  );
}
