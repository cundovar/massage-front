"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PageSection } from "@/lib/api-admin";

interface LivePreviewProps {
  sections: PageSection[];
  activeSection: string | null;
  onSelectSection: (key: string) => void;
}

const PREVIEW_VIEWPORTS = {
  mobile: { label: "Mobile", width: 390, scale: 1 },
  tablet: { label: "Tablette", width: 768, scale: 0.7 },
  desktop: { label: "Bureau", width: 1440, scale: 0.5 },
} as const;

const PREVIEW_HEIGHT = 1800;

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
  const viewportConfig = PREVIEW_VIEWPORTS[viewport];

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
    <div className="min-h-full">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b bg-stone-100 px-4 py-2">
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

      <div className="min-h-full overflow-auto bg-stone-100 p-4">
        <div
          className="mx-auto overflow-hidden bg-white shadow-sm"
          style={{ width: `${viewportConfig.width * viewportConfig.scale}px`, height: `${PREVIEW_HEIGHT * viewportConfig.scale}px` }}
        >
          <iframe
            ref={iframeRef}
            title={`Aperçu ${viewportConfig.label.toLowerCase()} de la page`}
            src="/admin-preview"
            onLoad={sendPreview}
            className="block border-0 bg-white"
            style={{
              width: `${viewportConfig.width}px`,
              height: `${PREVIEW_HEIGHT}px`,
              transform: `scale(${viewportConfig.scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
    </div>
  );
}
