"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ServiceForm } from "@/components/admin/editors/ServiceForm";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { fetchService, updateService } from "@/lib/api-admin";
import type { Service, ServiceFormData } from "@/types/service";

export default function AdminServiceEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [token] = useState<string | null>(() => getTokenFromStorage());
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = Number(params.id);

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    if (!Number.isFinite(id)) {
      return;
    }

    fetchService(token, id)
      .then((item) => {
        setService(item);
        setError(null);
      })
      .catch((err: Error) => {
        if (err.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }
        setError("Impossible de charger le service.");
      })
      .finally(() => setLoading(false));
  }, [id, router, token]);

  async function handleSubmit(data: ServiceFormData) {
    if (!token || !service) return;
    await updateService(token, service.id, data);
    router.push("/admin/services");
  }

  if (!Number.isFinite(id)) return <section className="bo-card p-6">ID invalide.</section>;
  if (loading) return <section className="bo-card p-6">Chargement...</section>;
  if (!service) return <section className="bo-card p-6">{error ?? "Service introuvable."}</section>;

  return (
    <section className="space-y-4">
      <Link href="/admin/services" className="text-sm text-stone-600 hover:text-stone-900">
        ← Retour
      </Link>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <ServiceForm initialData={service} onSubmit={handleSubmit} onCancel={() => router.push("/admin/services")} submitLabel="Enregistrer" />
    </section>
  );
}
