"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SectionEditor } from "@/components/admin/editors/SectionEditor";
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

  async function handleDeleteSection(section: PageSection) {
    if (!token || !page) return;

    const ok = window.confirm(`Supprimer la section "${section.title ?? section.key}" ?`);
    if (!ok) return;

    setError(null);
    try {
      await deleteSection(token, page.slug, section.key);
      setPage((prev) =>
        prev ? { ...prev, sections: prev.sections.filter((item) => item.key !== section.key) } : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer la section.");
    }
  }

  if (!mounted || !token || !page) {
    return <section className="bo-card p-6">Chargement...</section>;
  }

  return (
    <section className="space-y-6">
      <form onSubmit={handlePageSave} className="bo-card space-y-4 p-6">
        <p className="bo-label">Page</p>
        <h2 className="text-2xl font-semibold">{page.title}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Titre</label>
            <input name="title" defaultValue={page.title} className="bo-input" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Meta title</label>
            <input name="metaTitle" defaultValue={page.metaTitle ?? ""} className="bo-input" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Meta description</label>
          <textarea name="metaDescription" defaultValue={page.metaDescription ?? ""} className="bo-input" rows={3} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex items-center gap-2 text-sm">
            <input name="showInNav" type="checkbox" defaultChecked={page.showInNav} />
            Afficher dans le menu
          </label>
          <div>
            <label className="mb-1 block text-sm font-medium">Ordre dans le menu</label>
            <input name="navOrder" type="number" defaultValue={page.navOrder} className="bo-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Titre dans le menu</label>
            <input name="navTitle" defaultValue={page.navTitle ?? ""} className="bo-input" />
          </div>
        </div>

        <button type="submit" className="bo-button-primary" disabled={savingPage}>
          {savingPage ? "Enregistrement..." : "Enregistrer la page"}
        </button>
      </form>

      <div className="bo-card p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Sections</h3>
          <button type="button" className="bo-button-primary" onClick={() => setShowCreateForm((prev) => !prev)}>
            Ajouter une section
          </button>
        </div>

        {showCreateForm ? (
          <form onSubmit={handleCreateSection} className="mt-4 grid gap-3 rounded-lg border border-stone-200 p-4 md:grid-cols-4">
            <input
              className="bo-input"
              placeholder="Cle unique (kebab-case)"
              value={newSection.key}
              onChange={(event) => setNewSection((prev) => ({ ...prev, key: event.target.value }))}
              required
            />
            <select
              className="bo-input"
              value={newSection.type}
              onChange={(event) => setNewSection((prev) => ({ ...prev, type: event.target.value as NewSectionState["type"] }))}
            >
              <option value="text">text</option>
              <option value="image">image</option>
              <option value="quote">quote</option>
            </select>
            <input
              className="bo-input"
              placeholder="Titre (optionnel)"
              value={newSection.title}
              onChange={(event) => setNewSection((prev) => ({ ...prev, title: event.target.value }))}
            />
            <button type="submit" className="bo-button-primary" disabled={creatingSection}>
              {creatingSection ? "Creation..." : "Creer"}
            </button>
          </form>
        ) : null}
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {sortedSections.map((section) => (
        <SectionEditor
          key={`${section.key}-${section.sortOrder}`}
          token={token}
          pageSlug={page.slug}
          section={section}
          onUpdate={handleSectionUpdate}
          onDelete={() => void handleDeleteSection(section)}
        />
      ))}
    </section>
  );
}
