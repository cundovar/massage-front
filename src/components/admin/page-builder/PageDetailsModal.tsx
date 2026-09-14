"use client";

import { useState } from "react";
import { Alert, Button, FormField, Input, Modal } from "@/components/admin/ui";
import { PageUpdateError } from "@/lib/api-admin";
import { getPublicPagePath } from "@/lib/page-paths";

interface PageDetailsModalProps {
  pageTitle: string;
  pageSlug: string;
  slugEditable: boolean;
  onClose: () => void;
  onSave: (details: { title: string; slug?: string }) => Promise<void>;
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PageDetailsModal({ pageTitle, pageSlug, slugEditable, onClose, onSave }: PageDetailsModalProps) {
  const [title, setTitle] = useState(pageTitle);
  const [slug, setSlug] = useState(pageSlug);
  const [errors, setErrors] = useState<Partial<Record<"title" | "slug", string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<"title" | "slug", string>> = {};

    if (!title.trim()) {
      nextErrors.title = "Le titre est obligatoire.";
    }
    if (slugEditable && !slug) {
      nextErrors.slug = "L’URL est obligatoire.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});
    try {
      await onSave({
        title: title.trim(),
        ...(slugEditable ? { slug } : {}),
      });
      onClose();
    } catch (error) {
      if (error instanceof PageUpdateError && error.field) {
        setErrors({ [error.field]: error.message });
      } else {
        setErrors({ title: error instanceof Error ? error.message : "Impossible d’enregistrer la page." });
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal isOpen onClose={onClose} title="Informations de la page">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField label="Titre de la page" htmlFor="page-title" required error={errors.title}>
          <Input
            id="page-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            error={Boolean(errors.title)}
            autoFocus
          />
        </FormField>

        <FormField
          label="URL publique"
          htmlFor="page-slug"
          error={errors.slug}
          hint={slugEditable ? `Nouvelle URL : ${getPublicPagePath(slug || pageSlug)}` : "L’URL de cette page système est protégée."}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500">/</span>
            <Input
              id="page-slug"
              value={slug}
              onChange={(event) => setSlug(normalizeSlug(event.target.value))}
              error={Boolean(errors.slug)}
              disabled={!slugEditable}
            />
          </div>
        </FormField>

        {slugEditable && slug !== pageSlug ? (
          <Alert variant="info">L’ancienne URL redirigera automatiquement vers cette nouvelle adresse.</Alert>
        ) : null}

        <div className="flex justify-end gap-3 border-t border-stone-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
            Annuler
          </Button>
          <Button type="submit" loading={isSaving}>
            Enregistrer les informations
          </Button>
        </div>
      </form>
    </Modal>
  );
}
