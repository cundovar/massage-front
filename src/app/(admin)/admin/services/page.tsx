"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { deleteService, fetchServices, reorderServices, updateService } from "@/lib/api-admin";
import type { Service } from "@/types/service";

export default function AdminServicesPage() {
  const router = useRouter();
  const [token] = useState<string | null>(() => getTokenFromStorage());
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Toutes");

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    fetchServices(token)
      .then((items) => {
        setServices(items.sort((a, b) => a.sortOrder - b.sortOrder));
        setError(null);
      })
      .catch((err: Error) => {
        if (err.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }
        setError("Impossible de charger les services.");
      })
      .finally(() => setLoading(false));
  }, [router, token]);

  const categories = useMemo(() => {
    const all = new Set<string>(["Toutes"]);
    services.forEach((service) => all.add(service.category));
    return Array.from(all);
  }, [services]);

  const filteredServices = useMemo(
    () => services.filter((service) => activeCategory === "Toutes" || service.category === activeCategory),
    [activeCategory, services],
  );

  async function handleDelete(id: number) {
    if (!token) return;
    if (!window.confirm("Supprimer ce service ?")) return;
    try {
      await deleteService(token, id);
      setServices((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    }
  }

  async function handleToggleHighlight(service: Service) {
    if (!token) return;
    try {
      const updated = await updateService(token, service.id, { highlight: !service.highlight });
      setServices((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise a jour impossible.");
    }
  }

  async function handleMove(id: number, direction: "up" | "down") {
    if (!token) return;
    const ordered = [...services].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = ordered.findIndex((item) => item.id === id);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ordered.length) return;

    const [moved] = ordered.splice(index, 1);
    ordered.splice(targetIndex, 0, moved);

    setServices(ordered.map((item, idx) => ({ ...item, sortOrder: idx })));
    try {
      await reorderServices(token, ordered.map((item) => item.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reordonnancement impossible.");
    }
  }

  if (loading) {
    return <section className="bo-card p-6">Chargement...</section>;
  }

  return (
    <section className="bo-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="bo-label">Services</p>
          <h2 className="mt-2 text-2xl font-semibold">Gestion des services</h2>
        </div>
        <Link href="/admin/services/new" className="bo-button-primary">
          Nouveau service
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-md px-3 py-1 text-sm ${activeCategory === category ? "bg-amber-600 text-white" : "border border-stone-200 text-stone-700"}`}
          >
            {category}
          </button>
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-6 space-y-3">
        {filteredServices.map((service) => (
          <article key={service.id} className="rounded-lg border border-[var(--bo-line)] bg-white/80 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  {service.highlight ? "★ " : ""}
                  {service.name}
                </p>
                <p className="text-sm text-stone-500">{service.category}</p>
                <p className="text-sm text-stone-700">{service.description}</p>
                <p className="text-sm text-stone-500">
                  {service.prices.map((price) => `${price.label}: ${price.price}€`).join(" · ")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="rounded border border-stone-200 px-2 py-1 text-xs" onClick={() => void handleMove(service.id, "up")}>
                  ↑
                </button>
                <button type="button" className="rounded border border-stone-200 px-2 py-1 text-xs" onClick={() => void handleMove(service.id, "down")}>
                  ↓
                </button>
                <button
                  type="button"
                  className="rounded border border-amber-200 px-3 py-1 text-xs text-amber-700"
                  onClick={() => void handleToggleHighlight(service)}
                >
                  {service.highlight ? "Retirer highlight" : "Mettre highlight"}
                </button>
                <Link href={`/admin/services/${service.id}`} className="rounded border border-stone-200 px-3 py-1 text-xs">
                  Editer
                </Link>
                <button
                  type="button"
                  className="rounded border border-rose-200 px-3 py-1 text-xs text-rose-700"
                  onClick={() => void handleDelete(service.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
