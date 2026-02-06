"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaLibrary } from "./MediaLibrary";
import type { MediaItem } from "@/lib/api-admin";

interface MediaPickerProps {
  token: string;
  value: string | null;
  onChange: (path: string | null) => void;
  label?: string;
}

export function MediaPicker({ token, value, onChange, label }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

  function handleSelect(media: MediaItem) {
    onChange(media.path);
    setOpen(false);
  }

  function handleRemove() {
    onChange(null);
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-stone-600">{label}</label>}

      {value ? (
        <div className="relative inline-block">
          <div className="relative h-28 w-40 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
            <Image src={`${apiUrl}${value}`} alt="Image selectionnee" fill className="object-cover" />
          </div>
          <div className="absolute -right-2 -top-2 flex gap-1">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full bg-amber-500 p-1.5 text-white shadow-md hover:bg-amber-600"
              title="Changer"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-full bg-rose-500 p-1.5 text-white shadow-md hover:bg-rose-600"
              title="Supprimer"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-28 w-40 items-center justify-center rounded-lg border-2 border-dashed border-stone-300 transition-colors hover:border-amber-500 hover:bg-amber-50"
        >
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="mt-1 block text-xs text-stone-500">Choisir</span>
          </div>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-stone-800">Mediatheque</h3>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-stone-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[calc(80vh-80px)] overflow-y-auto p-6">
              <MediaLibrary token={token} onSelect={handleSelect} selectable />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
