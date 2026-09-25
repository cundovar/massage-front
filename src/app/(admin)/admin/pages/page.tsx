"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  type Announcements,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Clock, ExternalLink, FileText, GripVertical, House, Pencil, Plus, Trash2 } from "lucide-react";
import { Alert, Button, Card, ConfirmDialog, EmptyState, IconButton, Spinner } from "@/components/admin/ui";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { deletePage, fetchPages, updatePage, type PageListItem } from "@/lib/api-admin";

type SaveState = "idle" | "saving" | "saved";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date);
}

function getPagePath(page: PageListItem): string {
  return page.slug === "home" ? "/" : `/${page.slug}`;
}

export default function AdminPagesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageToDelete, setPageToDelete] = useState<PageListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Souris / stylet (apres 6 px de deplacement), doigt (appui long) et clavier (Espace + fleches).
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
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
    fetchPages(token)
      .then((items) => {
        setPages([...items].sort((a, b) => a.navOrder - b.navOrder));
        setError(null);
      })
      .catch((err: Error) => {
        if (err.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }
        setError("Impossible de charger la liste des pages.");
      })
      .finally(() => setLoading(false));
  }, [router, token]);

  useEffect(() => () => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
  }, []);

  const handleApiError = useCallback(
    (err: unknown, fallback: string) => {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        clearTokenFromStorage();
        router.replace("/admin/login");
        return;
      }
      setError(fallback);
    },
    [router],
  );

  const runSave = useCallback(
    async (task: () => Promise<unknown>, fallbackError: string) => {
      if (!token) return;
      if (savedTimer.current) clearTimeout(savedTimer.current);
      setSaveState("saving");
      setError(null);
      try {
        await task();
        setSaveState("saved");
        savedTimer.current = setTimeout(() => setSaveState("idle"), 2500);
      } catch (err) {
        setSaveState("idle");
        handleApiError(err, fallbackError);
      }
    },
    [handleApiError, token],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!token || !over || active.id === over.id) return;

      const oldIndex = pages.findIndex((page) => page.slug === active.id);
      const newIndex = pages.findIndex((page) => page.slug === over.id);
      if (oldIndex < 0 || newIndex < 0) return;

      const reordered = arrayMove(pages, oldIndex, newIndex).map((page, index) => ({ ...page, navOrder: index }));
      const changed = reordered.filter((page) => pages.find((item) => item.slug === page.slug)?.navOrder !== page.navOrder);
      setPages(reordered);

      void runSave(
        () => Promise.all(changed.map((page) => updatePage(token, page.slug, { navOrder: page.navOrder }))),
        "Impossible d'enregistrer le nouvel ordre des pages.",
      );
    },
    [pages, runSave, token],
  );

  const handleToggleNav = useCallback(
    (page: PageListItem) => {
      if (!token) return;
      const showInNav = !page.showInNav;
      setPages((prev) => prev.map((item) => (item.slug === page.slug ? { ...item, showInNav } : item)));

      void runSave(async () => {
        try {
          await updatePage(token, page.slug, { showInNav });
        } catch (err) {
          setPages((prev) => prev.map((item) => (item.slug === page.slug ? { ...item, showInNav: !showInNav } : item)));
          throw err;
        }
      }, "Impossible de modifier l'affichage dans le menu.");
    },
    [runSave, token],
  );

  const handleDeletePage = useCallback(async () => {
    if (!token || !pageToDelete) return;
    setDeleting(true);
    setError(null);
    try {
      await deletePage(token, pageToDelete.slug);
      setPages((prev) => prev.filter((page) => page.slug !== pageToDelete.slug));
      setPageToDelete(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Impossible de supprimer la page.");
      }
    } finally {
      setDeleting(false);
    }
  }, [pageToDelete, token]);

  const announcements = useMemo<Announcements>(() => {
    const titleOf = (id: UniqueIdentifier) => pages.find((page) => page.slug === id)?.title ?? String(id);
    const positionOf = (id: UniqueIdentifier) => pages.findIndex((page) => page.slug === id) + 1;

    return {
      onDragStart: ({ active }) => `Page « ${titleOf(active.id)} » saisie, position ${positionOf(active.id)} sur ${pages.length}.`,
      onDragOver: ({ active, over }) =>
        over ? `« ${titleOf(active.id)} » placée en position ${positionOf(over.id)} sur ${pages.length}.` : undefined,
      onDragEnd: ({ active, over }) =>
        over ? `« ${titleOf(active.id)} » déposée en position ${positionOf(over.id)}.` : `« ${titleOf(active.id)} » déposée.`,
      onDragCancel: ({ active }) => `Déplacement de « ${titleOf(active.id)} » annulé.`,
    };
  }, [pages]);

  const content = useMemo(() => {
    if (loading || !mounted || !token) {
      return (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      );
    }

    if (pages.length === 0) {
      return (
        <EmptyState
          title="Aucune page pour le moment"
          description="Créez une première page pour commencer."
          action={(
            <Link href="/admin/pages/new">
              <Button icon={<Plus className="h-4 w-4" />}>Nouvelle page</Button>
            </Link>
          )}
        />
      );
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        accessibility={{
          announcements,
          screenReaderInstructions: {
            draggable:
              "Pour déplacer une page, appuyez sur Espace, utilisez les flèches haut et bas, puis Espace pour déposer ou Échap pour annuler.",
          },
        }}
      >
        <SortableContext items={pages.map((page) => page.slug)} strategy={verticalListSortingStrategy}>
          <ol className="space-y-2" aria-label="Pages du site, dans l'ordre du menu">
            {pages.map((page, index) => (
              <SortablePageRow
                key={page.id}
                page={page}
                position={index + 1}
                onToggleNav={() => handleToggleNav(page)}
                onDelete={() => setPageToDelete(page)}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
    );
  }, [announcements, handleDragEnd, handleToggleNav, loading, mounted, pages, sensors, token]);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Pages</p>
          <h2 className="mt-2 text-2xl font-semibold">Gestion des pages</h2>
          <p className="mt-1 text-sm text-stone-500">
            Glissez une page par sa poignée <GripVertical className="inline h-4 w-4 align-text-bottom" aria-hidden="true" /> pour
            changer sa place dans le menu du site.
          </p>
        </div>
        <Link href="/admin/pages/new">
          <Button icon={<Plus className="h-4 w-4" />}>Nouvelle page</Button>
        </Link>
      </div>

      <div className="mt-4 min-h-6" aria-live="polite">
        {saveState === "saving" ? (
          <p className="flex items-center gap-2 text-sm text-stone-500">
            <Spinner size="sm" /> Enregistrement…
          </p>
        ) : saveState === "saved" ? (
          <p className="flex items-center gap-1.5 text-sm text-green-700">
            <Check className="h-4 w-4" aria-hidden="true" /> Modifications enregistrées
          </p>
        ) : null}
      </div>

      {error ? (
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}

      {content}

      <ConfirmDialog
        isOpen={Boolean(pageToDelete)}
        onClose={() => setPageToDelete(null)}
        onConfirm={handleDeletePage}
        title="Supprimer la page ?"
        message={`La page « ${pageToDelete?.title ?? ""} » et tout son contenu seront supprimés définitivement.`}
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
      />
    </Card>
  );
}

interface SortablePageRowProps {
  page: PageListItem;
  position: number;
  onToggleNav: () => void;
  onDelete: () => void;
}

function SortablePageRow({ page, position, onToggleNav, onDelete }: SortablePageRowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: page.slug,
  });
  const path = getPagePath(page);
  const isHome = page.slug === "home";
  const PageIcon = isHome ? House : FileText;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={[
        "relative rounded-xl border bg-white transition-shadow",
        isDragging ? "z-10 border-amber-400 shadow-xl ring-2 ring-amber-200" : "border-stone-200 hover:border-stone-300 hover:shadow-sm",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 p-2 sm:p-3">
        <div className="flex min-w-0 flex-1 basis-60 items-center gap-2 sm:gap-3">
          <button
            ref={setActivatorNodeRef}
            type="button"
            className="flex h-11 w-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:cursor-grabbing"
            aria-label={`Déplacer la page « ${page.title} » (position ${position})`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" aria-hidden="true" />
          </button>

          <span
            className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:flex ${isHome ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"}`}
          >
            <PageIcon className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <Link
              href={`/admin/pages/${page.slug}`}
              className="block truncate text-base font-semibold text-stone-900 hover:text-amber-700 focus:outline-none focus-visible:underline"
            >
              {page.title}
            </Link>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-stone-500">
              <a
                href={path}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-amber-700"
                aria-label={`Voir la page ${page.title} sur le site (nouvel onglet)`}
              >
                {path}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Clock className="h-3 w-3" aria-hidden="true" />
                Modifiée le {formatDate(page.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={page.showInNav}
            aria-label={`Afficher « ${page.title} » dans le menu`}
            onClick={onToggleNav}
            title={page.showInNav ? "Visible dans le menu du site" : "Absente du menu du site"}
            className={[
              "flex shrink-0 items-center gap-2 rounded-full border px-2 py-1 text-xs font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              page.showInNav
                ? "border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
                : "border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={`relative h-4 w-7 rounded-full transition-colors ${page.showInNav ? "bg-green-500" : "bg-stone-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${page.showInNav ? "translate-x-3" : ""}`}
              />
            </span>
            <span>{page.showInNav ? "Dans le menu" : "Hors menu"}</span>
          </button>

          <Link
            href={`/admin/pages/${page.slug}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Modifier
          </Link>

          <IconButton
            icon={<Trash2 className="h-4 w-4" />}
            label={`Supprimer la page « ${page.title} »`}
            title="Supprimer"
            variant="ghost"
            className="shrink-0 hover:bg-rose-50 hover:text-rose-600"
            onClick={onDelete}
          />
        </div>
      </div>
    </li>
  );
}
