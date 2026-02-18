"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SectionEditor } from "@/components/admin/editors/SectionEditor";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  FormField,
  Input,
  Select,
  Spinner,
  Textarea,
} from "@/components/admin/ui";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import {
  createSection,
  deleteSection,
  fetchPage,
  updatePage,
  type PageDetail,
  type PageSection,
} from "@/lib/api-admin";

interface NewSectionState {
  key: string;
  type: "text" | "image" | "quote";
  title: string;
}

export default function AdminPageEditor() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [page, setPage] = useState<PageDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingPage, setSavingPage] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<PageSection | null>(null);
  const [deletingSection, setDeletingSection] = useState(false);
  const [newSection, setNewSection] = useState<NewSectionState>({
    key: "",
    type: "text",
    title: "",
  });
  const [creatingSection, setCreatingSection] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToken(getTokenFromStorage());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.replace("/admin/login");
    }
  }, [mounted, router, token]);

  useEffect(() => {
    if (!token || !params.slug) return;

    fetchPage(token, params.slug)
      .then((data) => {
        setPage(data);
        setError(null);
      })
      .catch((err: Error) => {
        if (err.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }
        setError("Impossible de charger la page.");
      });
  }, [params.slug, router, token]);

  const sortedSections = useMemo(() => {
    if (!page) return [];
    return [...page.sections].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [page]);

  function handleSectionUpdate(updated: PageSection) {
    setPage((prev) => {
      if (!prev) return prev;
      const nextSections = prev.sections.map((section) => (section.key === updated.key ? updated : section));
      return { ...prev, sections: nextSections };
    });
  }

  async function handlePageSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !page) return;

    setSavingPage(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    try {
      await updatePage(token, page.slug, {
        title: String(formData.get("title") ?? "").trim(),
        metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
        metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
        showInNav: formData.get("showInNav") === "on",
        navOrder: Number(formData.get("navOrder") ?? 0),
        navTitle: String(formData.get("navTitle") ?? "").trim() || null,
      });

      setPage((prev) =>
        prev
          ? {
              ...prev,
              title: String(formData.get("title") ?? "").trim(),
              metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
              metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
              showInNav: formData.get("showInNav") === "on",
              navOrder: Number(formData.get("navOrder") ?? 0),
              navTitle: String(formData.get("navTitle") ?? "").trim() || null,
            }
          : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de sauvegarder la page.");
    } finally {
      setSavingPage(false);
    }
  }

  async function handleCreateSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !page) return;

    setCreatingSection(true);
    setError(null);
    try {
      const created = await createSection(token, page.slug, {
        key: newSection.key,
        type: newSection.type,
        title: newSection.title || undefined,
      });
      setPage((prev) => (prev ? { ...prev, sections: [...prev.sections, created] } : prev));
      setNewSection({ key: "", type: "text", title: "" });
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de creer la section.");
    } finally {
      setCreatingSection(false);
    }
  }

  async function handleDeleteSection() {
    if (!sectionToDelete) return;
    if (!token || !page) return;

    setDeletingSection(true);
    setError(null);
    try {
      await deleteSection(token, page.slug, sectionToDelete.key);
      setPage((prev) =>
        prev ? { ...prev, sections: prev.sections.filter((item) => item.key !== sectionToDelete.key) } : prev,
      );
      setSectionToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer la section.");
    } finally {
      setDeletingSection(false);
    }
  }

  if (!mounted || !token || !page) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <Card>
        <form onSubmit={handlePageSave} className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Page</p>
        <h2 className="text-2xl font-semibold">{page.title}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Titre" required>
            <Input name="title" defaultValue={page.title} required />
          </FormField>
          <FormField label="Meta title">
            <Input name="metaTitle" defaultValue={page.metaTitle ?? ""} />
          </FormField>
        </div>

          <FormField label="Meta description">
            <Textarea name="metaDescription" defaultValue={page.metaDescription ?? ""} rows={3} />
          </FormField>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Navigation">
            <Checkbox name="showInNav" defaultChecked={page.showInNav} label="Afficher dans le menu" />
          </FormField>
          <FormField label="Ordre dans le menu">
            <Input name="navOrder" type="number" defaultValue={page.navOrder} />
          </FormField>
          <FormField label="Titre dans le menu">
            <Input name="navTitle" defaultValue={page.navTitle ?? ""} />
          </FormField>
        </div>

          <Button type="submit" loading={savingPage}>
            Enregistrer la page
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Sections</h3>
          <Button type="button" onClick={() => setShowCreateForm((prev) => !prev)}>
            {showCreateForm ? "Fermer" : "Ajouter une section"}
          </Button>
        </div>

        {showCreateForm ? (
          <form
            onSubmit={handleCreateSection}
            className="mt-4 grid gap-3 rounded-lg border border-stone-200 bg-white p-4 md:grid-cols-4"
          >
            <Input
              placeholder="Cle unique (kebab-case)"
              value={newSection.key}
              onChange={(event) => setNewSection((prev) => ({ ...prev, key: event.target.value }))}
              required
            />
            <Select
              value={newSection.type}
              options={[
                { value: "text", label: "text" },
                { value: "image", label: "image" },
                { value: "quote", label: "quote" },
              ]}
              onChange={(event) => setNewSection((prev) => ({ ...prev, type: event.target.value as NewSectionState["type"] }))}
            />
            <Input
              placeholder="Titre (optionnel)"
              value={newSection.title}
              onChange={(event) => setNewSection((prev) => ({ ...prev, title: event.target.value }))}
            />
            <Button type="submit" loading={creatingSection}>
              Creer
            </Button>
          </form>
        ) : null}
      </Card>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {sortedSections.map((section) => (
        <SectionEditor
          key={`${section.key}-${section.sortOrder}`}
          token={token}
          pageSlug={page.slug}
          section={section}
          onUpdate={handleSectionUpdate}
          onDelete={() => setSectionToDelete(section)}
        />
      ))}

      <ConfirmDialog
        isOpen={Boolean(sectionToDelete)}
        onClose={() => setSectionToDelete(null)}
        onConfirm={handleDeleteSection}
        title="Supprimer la section ?"
        message={`Etes-vous sur de vouloir supprimer "${sectionToDelete?.title ?? sectionToDelete?.key ?? ""}" ?`}
        confirmLabel="Supprimer"
        loading={deletingSection}
        variant="danger"
      />
    </section>
  );
}
