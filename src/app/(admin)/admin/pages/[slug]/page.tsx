"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SectionEditor } from "@/components/admin/editors/SectionEditor";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { fetchPage, type PageDetail, type PageSection } from "@/lib/api-admin";

export default function AdminPageEditor() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [page, setPage] = useState<PageDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      .then((data) => setPage(data))
      .catch((err: Error) => {
        if (err.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }
        setError("Impossible de charger la page.");
      });
  }, [params.slug, router, token]);

  function handleSectionUpdate(updated: PageSection) {
    setPage((prev) => {
      if (!prev) return prev;
      const nextSections = prev.sections.map((section) => (section.key === updated.key ? updated : section));
      return { ...prev, sections: nextSections };
    });
  }

  if (!mounted || !token || !page) {
    return <section className="bo-card p-6">Chargement...</section>;
  }

  return (
    <section className="space-y-6">
      <div className="bo-card p-6">
        <p className="bo-label">Page</p>
        <h2 className="mt-2 text-2xl font-semibold">{page.title}</h2>
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </div>

      {page.sections.map((section) => (
        <SectionEditor
          key={section.key}
          token={token}
          pageSlug={page.slug}
          section={section}
          onUpdate={handleSectionUpdate}
        />
      ))}
    </section>
  );
}
