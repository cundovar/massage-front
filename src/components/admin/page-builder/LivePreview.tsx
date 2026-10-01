"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PageSection } from "@/lib/api-admin";

interface LivePreviewProps {
  sections: PageSection[];
  activeSection: string | null;
  onSelectSection: (key: string) => void;
}

const PREVIEW_VIEWPORTS = {
  mobile: { label: "Mobile", width: 390 },
  tablet: { label: "Tablette", width: 768 },
  desktop: { label: "Bureau", width: 1440 },
} as const;

// Hauteur minimale du viewport simulé (px CSS dans l’iframe).
const MIN_PREVIEW_HEIGHT = 480;

type PreviewViewport = keyof typeof PREVIEW_VIEWPORTS;

type PreviewMessage =
  | { type: "page-builder-preview:ready" }
  | { type: "page-builder-preview:select"; key: string };

function isPreviewMessage(value: unknown): value is PreviewMessage {
  if (!value || typeof value !== "object" || !("type" in value)) return false;
  const message = value as { type?: unknown; key?: unknown };
  return (
    message.type === "page-builder-preview:ready" ||
    (message.type === "page-builder-preview:select" && typeof message.key === "string")
  );
}

export function LivePreview({ sections, activeSection, onSelectSection }: LivePreviewProps) {
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [availableSize, setAvailableSize] = useState({ width: 0, height: 0 });
  const viewportConfig = PREVIEW_VIEWPORTS[viewport];
  // Le viewport simulé garde sa vraie largeur CSS et est réduit pour tenir dans le panneau.
  const scale = availableSize.width > 0 ? Math.min(1, availableSize.width / viewportConfig.width) : 1;
  // L’iframe occupe exactement la hauteur visible du panneau : un seul défilement,
  // à l’intérieur de l’aperçu, et des unités vh cohérentes avec un vrai écran.
  const frameHeight = Math.max(MIN_PREVIEW_HEIGHT, Math.floor(availableSize.height / scale));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function measure() {
      if (!canvas) return;
      const style = window.getComputedStyle(canvas);
      setAvailableSize({
        width: canvas.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
        height: canvas.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
      });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const sendPreview = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "page-builder-preview:update",
        sections,
        activeSection,
      },
      window.location.origin,
    );
  }, [activeSection, sections]);

  useEffect(() => {
    sendPreview();
  }, [sendPreview, viewport]);

  useEffect(() => {
    function handleMessage(event: MessageEvent<unknown>) {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      if (!isPreviewMessage(event.data)) return;

      if (event.data.type === "page-builder-preview:ready") {
        sendPreview();
      }

      if (event.data.type === "page-builder-preview:select") {
        onSelectSection(event.data.key);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSelectSection, sendPreview]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b bg-stone-100 px-4 py-2">
        <p className="text-sm text-stone-500">Aperçu en temps réel — cliquez sur une section pour la modifier</p>
        <div className="inline-flex rounded-lg border border-stone-200 bg-white p-1" role="group" aria-label="Largeur de l’aperçu">
          {(Object.keys(PREVIEW_VIEWPORTS) as PreviewViewport[]).map((mode) => {
            const isActive = mode === viewport;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setViewport(mode)}
                aria-pressed={isActive}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 ${
                  isActive ? "bg-amber-600 text-white" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {PREVIEW_VIEWPORTS[mode].label}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={canvasRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-stone-100 p-4">
        <div
          className="mx-auto overflow-hidden bg-white shadow-sm"
          style={{ width: `${viewportConfig.width * scale}px`, height: `${frameHeight * scale}px` }}
        >
          <iframe
            ref={iframeRef}
            title={`Aperçu ${viewportConfig.label.toLowerCase()} de la page`}
            src="/admin-preview"
            onLoad={sendPreview}
            className="block border-0 bg-white"
            style={{
              width: `${viewportConfig.width}px`,
              height: `${frameHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
    </div>
  );
}
