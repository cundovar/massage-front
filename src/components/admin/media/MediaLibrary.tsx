"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { deleteMedia, fetchMedia, uploadMedia, type MediaItem } from "@/lib/api-admin";

interface MediaLibraryProps {
  token: string;
  onSelect?: (media: MediaItem) => void;
  selectable?: boolean;
}

export function MediaLibrary({ token, onSelect, selectable = false }: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMedia = useCallback(async () => {
    try {
      const items = await fetchMedia(token);
      setMedia(items);
    } catch {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const newMedia = await uploadMedia(token, file);
      setMedia((prev) => [newMedia, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur upload");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette image ?")) return;

    try {
      await deleteMedia(token, id);
      setMedia((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Erreur lors de la suppression");
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

  if (loading) {
    return <div className="h-64 animate-pulse rounded-lg bg-stone-100" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {uploading ? "Envoi..." : "Ajouter une image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <span className="text-xs text-stone-500">JPG, PNG, WebP — Max 5 Mo</span>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>
      )}

      {media.length === 0 ? (
        <div className="py-12 text-center text-stone-500">Aucune image. Commencez par en ajouter une.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {media.map((item) => (
            <div
              key={item.id}
              className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectable ? "cursor-pointer hover:border-amber-500 border-transparent" : "border-transparent"
              }`}
              onClick={() => selectable && onSelect?.(item)}
            >
              <Image
                src={`${apiUrl}${item.path}`}
                alt={item.alt ?? item.originalName}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40" />
              {!selectable && (
                <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="rounded-md bg-rose-500 p-1.5 text-white hover:bg-rose-600"
                    title="Supprimer"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="truncate text-xs text-white">{item.originalName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
