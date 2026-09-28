"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AdminMeResponse,
  fetchAdminApi,
  fetchMedia,
  fetchPages,
  fetchServices,
  fetchSettings,
  type PageListItem,
} from "@/lib/api-admin";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import type { Service } from "@/types/service";
import type { SiteSettings } from "@/types/settings";

interface DashboardData {
  me: AdminMeResponse;
  settings: SiteSettings;
  pages: PageListItem[];
  services: Service[];
  mediaCount: number;
}

interface ChecklistItem {
  label: string;
  href: string;
}

const SHORTCUTS = [
  { label: "Modifier les tarifs", description: "Soins et prix", href: "/admin/services" },
  { label: "Modifier une page", description: "Contenu et SEO", href: "/admin/pages" },
  { label: "Ajouter une photo", description: "Mediatheque", href: "/admin/media" },
  { label: "Changer les horaires", description: "Parametres du site", href: "/admin/settings" },
];

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function buildChecklist({ settings, pages, services }: DashboardData): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  if (!settings.general.logo) items.push({ label: "Aucun logo defini", href: "/admin/settings" });
  if (!settings.general.favicon) items.push({ label: "Aucun favicon defini", href: "/admin/settings" });

  const { instagram, facebook, linkedin } = settings.social;
  if (![instagram, facebook, linkedin].some((link) => link && link.trim() !== "")) {
    items.push({ label: "Aucun reseau social renseigne", href: "/admin/settings" });
  }

  for (const page of pages) {
    if (!page.metaDescription || page.metaDescription.trim() === "") {
      items.push({ label: `Page « ${page.title} » sans meta description`, href: `/admin/pages/${page.slug}` });
    }
  }

  for (const service of services) {
    if (!service.prices || service.prices.length === 0) {
      items.push({ label: `Soin « ${service.name} » sans prix`, href: `/admin/services/${service.id}` });
    }
  }

  return items;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getTokenFromStorage();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    Promise.all([
      fetchAdminApi<AdminMeResponse>("/api/admin/me", token),
      fetchSettings(token),
      fetchPages(token),
      fetchServices(token),
      fetchMedia(token),
    ])
      .then(([me, settings, pages, services, media]) => {
        setData({ me, settings, pages, services, mediaCount: media.length });
      })
      .catch((err: Error) => {
        if (err.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }
        setError("Impossible de charger le tableau de bord.");
      });
  }, [router]);

  if (error) {
    return <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>;
  }

  if (!data) {
    return <section className="bo-card p-6">Chargement...</section>;
  }

  const checklist = buildChecklist(data);
  const lastPageUpdate = data.pages
    .map((page) => page.updatedAt)
    .sort()
    .at(-1);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="bo-label">Bonjour</p>
          <p className="mt-1 text-2xl font-semibold">{data.me.name}</p>
          <p className="text-sm text-stone-500">{data.me.email}</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Voir le site ↗
        </a>
      </section>

      <section aria-labelledby="shortcuts-title">
        <h2 id="shortcuts-title" className="bo-label mb-3">Raccourcis</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SHORTCUTS.map((shortcut) => (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="bo-card block p-5 transition-colors hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <p className="font-semibold text-stone-800">{shortcut.label}</p>
              <p className="mt-1 text-sm text-stone-500">{shortcut.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="content-title">
        <h2 id="content-title" className="bo-label mb-3">Contenu du site</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/admin/services" className="bo-card block p-5 hover:border-amber-400">
            <p className="text-sm text-stone-500">Soins</p>
            <p className="mt-1 text-3xl font-semibold text-amber-600">{data.services.length}</p>
          </Link>
          <Link href="/admin/pages" className="bo-card block p-5 hover:border-amber-400">
            <p className="text-sm text-stone-500">Pages</p>
            <p className="mt-1 text-3xl font-semibold text-amber-600">{data.pages.length}</p>
          </Link>
          <Link href="/admin/media" className="bo-card block p-5 hover:border-amber-400">
            <p className="text-sm text-stone-500">Images</p>
            <p className="mt-1 text-3xl font-semibold text-amber-600">{data.mediaCount}</p>
          </Link>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="bo-card p-6" aria-labelledby="checklist-title">
          <h2 id="checklist-title" className="font-semibold text-stone-800">
            A completer {checklist.length > 0 ? `(${checklist.length})` : null}
          </h2>
          {checklist.length === 0 ? (
            <p className="mt-3 text-sm text-emerald-700">Tout est complet ✓</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {checklist.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-stone-700 hover:bg-amber-100"
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true" className="text-amber-600">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bo-card p-6" aria-labelledby="updates-title">
          <h2 id="updates-title" className="font-semibold text-stone-800">Dernieres modifications</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-stone-500">Parametres du site</dt>
              <dd className="font-medium text-stone-700">{formatDate(data.settings.updatedAt)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-stone-500">Pages (la plus recente)</dt>
              <dd className="font-medium text-stone-700">{formatDate(lastPageUpdate)}</dd>
            </div>
          </dl>
          <ul className="mt-4 space-y-1 border-t border-stone-100 pt-3 text-sm">
            {[...data.pages]
              .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
              .slice(0, 5)
              .map((page) => (
                <li key={page.id} className="flex justify-between gap-3">
                  <Link href={`/admin/pages/${page.slug}`} className="text-stone-700 hover:text-amber-600">
                    {page.title}
                  </Link>
                  <span className="text-stone-400">{formatDate(page.updatedAt)}</span>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
