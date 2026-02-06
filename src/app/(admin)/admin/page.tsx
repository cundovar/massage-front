"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminMeResponse, CountNewResponse, fetchAdminApi } from "@/lib/api-admin";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AdminMeResponse | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const token = getTokenFromStorage();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    Promise.all([
      fetchAdminApi<AdminMeResponse>("/api/admin/me", token),
      fetchAdminApi<CountNewResponse>("/api/admin/reservation-requests/count-new", token),
    ])
      .then(([meData, countData]) => {
        setMe(meData);
        setCount(countData.count);
      })
      .catch((error: Error) => {
        if (error.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
        }
      });
  }, [router]);

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <article className="bo-card p-6">
        <p className="bo-label">Admin connecte</p>
        <p className="mt-2 text-2xl font-semibold">{me?.name ?? "..."}</p>
        <p className="text-sm text-stone-500">{me?.email ?? ""}</p>
      </article>
      <article className="bo-card p-6">
        <p className="bo-label">Nouvelles reservations</p>
        <p className="mt-2 text-4xl font-semibold text-amber-600">{count}</p>
      </article>
    </section>
  );
}
