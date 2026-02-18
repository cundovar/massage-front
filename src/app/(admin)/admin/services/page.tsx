"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Badge, Button, Card, ConfirmDialog, EmptyState, IconButton, Spinner } from "@/components/admin/ui";
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
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  async function confirmDelete() {
    if (!token || !serviceToDelete) return;
    setDeleting(true);
    try {
      await deleteService(token, serviceToDelete.id);
      setServices((prev) => prev.filter((item) => item.id !== serviceToDelete.id));
      setServiceToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setDeleting(false);
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
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Services</p>
          <h2 className="mt-2 text-2xl font-semibold">Gestion des services</h2>
        </div>
        <Link href="/admin/services/new">
          <Button>Nouveau service</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            variant={activeCategory === category ? "primary" : "secondary"}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="space-y-3">
        {filteredServices.map((service) => (
          <Card key={service.id} padding="sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{service.name}</p>
                  {service.highlight ? <Badge variant="warning">Mis en avant</Badge> : null}
                </div>
                <Badge>{service.category}</Badge>
                <p className="text-sm text-stone-700">{service.description}</p>
                <p className="text-sm text-stone-500">
                  {service.prices.map((price) => `${price.label}: ${price.price}€`).join(" · ")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <IconButton
                  icon={<span aria-hidden="true">↑</span>}
                  label="Monter"
                  size="sm"
                  onClick={() => void handleMove(service.id, "up")}
                />
                <IconButton
                  icon={<span aria-hidden="true">↓</span>}
                  label="Descendre"
                  size="sm"
                  onClick={() => void handleMove(service.id, "down")}
                />
                <Button type="button" variant="secondary" size="sm" onClick={() => void handleToggleHighlight(service)}>
                  {service.highlight ? "Retirer highlight" : "Mettre highlight"}
                </Button>
                <Link href={`/admin/services/${service.id}`}>
                  <Button variant="secondary" size="sm">Editer</Button>
                </Link>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => setServiceToDelete(service)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredServices.length === 0 ? (
          <EmptyState
            title="Aucun service"
            description={
              activeCategory === "Toutes"
                ? "Commencez par creer votre premier service."
                : `Aucun service dans la categorie "${activeCategory}".`
            }
            action={
              activeCategory === "Toutes" ? (
                <Link href="/admin/services/new">
                  <Button>Creer un service</Button>
                </Link>
              ) : null
            }
          />
        ) : null}
      </div>

      <ConfirmDialog
        isOpen={Boolean(serviceToDelete)}
        onClose={() => setServiceToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer le service ?"
        message={`Etes-vous sur de vouloir supprimer "${serviceToDelete?.name ?? ""}" ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
      />
    </Card>
  );
}
