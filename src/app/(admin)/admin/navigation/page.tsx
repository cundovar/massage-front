"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Alert, Button, Card, Spinner } from "@/components/admin/ui";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { fetchPages, fetchSettings, updatePage, updateSettings, type PageListItem } from "@/lib/api-admin";
import type { ExternalNavLink, SiteSettings } from "@/types/settings";

// Type unifié pour les items de navigation
interface NavItem {
  id: string;
  type: "page" | "external";
  label: string;
  path: string;
  showInNav: boolean;
  order: number;
  openInNewTab?: boolean;
  // Pour les pages
  pageSlug?: string;
}

interface SortableNavItemProps {
  item: NavItem;
  onToggleVisibility: (id: string, showInNav: boolean) => void;
  onDelete?: (id: string) => void;
  isUpdating: boolean;
}

function SortableNavItem({ item, onToggleVisibility, onDelete, isUpdating }: SortableNavItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border bg-white p-4 ${
        isDragging ? "z-50 shadow-lg ring-2 ring-amber-500" : "border-stone-200"
      }`}
    >
      {/* Poignée de drag */}
      <button
        type="button"
        className="cursor-grab touch-none text-stone-400 hover:text-stone-600 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </button>

      {/* Badge type */}
      <span
        className={`rounded px-2 py-0.5 text-xs font-medium ${
          item.type === "page"
            ? "bg-blue-100 text-blue-700"
            : "bg-purple-100 text-purple-700"
        }`}
      >
        {item.type === "page" ? "Page" : "Lien"}
      </span>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-900 truncate">{item.label}</p>
        <p className="text-sm text-stone-500 truncate">
          {item.path}
          {item.openInNewTab && (
            <span className="ml-2 text-xs text-stone-400">↗ nouvel onglet</span>
          )}
        </p>
      </div>

      {/* Toggle visibilité */}
      <button
        type="button"
        role="switch"
        aria-checked={item.showInNav}
        aria-label={item.showInNav ? "Masquer du menu" : "Afficher dans le menu"}
        disabled={isUpdating}
        onClick={() => onToggleVisibility(item.id, !item.showInNav)}
        className={`relative flex h-8 w-14 shrink-0 items-center rounded-full px-1 transition-colors ${
          item.showInNav ? "bg-green-500" : "bg-stone-300"
        } ${isUpdating ? "opacity-50" : ""}`}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-transform ${
            item.showInNav ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {item.showInNav ? (
            <svg className="h-3.5 w-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </span>
      </button>

      {/* Bouton supprimer (seulement pour les liens externes) */}
      {item.type === "external" && onDelete && (
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="rounded p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500"
          aria-label="Supprimer le lien"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface AddLinkFormProps {
  onAdd: (link: Omit<ExternalNavLink, "id" | "order">) => void;
  onCancel: () => void;
}

function AddLinkForm({ onAdd, onCancel }: AddLinkFormProps) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;
    onAdd({ label: label.trim(), url: url.trim(), openInNewTab });
    setLabel("");
    setUrl("");
    setOpenInNewTab(true);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="mb-4 font-medium text-stone-900">Nouveau lien externe</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Label (affiché dans le menu)
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ex: Réserver"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            required
          />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="checkbox"
          id="openInNewTab"
          checked={openInNewTab}
          onChange={(e) => setOpenInNewTab(e.target.checked)}
          className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="openInNewTab" className="text-sm text-stone-600">
          Ouvrir dans un nouvel onglet
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="submit">Ajouter</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

export default function AdminNavigationPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    if (!token) return;
    setLoading(true);

    Promise.all([fetchPages(token), fetchSettings(token)])
      .then(([pages, settingsData]) => {
        setSettings(settingsData);

        // Convertir les pages en NavItems
        const pageItems: NavItem[] = pages.map((page) => ({
          id: `page-${page.slug}`,
          type: "page" as const,
          label: page.title,
          path: page.slug === "home" ? "/" : `/${page.slug}`,
          showInNav: page.showInNav,
          order: page.navOrder,
          pageSlug: page.slug,
        }));

        // Convertir les liens externes en NavItems
        const externalLinks = settingsData.navigation?.externalLinks ?? [];
        const externalItems: NavItem[] = externalLinks.map((link) => ({
          id: `external-${link.id}`,
          type: "external" as const,
          label: link.label,
          path: link.url,
          showInNav: true,
          order: link.order,
          openInNewTab: link.openInNewTab,
        }));

        // Fusionner et trier par ordre
        const allItems = [...pageItems, ...externalItems].sort((a, b) => a.order - b.order);
        setNavItems(allItems);
        setError(null);
      })
      .catch((err: Error) => {
        if (err.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }
        setError("Impossible de charger les données.");
      })
      .finally(() => setLoading(false));
  }, [router, token]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setNavItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const reordered = arrayMove(prev, oldIndex, newIndex);
      // Mettre à jour les ordres
      return reordered.map((item, index) => ({ ...item, order: index }));
    });
    setHasChanges(true);
  }, []);

  const handleToggleVisibility = useCallback(
    async (id: string, showInNav: boolean) => {
      if (!token) return;
      setUpdatingId(id);
      setError(null);

      const item = navItems.find((i) => i.id === id);
      if (!item) return;

      try {
        if (item.type === "page" && item.pageSlug) {
          await updatePage(token, item.pageSlug, { showInNav });
        }
        // Pour les liens externes, on marque juste le changement
        setNavItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, showInNav } : i))
        );
        if (item.type === "external") {
          setHasChanges(true);
        }
      } catch {
        setError("Impossible de modifier la visibilité.");
      } finally {
        setUpdatingId(null);
      }
    },
    [navItems, token]
  );

  const handleAddLink = useCallback((link: Omit<ExternalNavLink, "id" | "order">) => {
    const newId = `external-${Date.now()}`;
    const maxOrder = Math.max(...navItems.map((i) => i.order), -1);

    const newItem: NavItem = {
      id: newId,
      type: "external",
      label: link.label,
      path: link.url,
      showInNav: true,
      order: maxOrder + 1,
      openInNewTab: link.openInNewTab,
    };

    setNavItems((prev) => [...prev, newItem]);
    setShowAddForm(false);
    setHasChanges(true);
  }, [navItems]);

  const handleDeleteLink = useCallback((id: string) => {
    setNavItems((prev) => prev.filter((item) => item.id !== id));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!token || !settings) return;
    setSaving(true);
    setError(null);

    try {
      // Séparer les pages et les liens externes
      const pageItems = navItems.filter((item) => item.type === "page");
      const externalItems = navItems.filter((item) => item.type === "external");

      // Mettre à jour l'ordre des pages
      await Promise.all(
        pageItems.map((item) =>
          item.pageSlug ? updatePage(token, item.pageSlug, { navOrder: item.order }) : Promise.resolve()
        )
      );

      // Mettre à jour les liens externes dans les settings
      const externalLinks: ExternalNavLink[] = externalItems.map((item) => ({
        id: item.id.replace("external-", ""),
        label: item.label,
        url: item.path,
        openInNewTab: item.openInNewTab ?? true,
        order: item.order,
      }));

      await updateSettings(token, {
        navigation: { externalLinks },
      });

      setHasChanges(false);
    } catch {
      setError("Impossible de sauvegarder.");
    } finally {
      setSaving(false);
    }
  }, [navItems, settings, token]);

  if (loading || !mounted || !token) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
            Navigation
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Ordre du menu</h2>
          <p className="mt-1 text-sm text-stone-500">
            Glissez-deposez pour reordonner les elements du menu.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            + Lien externe
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            {saving ? "Enregistrement..." : hasChanges ? "Enregistrer" : "Aucun changement"}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mt-4">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="mt-6">
          <AddLinkForm onAdd={handleAddLink} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {/* Liste des items */}
      <div className="mt-6 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={navItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {navItems.map((item) => (
              <SortableNavItem
                key={item.id}
                item={item}
                onToggleVisibility={handleToggleVisibility}
                onDelete={item.type === "external" ? handleDeleteLink : undefined}
                isUpdating={updatingId === item.id}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Légende */}
      <div className="mt-6 flex flex-wrap gap-4 border-t pt-4 text-sm text-stone-500">
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Page</span>
          <span>Page du site</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">Lien</span>
          <span>Lien externe</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span>Visible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-300">
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <span>Masque</span>
        </div>
      </div>
    </Card>
  );
}
