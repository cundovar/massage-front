"use client";

import { useEffect, useRef } from "react";

type FloatingElement = {
  type: "petale" | "feuille";
  couleurs: readonly [string, string];
  taille: number;
  surfaceY: number;
  profondeur: number;
  x: number;
  y: number;
  vy: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rot: number;
  vRot: number;
  tumbleFreq: number;
  etat: "chute" | "flotte";
  tFlotte: number;
  dureeFlotte: number;
  alpha: number;
  driftX: number;
};

type Ripple = {
  x: number;
  y: number;
  r: number;
  alpha: number;
};

const COULEURS_PETALE = [
  ["#ecc9bd", "#dfae9f"],
  ["#e8bfa8", "#cd8f6b"],
  ["#f0d4c6", "#e0b39c"],
] as const;

const COULEURS_FEUILLE = [
  ["#a7b596", "#97a687"],
  ["#97a687", "#7c8b6e"],
] as const;

/**
 * Fond anime "petales sur l'eau".
 * - Petales et feuilles tombent puis flottent en profondeur.
 * - De petites ondes se forment a l'atterrissage.
 * Respecte prefers-reduced-motion. Styles associes : `.petals-hero`.
 */
export function PetalsBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let elements: FloatingElement[] = [];
    let ondes: Ripple[] = [];
    let raf = 0;
    let resizeTimer = 0;
    let prev: number | null = null;

    const nbElements = () => (width < 640 ? 8 : 14);

    const creer = (initial: boolean): FloatingElement => {
      const type = Math.random() > 0.42 ? "petale" : "feuille";
      const couleurs =
        type === "petale"
          ? COULEURS_PETALE[Math.floor(Math.random() * COULEURS_PETALE.length)]
          : COULEURS_FEUILLE[Math.floor(Math.random() * COULEURS_FEUILLE.length)];
      const surfaceY = height * (0.58 + Math.random() * 0.32);
      const profondeur = (surfaceY - height * 0.58) / (height * 0.32);
      const taille = (type === "petale" ? 13 : 17) * (0.7 + profondeur * 0.6);

      return {
        type,
        couleurs,
        taille,
        surfaceY,
        profondeur,
        x: Math.random() * width,
        y: initial ? (reduced || Math.random() > 0.5 ? surfaceY : -40 - Math.random() * height * 0.8) : -40 - Math.random() * 120,
        vy: 22 + Math.random() * 16,
        swayAmp: 22 + Math.random() * 26,
        swayFreq: 0.4 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.7,
        tumbleFreq: 0.5 + Math.random() * 0.5,
        etat: "chute",
        tFlotte: 0,
        dureeFlotte: 11 + Math.random() * 9,
        alpha: 1,
        driftX: (Math.random() - 0.5) * 6,
      };
    };

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      prev = null;
      elements = [];
      ondes = [];

      for (let i = 0; i < nbElements(); i += 1) {
        elements.push(creer(true));
      }
      if (reduced) {
        elements = elements.map((element) => ({ ...element, etat: "flotte", y: element.surfaceY }));
      }
    };

    const dessinerPetale = (element: FloatingElement) => {
      const s = element.taille;
      const gradient = ctx.createLinearGradient(-s, 0, s, 0);
      gradient.addColorStop(0, element.couleurs[0]);
      gradient.addColorStop(1, element.couleurs[1]);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.55, s * 0.72, s * 0.55, 0, s);
      ctx.bezierCurveTo(-s * 0.72, s * 0.55, -s * 0.9, -s * 0.55, 0, -s);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.quadraticCurveTo(s * 0.08, 0, 0, s * 0.8);
      ctx.strokeStyle = "rgba(255,255,255,.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const dessinerFeuille = (element: FloatingElement) => {
      const s = element.taille;
      const gradient = ctx.createLinearGradient(0, -s, 0, s);
      gradient.addColorStop(0, element.couleurs[0]);
      gradient.addColorStop(1, element.couleurs[1]);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, -s * 1.3);
      ctx.bezierCurveTo(s * 0.62, -s * 0.6, s * 0.62, s * 0.6, 0, s * 1.3);
      ctx.bezierCurveTo(-s * 0.62, s * 0.6, -s * 0.62, -s * 0.6, 0, -s * 1.3);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -s * 1.1);
      ctx.lineTo(0, s * 1.1);
      ctx.strokeStyle = "rgba(255,255,255,.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const boucle = (ts: number) => {
      if (prev === null) prev = ts;
      const dt = Math.min((ts - prev) / 1000, 0.05);
      prev = ts;
      const t = ts / 1000;

      ctx.clearRect(0, 0, width, height);

      for (let i = ondes.length - 1; i >= 0; i -= 1) {
        const onde = ondes[i];
        onde.r += dt * 26;
        onde.alpha -= dt * 0.5;
        if (onde.alpha <= 0) {
          ondes.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.ellipse(onde.x, onde.y, onde.r, onde.r * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120, 108, 84, ${onde.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      elements.sort((a, b) => a.surfaceY - b.surfaceY);

      for (const element of elements) {
        if (!reduced) {
          if (element.etat === "chute") {
            element.y += element.vy * dt;
            element.x += Math.cos(t * element.swayFreq + element.phase) * element.swayAmp * dt;
            element.rot += element.vRot * dt;
            if (element.y >= element.surfaceY) {
              element.y = element.surfaceY;
              element.etat = "flotte";
              element.tFlotte = 0;
              ondes.push({ x: element.x, y: element.surfaceY + element.taille * 0.5, r: element.taille * 0.5, alpha: 1 });
            }
          } else {
            element.tFlotte += dt;
            element.x += element.driftX * dt;
            element.rot += element.vRot * 0.15 * dt;
            if (element.tFlotte > element.dureeFlotte) element.alpha -= dt * 0.6;
            if (element.alpha <= 0 || element.x < -60 || element.x > width + 60) {
              Object.assign(element, creer(false));
            }
          }
        }

        const flotte = element.etat === "flotte";
        const bob = flotte ? Math.sin(t * 0.9 + element.phase) * 1.8 : 0;
        const distSurface = Math.max(0, element.surfaceY - element.y);
        const proche = Math.max(0, 1 - distSurface / (height * 0.4));

        if (proche > 0) {
          ctx.beginPath();
          ctx.ellipse(
            element.x,
            element.surfaceY + element.taille * 0.55 + (flotte ? bob * 0.4 : 0),
            element.taille * (0.6 + proche * 0.7),
            element.taille * 0.22 * (0.6 + proche * 0.7),
            0,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = `rgba(120, 108, 84, ${0.16 * proche * element.alpha})`;
          ctx.fill();
        }

        ctx.save();
        ctx.translate(element.x, element.y + bob);
        ctx.rotate(element.rot);
        const tumble = flotte ? 0.92 : 0.45 + Math.abs(Math.sin(t * element.tumbleFreq + element.phase)) * 0.55;
        ctx.scale(1, tumble);
        ctx.globalAlpha = element.alpha * (0.75 + element.profondeur * 0.25);
        if (element.type === "petale") {
          dessinerPetale(element);
        } else {
          dessinerFeuille(element);
        }
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      if (!reduced) {
        raf = window.requestAnimationFrame(boucle);
      }
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(init, 180);
    };

    init();
    raf = window.requestAnimationFrame(boucle);
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="petals-hero" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
