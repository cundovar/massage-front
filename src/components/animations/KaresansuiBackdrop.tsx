"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  rest: number;
  y: number;
  creux: number;
};

type SandLine = {
  pts: Point[];
  delai: number;
  alpha: number;
};

type Rock = {
  x: number;
  y: number;
  r: number;
  rot: number;
};

const PAS_X = 9;
const ESPACE_Y = 34;
const RAYON_RATEAU = 95;
const FORCE_RATEAU = 16;
const DUREE_TRACE = 3.6;

/**
 * Fond anime "karesansui" (jardin zen ratisse).
 * - Canvas plein cadre avec sillons de sable et rochers.
 * - Le curseur agit comme un rateau doux, avec retour elastique du sable.
 * Respecte prefers-reduced-motion. Styles associes : `.karesansui-hero`.
 */
export function KaresansuiBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const souris = { x: -9999, y: -9999, sx: -9999, sy: -9999, actif: false };
    let width = 0;
    let height = 0;
    let lignes: SandLine[] = [];
    let rochers: Rock[] = [];
    let raf = 0;
    let resizeTimer = 0;
    let t0: number | null = null;
    let palette = {
      sillon: "201, 187, 158",
      relief: "255, 252, 243",
      cercle: "176, 160, 128",
      ombre: "90, 80, 62",
      pierreStart: "#6b655a",
      pierreMid: "#5c564d",
      pierreEnd: "#47423a",
      mousse: "138, 148, 120",
    };

    const cssVar = (name: string, fallback: string) => {
      const style = window.getComputedStyle(canvas.parentElement ?? canvas);
      return style.getPropertyValue(name).trim() || fallback;
    };

    const readPalette = () => {
      palette = {
        sillon: cssVar("--zen-sillon-rgb", "201, 187, 158"),
        relief: cssVar("--zen-relief-rgb", "255, 252, 243"),
        cercle: cssVar("--zen-cercle-rgb", "176, 160, 128"),
        ombre: cssVar("--zen-ombre-rgb", "90, 80, 62"),
        pierreStart: cssVar("--zen-pierre-start", "#6b655a"),
        pierreMid: cssVar("--zen-pierre-mid", "#5c564d"),
        pierreEnd: cssVar("--zen-pierre-end", "#47423a"),
        mousse: cssVar("--zen-mousse-rgb", "138, 148, 120"),
      };
    };

    const deviationRochers = (x: number, y: number) => {
      let deviation = 0;
      for (const rock of rochers) {
        const dx = x - rock.x;
        const dy = y - rock.y;
        const dist2 = dx * dx + dy * dy;
        const sigma = rock.r * 1.9;
        const pousse = Math.exp(-dist2 / (2 * sigma * sigma));
        deviation += Math.sign(dy || 1) * pousse * rock.r * 1.15;
      }
      return deviation;
    };

    const resizeCanvas = () => {
      readPalette();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      if (nextWidth <= 0 || nextHeight <= 0) return false;

      width = nextWidth;
      height = nextHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    };

    const init = () => {
      if (!resizeCanvas()) return;
      t0 = null;

      rochers = [
        { x: width * 0.2, y: height * 0.3, r: Math.min(width, height) * 0.085, rot: -0.35 },
        { x: width * 0.78, y: height * 0.72, r: Math.min(width, height) * 0.065, rot: 0.55 },
      ];

      lignes = [];
      const total = Math.ceil(height / ESPACE_Y) + 2;
      for (let i = 0; i < total; i += 1) {
        const baseY = i * ESPACE_Y - ESPACE_Y / 2;
        const pts: Point[] = [];
        const phase = Math.random() * Math.PI * 2;
        const amp = 3 + Math.random() * 2.5;
        const freq = 0.006 + Math.random() * 0.002;

        for (let x = -PAS_X; x <= width + PAS_X; x += PAS_X) {
          const rest =
            baseY +
            Math.sin(x * freq + phase) * amp +
            Math.sin(x * freq * 2.7 + phase * 1.6) * amp * 0.35 +
            deviationRochers(x, baseY);
          pts.push({ x, rest, y: rest, creux: 0 });
        }

        lignes.push({ pts, delai: i * 0.05, alpha: 0.55 + Math.random() * 0.2 });
      }
    };

    const resizePreserve = () => {
      const previousWidth = width;
      const previousHeight = height;
      if (!resizeCanvas() || previousWidth <= 0 || previousHeight <= 0) return;

      const scaleX = width / previousWidth;
      const scaleY = height / previousHeight;
      const scaleSize = Math.min(scaleX, scaleY);

      for (const rock of rochers) {
        rock.x *= scaleX;
        rock.y *= scaleY;
        rock.r *= scaleSize;
      }

      for (const line of lignes) {
        for (const point of line.pts) {
          point.x *= scaleX;
          point.rest *= scaleY;
          point.y *= scaleY;
          point.creux *= scaleY;
        }
      }

      souris.actif = false;
      souris.x = -9999;
      souris.y = -9999;
      souris.sx = -9999;
      souris.sy = -9999;
    };

    const dessiner = (ts: number) => {
      if (t0 === null) t0 = ts;
      const t = (ts - t0) / 1000;

      souris.sx += (souris.x - souris.sx) * 0.12;
      souris.sy += (souris.y - souris.sy) * 0.12;

      ctx.clearRect(0, 0, width, height);

      for (const line of lignes) {
        const prog = reduced ? 1 : Math.min(1, Math.max(0, (t - line.delai) / DUREE_TRACE));
        if (prog === 0) continue;

        const ease = 1 - Math.pow(1 - prog, 3);
        const xMax = ease * (width + PAS_X * 2);
        let commence = false;

        ctx.beginPath();
        for (const point of line.pts) {
          if (point.x > xMax) break;

          let cible = 0;
          if (!reduced && souris.actif) {
            const dx = point.x - souris.sx;
            const dy = point.rest - souris.sy;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < RAYON_RATEAU * RAYON_RATEAU) {
              const force = Math.exp(-dist2 / (2 * (RAYON_RATEAU * 0.5) ** 2));
              cible = Math.sign(dy || 1) * force * FORCE_RATEAU;
            }
          }

          point.creux += (cible - point.creux) * 0.07;
          point.y = point.rest + point.creux;

          if (!commence) {
            ctx.moveTo(point.x, point.y);
            commence = true;
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }
        ctx.strokeStyle = `rgba(${palette.sillon}, ${line.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        commence = false;
        for (const point of line.pts) {
          if (point.x > xMax) break;
          if (!commence) {
            ctx.moveTo(point.x, point.y + 2.5);
            commence = true;
          } else {
            ctx.lineTo(point.x, point.y + 2.5);
          }
        }
        ctx.strokeStyle = `rgba(${palette.relief}, ${line.alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const progCercles = reduced ? 1 : Math.min(1, Math.max(0, (t - 1.2) / 2.2));
      for (const rock of rochers) {
        for (let i = 1; i <= 3; i += 1) {
          const fin = Math.PI * 2 * Math.min(1, progCercles * 1.4 - i * 0.12);
          if (fin <= 0) continue;
          ctx.beginPath();
          ctx.ellipse(rock.x, rock.y, rock.r + i * 14, (rock.r + i * 14) * 0.82, rock.rot, -Math.PI / 2, -Math.PI / 2 + fin);
          ctx.strokeStyle = `rgba(${palette.cercle}, ${0.5 - i * 0.11})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }

      const progRoche = reduced ? 1 : Math.min(1, t / 1.2);
      for (const rock of rochers) {
        ctx.save();
        ctx.translate(rock.x, rock.y);
        ctx.rotate(rock.rot);
        ctx.globalAlpha = progRoche;

        ctx.beginPath();
        ctx.ellipse(4, rock.r * 0.5, rock.r * 1.05, rock.r * 0.38, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.ombre}, .18)`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-rock.r, rock.r * 0.1);
        ctx.bezierCurveTo(-rock.r * 1.05, -rock.r * 0.55, -rock.r * 0.35, -rock.r * 0.95, rock.r * 0.15, -rock.r * 0.8);
        ctx.bezierCurveTo(rock.r * 0.75, -rock.r * 0.68, rock.r * 1.02, -rock.r * 0.1, rock.r * 0.88, rock.r * 0.3);
        ctx.bezierCurveTo(rock.r * 0.7, rock.r * 0.68, -rock.r * 0.3, rock.r * 0.72, -rock.r * 0.75, rock.r * 0.5);
        ctx.bezierCurveTo(-rock.r * 1.02, rock.r * 0.35, -rock.r, rock.r * 0.1, -rock.r, rock.r * 0.1);
        const grad = ctx.createLinearGradient(-rock.r, -rock.r, rock.r * 0.6, rock.r);
        grad.addColorStop(0, palette.pierreStart);
        grad.addColorStop(0.55, palette.pierreMid);
        grad.addColorStop(1, palette.pierreEnd);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(-rock.r * 0.38, -rock.r * 0.52, rock.r * 0.3, rock.r * 0.14, -0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.mousse}, .55)`;
        ctx.fill();

        ctx.restore();
      }
      ctx.globalAlpha = 1;

      raf = window.requestAnimationFrame(dessiner);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      souris.actif = inside;
      souris.x = inside ? event.clientX - rect.left : -9999;
      souris.y = inside ? event.clientY - rect.top : -9999;
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resizePreserve, 180);
    };

    init();
    raf = window.requestAnimationFrame(dessiner);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="karesansui-hero" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="texte-halo" />
    </div>
  );
}
