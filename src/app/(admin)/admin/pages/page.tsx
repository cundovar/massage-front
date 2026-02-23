"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Alert, Button, Card, ConfirmDialog, EmptyState, Spinner } from "@/components/admin/ui";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { deletePage, fetchPages, updatePage, type PageListItem } from "@/lib/api-admin";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
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
  const [reordering, setReordering] = useState(false);
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 8,
      },
    }),
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

  const savePagesOrder = useCallback(
    async (ordered: PageListItem[]) => {
      if (!token) return;

      setReordering(true);
      setError(null);
      try {
        await Promise.all(
          ordered.map((page, index) =>
            updatePage(token, page.slug, { navOrder: index }),
          ),
        );
      } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }
        setError("Impossible de sauvegarder le nouvel ordre des pages.");
      } finally {
        setReordering(false);
      }
    },
    [router, token],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setPages((prev) => {
        const oldIndex = prev.findIndex((page) => page.slug === active.id);
        const newIndex = prev.findIndex((page) => page.slug === over.id);
        if (oldIndex < 0 || newIndex < 0) return prev;

        const reordered = arrayMove(prev, oldIndex, newIndex).map((page, index) => ({
          ...page,
          navOrder: index,
        }));

        void savePagesOrder(reordered);
        return reordered;
      });
    },
    [savePagesOrder],
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

  const content = useMemo(() => {
    if (loading || !mounted || !token) {
      return (
        <Card>
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        </Card>
      );
    }

    if (error) {
      return <Alert variant="error">{error}</Alert>;
    }

    if (pages.length === 0) {
      return (
        <EmptyState
          title="Aucune page disponible"
          description="Crée une nouvelle page pour commencer."
          action={(
            <Link href="/admin/pages/new">
              <Button>Nouvelle page</Button>
            </Link>
          )}
        />
      );
    }

    return (
      <div className="mt-6 space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={pages.map((page) => page.slug)} strategy={verticalListSortingStrategy}>
            {pages.map((page) => (
              <SortablePageCard
                key={page.id}
                page={page}
                onDelete={() => setPageToDelete(page)}
              />
            ))}
          </SortableContext>
        </DndContext>
        {reordering ? (
          <p className="text-xs text-[var(--bo-muted)]">Sauvegarde du nouvel ordre...</p>
        ) : null}
      </div>
    );
  }, [error, handleDragEnd, loading, mounted, pages, reordering, sensors, token]);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Pages</p>
          <h2 className="mt-2 text-2xl font-semibold">Gestion des pages</h2>
        </div>
        <Link href="/admin/pages/new">
          <Button>Nouvelle page</Button>
        </Link>
      </div>
      {content}
      <ConfirmDialog
        isOpen={Boolean(pageToDelete)}
        onClose={() => setPageToDelete(null)}
        onConfirm={handleDeletePage}
        title="Supprimer la page ?"
        message={`Etes-vous sur de vouloir supprimer "${pageToDelete?.title ?? ""}" ?`}
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
      />
    </Card>
  );
}

interface SortablePageCardProps {
  page: PageListItem;
  onDelete: () => void;
}

function SortablePageCard({ page, onDelete }: SortablePageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: page.slug,
  });

  return (
    <div
      ref={setNodeRef}
      className={[
        isDragging ? "rounded-lg border border-amber-500 shadow-lg" : "",
      ].join(" ")}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <Card padding="sm" className="transition hover:-translate-y-0.5 hover:shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              className="mt-1 cursor-grab touch-none rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 active:cursor-grabbing"
              aria-label="Reordonner la page"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{page.title}</p>
                {page.showInNav ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Menu
                  </span>
                ) : (
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">
                    Masquee
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--bo-muted)]">/{page.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-[var(--bo-muted)]">Modifie le {formatDate(page.updatedAt)}</p>
            <Link href={`/admin/pages/${page.slug}`}>
              <Button variant="secondary" size="sm">Modifier</Button>
            </Link>
            <Button type="button" variant="danger" size="sm" onClick={onDelete}>
              Supprimer
            </Button>
          </div>
        </div>
        {page.metaDescription ? (
          <p className="mt-2 text-sm text-[var(--bo-muted)]">{page.metaDescription}</p>
        ) : null}
      </Card>
    </div>
  );
}
