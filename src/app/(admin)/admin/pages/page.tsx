"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, ConfirmDialog, EmptyState, Spinner } from "@/components/admin/ui";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { deletePage, fetchPages, type PageListItem } from "@/lib/api-admin";

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
        setPages(items);
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
        {pages.map((page) => (
          <Card key={page.id} padding="sm" className="transition hover:-translate-y-0.5 hover:shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              <div className="flex items-center gap-2">
                <p className="text-xs text-[var(--bo-muted)]">Modifie le {formatDate(page.updatedAt)}</p>
                <Link href={`/admin/pages/${page.slug}`}>
                  <Button variant="secondary" size="sm">Modifier</Button>
                </Link>
                <Button type="button" variant="danger" size="sm" onClick={() => setPageToDelete(page)}>
                  Supprimer
                </Button>
              </div>
            </div>
            {page.metaDescription ? (
              <p className="mt-2 text-sm text-[var(--bo-muted)]">{page.metaDescription}</p>
            ) : null}
          </Card>
        ))}
      </div>
    );
  }, [error, loading, mounted, pages, token]);

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
