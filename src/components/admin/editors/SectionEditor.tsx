"use client";

import { useState } from "react";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { updateSection, type PageSection } from "@/lib/api-admin";

interface SectionEditorProps {
  token: string;
  pageSlug: string;
  section: PageSection;
  onUpdate: (section: PageSection) => void;
}

export function SectionEditor({ token, pageSlug, section, onUpdate }: SectionEditorProps) {
  const [content, setContent] = useState<Record<string, unknown>>(section.content);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function sanitizeContent(raw: Record<string, unknown>): Record<string, unknown> {
    const next = { ...raw };
    if ("slides" in next && Array.isArray(next.slides)) {
      next.slides = (next.slides as Array<Record<string, unknown>>).filter((slide) => {
        const image = slide?.image;
        return typeof image === "string" && image.trim().length > 0;
      });
    }
    if ("images" in next && Array.isArray(next.images)) {
      next.images = (next.images as unknown[]).filter((image) => typeof image === "string" && image.trim().length > 0);
    }
    return next;
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await updateSection(token, pageSlug, section.key, { content: sanitizeContent(content) });
      onUpdate(updated);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  function updateContent(key: string, value: unknown) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  const imagesFromContent = Array.isArray(content.images) ? (content.images as string[]) : [];
  const imageList =
    imagesFromContent.length > 0
      ? imagesFromContent
      : section.key === "approche" && typeof content.image === "string"
        ? [content.image]
        : [];
  const shouldShowImages = Array.isArray(content.images) || section.key === "approche";

  return (
    <section className="bo-card space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{section.key}</h3>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
          disabled={saving}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">Sauvegarde reussie.</p> : null}

      {"image" in content || section.key === "presentation" ? (
        <MediaPicker
          token={token}
          value={(content.image as string | null) ?? null}
          onChange={(path) => updateContent("image", path)}
          label="Image"
        />
      ) : null}

      {shouldShowImages ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label className="block text-sm font-medium text-stone-600">Images</label>
            <button
              type="button"
              onClick={() => {
                const next = Array.isArray(content.images) ? [...content.images] : [...imageList];
                next.push("");
                updateContent("images", next);
              }}
              className="rounded-md border border-stone-200 px-3 py-1 text-sm text-stone-700 hover:border-amber-500 hover:text-amber-600"
            >
              Ajouter une image
            </button>
          </div>
          {imageList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {imageList.map((path, index) => (
                <div key={`${section.key}-image-${index}`} className="rounded-lg border border-stone-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-stone-600">Image {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => {
                        const next = imageList.filter((_, i) => i !== index);
                        updateContent("images", next);
                      }}
                      className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      Supprimer
                    </button>
                  </div>
                  <MediaPicker
                    token={token}
                    value={path ?? null}
                    onChange={(newPath) => {
                      const next = [...imageList];
                      next[index] = newPath ?? "";
                      updateContent("images", next.filter((entry) => entry));
                    }}
                    label={`Image ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">Aucune image pour le moment.</p>
          )}
        </div>
      ) : null}

      {"slides" in content && Array.isArray(content.slides) ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <label className="block text-sm font-medium text-stone-600">Slides</label>
            <button
              type="button"
              onClick={() => {
                const next = [...(content.slides as Array<Record<string, unknown>>), { image: null }];
                updateContent("slides", next);
              }}
              className="rounded-md border border-stone-200 px-3 py-1 text-sm text-stone-700 hover:border-amber-500 hover:text-amber-600"
            >
              Ajouter une image
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(content.slides as Array<Record<string, unknown>>).map((slide, index) => (
              <div key={`${section.key}-slide-${index}`} className="rounded-lg border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-stone-600">Slide {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (content.slides as Array<Record<string, unknown>>).filter((_, i) => i !== index);
                      updateContent("slides", next);
                    }}
                    className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    Supprimer
                  </button>
                </div>
                <MediaPicker
                  token={token}
                  value={(slide.image as string | null) ?? null}
                  onChange={(path) => {
                    const next = [...(content.slides as Array<Record<string, unknown>>)];
                    next[index] = { ...next[index], image: path };
                    updateContent("slides", next);
                  }}
                  label={`Image slide ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
