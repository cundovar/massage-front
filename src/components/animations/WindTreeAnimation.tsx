"use client";

import { useEffect, useRef } from "react";

type WindTreeAnimationProps = {
  compact?: boolean;
  className?: string;
};

const LEAF_COLORS = ["#a8c1a0", "#8fae8b", "#7a9c76"] as const;
const DEPARTURES = [
  { x: 62, y: 26 },
  { x: 68, y: 34 },
  { x: 58, y: 18 },
  { x: 40, y: 22 },
  { x: 66, y: 42 },
] as const;

function leafSvg(color: string) {
  return `
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 2 C 15 5, 16 12, 10 18 C 4 12, 5 5, 10 2 Z" fill="${color}"/>
      <path d="M10 4 L10 16" stroke="rgba(255,255,255,.4)" stroke-width="1"/>
    </svg>
  `;
}

/**
 * Animation "arbre au vent" adaptee au menu mobile.
 * Le balancement est en CSS, les feuilles rares sont pilotees en rAF pour garder
 * un mouvement organique sans dependance externe.
 */
export function WindTreeAnimation({ compact = false, className = "" }: WindTreeAnimationProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const maxLeaves = compact ? 2 : 4;
    const firstDelay = compact ? 2200 : 1400;
    let flying = 0;
    const timeoutIds = new Set<number>();
    const rafIds = new Set<number>();

    const scheduleTimeout = (callback: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timeoutIds.delete(id);
        callback();
      }, delay);
      timeoutIds.add(id);
      return id;
    };

    const scheduleFrame = (callback: FrameRequestCallback) => {
      const id = requestAnimationFrame((time) => {
        rafIds.delete(id);
        callback(time);
      });
      rafIds.add(id);
      return id;
    };

    const flyLeaf = () => {
      if (!scene.isConnected || flying >= maxLeaves) return;
      flying += 1;

      const el = document.createElement("div");
      el.className = "wind-tree-leaf";
      el.innerHTML = leafSvg(LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]);
      scene.appendChild(el);

      const rect = scene.getBoundingClientRect();
      const departure = DEPARTURES[Math.floor(Math.random() * DEPARTURES.length)];
      const state = {
        x: (rect.width * departure.x) / 100,
        y: (rect.height * departure.y) / 100,
        vx: (compact ? 8 : 14) + Math.random() * (compact ? 10 : 18),
        vy: (compact ? 4 : 6) + Math.random() * 8,
        swayFreq: 1.1 + Math.random() * 0.9,
        swayAmp: (compact ? 4 : 9) + Math.random() * (compact ? 5 : 8),
        gustFreq: 0.25 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * 360,
        vRot: 40 + Math.random() * 60,
        life: 0,
        duration: (compact ? 5 : 7) + Math.random() * 4,
      };

      let previous: number | null = null;
      const animate = (timestamp: number) => {
        if (!scene.isConnected) {
          el.remove();
          flying -= 1;
          return;
        }

        if (previous === null) previous = timestamp;
        const dt = Math.min((timestamp - previous) / 1000, 0.05);
        previous = timestamp;
        state.life += dt;
        const t = state.life;
        const gust = 1 + Math.sin(t * state.gustFreq * Math.PI * 2 + state.phase) * 0.45;

        state.x += state.vx * gust * dt;
        state.y += (state.vy + Math.cos(t * state.swayFreq * Math.PI * 2 + state.phase) * state.swayAmp) * dt;
        state.rot += state.vRot * gust * dt;

        const alpha = Math.min(1, t / 0.8) * Math.min(1, Math.max(0, (state.duration - t) / 1.4));
        el.style.opacity = alpha.toString();
        el.style.transform = `translate(${state.x.toFixed(1)}px, ${state.y.toFixed(1)}px) rotate(${state.rot.toFixed(1)}deg)`;

        if (t < state.duration && state.x < rect.width + 60 && state.y < rect.height + 60) {
          scheduleFrame(animate);
        } else {
          el.remove();
          flying -= 1;
        }
      };

      scheduleFrame(animate);
    };

    const scheduleLeaf = () => {
      scheduleTimeout(
        () => {
          flyLeaf();
          scheduleLeaf();
        },
        (compact ? 3200 : 2500) + Math.random() * (compact ? 4200 : 3500),
      );
    };

    scheduleTimeout(flyLeaf, firstDelay);
    scheduleLeaf();

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
      rafIds.forEach((id) => cancelAnimationFrame(id));
      scene.querySelectorAll(".wind-tree-leaf").forEach((leaf) => leaf.remove());
    };
  }, [compact]);

  return (
    <div
      ref={sceneRef}
      className={`wind-tree${compact ? " wind-tree--compact" : ""} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 500 500">
        <ellipse className="wind-tree-ground" cx="250" cy="478" rx="120" ry="14" />

        <g className="wind-tree-arbre">
          <path
            className="wind-tree-trunk"
            d="M 238 472 C 240 420, 236 360, 242 305 C 245 270, 248 240, 250 215 C 252 240, 256 270, 259 305 C 264 360, 261 420, 263 472 Z"
          />
          <path
            className="wind-tree-branch"
            d="M 245 300 C 228 278, 208 262, 190 252 C 210 258, 232 272, 247 288 Z"
          />
          <path
            className="wind-tree-branch"
            d="M 255 265 C 272 246, 292 234, 310 227 C 292 232, 270 244, 253 258 Z"
          />

          <g className="wind-tree-crown">
            <ellipse className="wind-tree-mass wind-tree-m1" cx="185" cy="195" rx="88" ry="72" />
            <ellipse className="wind-tree-mass wind-tree-m2" cx="315" cy="185" rx="92" ry="76" />
            <ellipse className="wind-tree-mass wind-tree-m3" cx="250" cy="120" rx="95" ry="78" />
            <ellipse className="wind-tree-mass wind-tree-m4" cx="250" cy="185" rx="105" ry="80" />
          </g>
        </g>
      </svg>
    </div>
  );
}
