"use client";

import { useEffect, useState } from "react";
import { PreviewCanvas } from "@/components/admin/page-builder/PreviewCanvas";
import type { PageSection } from "@/lib/api-admin";

interface PreviewState {
  sections: PageSection[];
  activeSection: string | null;
}

interface PreviewUpdateMessage extends PreviewState {
  type: "page-builder-preview:update";
}

function isPreviewUpdateMessage(value: unknown): value is PreviewUpdateMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as { type?: unknown; sections?: unknown; activeSection?: unknown };
  return (
    message.type === "page-builder-preview:update" &&
    Array.isArray(message.sections) &&
    (typeof message.activeSection === "string" || message.activeSection === null)
  );
}

export default function AdminPreviewPage() {
  const [preview, setPreview] = useState<PreviewState | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent<unknown>) {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (isPreviewUpdateMessage(event.data)) {
        setPreview({ sections: event.data.sections, activeSection: event.data.activeSection });
      }
    }

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "page-builder-preview:ready" }, window.location.origin);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const activeSection = preview?.activeSection ?? null;

  // Amène le bloc sélectionné dans la liste à l’écran s’il n’y est pas déjà.
  useEffect(() => {
    if (!activeSection) return;
    const element = document.querySelector<HTMLElement>(`[data-preview-section="${CSS.escape(activeSection)}"]`);
    if (!element) return;
    const { top, bottom } = element.getBoundingClientRect();
    if (top < 0 || bottom > window.innerHeight) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

  function selectSection(key: string) {
    window.parent.postMessage({ type: "page-builder-preview:select", key }, window.location.origin);
  }

  if (!preview) {
    return <div className="min-h-screen bg-white" aria-label="Chargement de l’aperçu" />;
  }

  return (
    <main className="min-h-screen bg-white">
      <PreviewCanvas sections={preview.sections} activeSection={preview.activeSection} onSelectSection={selectSection} />
    </main>
  );
}
