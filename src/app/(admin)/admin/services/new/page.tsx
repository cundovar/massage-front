"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceForm } from "@/components/admin/editors/ServiceForm";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { createService } from "@/lib/api-admin";
import type { ServiceFormData } from "@/types/service";

export default function AdminServiceCreatePage() {
  const router = useRouter();
  const [token] = useState<string | null>(() => getTokenFromStorage());

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router, token]);

  async function handleSubmit(data: ServiceFormData) {
    if (!token) return;
    try {
      await createService(token, data);
      router.push("/admin/services");
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        clearTokenFromStorage();
        router.replace("/admin/login");
        return;
      }
      throw err;
    }
  }

  return (
    <section className="space-y-4">
      <Link href="/admin/services" className="text-sm text-stone-600 hover:text-stone-900">
        ← Retour
      </Link>
      <ServiceForm onSubmit={handleSubmit} onCancel={() => router.push("/admin/services")} submitLabel="Créer le service" />
    </section>
  );
}
