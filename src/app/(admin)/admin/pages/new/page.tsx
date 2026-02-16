"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTokenFromStorage } from "@/lib/auth";
import { createPage } from "@/lib/api-admin";

export default function NewPageAdmin() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const token = getTokenFromStorage();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    try {
      await createPage(token, { slug, title });
      router.push(`/admin/pages/${slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la creation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bo-card p-6">
      <h2 className="mb-6 text-2xl font-semibold">Nouvelle page</h2>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Slug (URL)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            placeholder="ma-nouvelle-page"
            className="w-full rounded border px-3 py-2"
            required
          />
          <p className="mt-1 text-xs text-gray-500">URL: /{slug}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ma nouvelle page"
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-amber-600 px-4 py-2 text-white transition hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? "Creation..." : "Creer la page"}
        </button>
      </form>
    </section>
  );
}
