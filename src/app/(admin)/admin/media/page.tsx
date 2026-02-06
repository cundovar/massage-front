"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { getTokenFromStorage } from "@/lib/auth";

export default function AdminMediaPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

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

  if (!mounted || !token) {
    return <section className="bo-card p-6">Chargement...</section>;
  }

  return (
    <section className="bo-card p-6">
      <p className="bo-label">Mediatheque</p>
      <h2 className="mt-2 text-2xl font-semibold">Gestion des images</h2>
      <div className="mt-6">
        <MediaLibrary token={token} />
      </div>
    </section>
  );
}
