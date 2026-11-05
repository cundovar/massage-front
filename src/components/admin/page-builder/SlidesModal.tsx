"use client";

import { useState } from "react";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { Button, FormField, Input, Modal } from "@/components/admin/ui";
import type { HeroSlide } from "@/types";

interface SlidesModalProps {
  token: string;
  initialSlides: HeroSlide[];
  onClose: () => void;
  onSave: (slides: HeroSlide[]) => void;
}

export function SlidesModal({ token, initialSlides, onClose, onSave }: SlidesModalProps) {
  const [slides, setSlides] = useState(initialSlides);

  function updateSlide(index: number, patch: Partial<HeroSlide>) {
    setSlides((current) => current.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));
  }

  return (
    <Modal isOpen onClose={onClose} title="Images du diaporama" size="lg">
      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div key={index} className="space-y-3 rounded-lg border border-stone-200 p-4">
            <MediaPicker
              token={token}
              value={slide.image || null}
              onChange={(path) => updateSlide(index, { image: path ?? "" })}
              label={`Image ${index + 1}`}
            />
            <FormField label="Titre">
              <Input value={slide.title} onChange={(event) => updateSlide(index, { title: event.target.value })} />
            </FormField>
            <FormField label="Sous-titre">
              <Input value={slide.subtitle ?? ""} onChange={(event) => updateSlide(index, { subtitle: event.target.value })} />
            </FormField>
            <Button variant="ghost" size="sm" onClick={() => setSlides((current) => current.filter((_, i) => i !== index))}>
              Retirer cette image
            </Button>
          </div>
        ))}
        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setSlides((current) => [...current, { title: "", image: "" }])}>
            Ajouter une image
          </Button>
          <Button onClick={() => onSave(slides.filter((slide) => slide.image))}>Valider</Button>
        </div>
      </div>
    </Modal>
  );
}
