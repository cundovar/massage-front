"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageBuilder } from "@/components/admin/page-builder/PageBuilder";
import { Alert, Card, Spinner } from "@/components/admin/ui";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import {
  createSection,
  deleteSection,
  fetchPage,
  syncContactPage,
  updateSection,
  type PageDetail,
  type PageSection,
} from "@/lib/api-admin";

export default function PageEditorPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const [token] = useState<string | null>(() => (typeof window === "undefined" ? null : getTokenFromStorage()));
  const [page, setPage] = useState<PageDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router, token]);

  useEffect(() => {
    if (!token || !params.slug) {
      return;
    }

    fetchPage(token, params.slug)
      .then((data) => {
        setPage(data);
        setError(null);
      })
      .catch((fetchError: Error) => {
        if (fetchError.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }

        setError("Impossible de charger la page.");
      });
  }, [params.slug, router, token]);

  async function handleSave(sections: PageSection[]) {
    if (!token || !params.slug || !page) {
      return;
    }

    const currentByKey = new Map(page.sections.map((section) => [section.key, section]));
    const nextByKey = new Map(sections.map((section) => [section.key, section]));

    for (const currentSection of page.sections) {
      if (!nextByKey.has(currentSection.key)) {
        await deleteSection(token, params.slug, currentSection.key);
      }
    }

    for (const section of sections) {
      if (currentByKey.has(section.key)) {
        await updateSection(token, params.slug, section.key, {
          title: section.title,
          content: section.content,
          sortOrder: section.sortOrder,
        });
      } else {
        await createSection(token, params.slug, {
          key: section.key,
          type: section.type,
          title: section.title,
          content: section.content,
          sortOrder: section.sortOrder,
        });
      }
    }

    // Synchroniser les données Contact avec Settings
    if (params.slug === "contact") {
      await syncContactPage(token);
    }

    const refreshed = await fetchPage(token, params.slug);
    setPage(refreshed);
  }

  if (!token || (!page && !error)) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  if (error || !page) {
    return (
      <Card>
        <Alert variant="error">{error ?? "Page introuvable"}</Alert>
      </Card>
    );
  }

  return (
    <PageBuilder
      token={token}
      pageSlug={page.slug}
      pageTitle={page.title}
      initialSections={page.sections}
      onSave={handleSave}
    />
  );
}
