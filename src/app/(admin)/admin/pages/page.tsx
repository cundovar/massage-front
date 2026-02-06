"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { fetchPages, type PageListItem } from "@/lib/api-admin";

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

  const content = useMemo(() => {
    if (loading || !mounted || !token) {
      return <p>Chargement...</p>;
    }

    if (error) {
      return <p className="text-sm text-rose-600">{error}</p>;
    }

    if (pages.length === 0) {
      return <p className="text-sm text-[var(--bo-muted)]">Aucune page disponible.</p>;
    }

    return (
      <div className="mt-6 space-y-3">
        {pages.map((page) => (
          <Link
            key={page.id}
            href={`/admin/pages/${page.slug}`}
            className="block rounded-lg border border-[var(--bo-line)] bg-white/80 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold">{page.title}</p>
                <p className="text-sm text-[var(--bo-muted)]">/{page.slug}</p>
              </div>
              <p className="text-xs text-[var(--bo-muted)]">
                Modifie le {formatDate(page.updatedAt)}
              </p>
            </div>
            {page.metaDescription ? (
              <p className="mt-2 text-sm text-[var(--bo-muted)]">{page.metaDescription}</p>
            ) : null}
          </Link>
        ))}
      </div>
    );
  }, [error, loading, mounted, pages, token]);

  return (
    <section className="bo-card p-6">
      <p className="bo-label">Pages</p>
      <h2 className="mt-2 text-2xl font-semibold">Gestion des pages</h2>
      {content}
    </section>
  );
}
