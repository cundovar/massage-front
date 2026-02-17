"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, type Service, type ServiceFormData } from "@/types/service";

interface ServiceFormProps {
  initialData?: Service;
  isLoading?: boolean;
  submitLabel?: string;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  onCancel: () => void;
}

export function ServiceForm({ initialData, isLoading = false, submitLabel = "Enregistrer", onSubmit, onCancel }: ServiceFormProps) {
  const [category, setCategory] = useState(initialData?.category ?? "Ayurveda");
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [prices, setPrices] = useState<ServiceFormData["prices"]>(
    initialData?.prices?.length ? initialData.prices : [{ label: "", price: 0 }],
  );
  const [highlight, setHighlight] = useState(initialData?.highlight ?? false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (!category.trim() || !name.trim() || !description.trim()) return false;
    return prices.length > 0 && prices.every((price) => price.label.trim() && Number(price.price) > 0);
  }, [category, description, name, prices]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isLoading) return;

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        category: category.trim(),
        name: name.trim(),
        description: description.trim(),
        prices: prices.map((price) => ({ label: price.label.trim(), price: Number(price.price) })),
        highlight,
        sortOrder: initialData?.sortOrder,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de sauvegarde.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bo-card space-y-6 p-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Categorie *</label>
        <input
          list="service-categories"
          className="bo-input"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        />
        <datalist id="service-categories">
          {CATEGORIES.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Nom du service *</label>
        <input className="bo-input" value={name} onChange={(event) => setName(event.target.value)} required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description *</label>
        <textarea
          className="bo-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={5}
          required
        />
      </div>

      <div className="space-y-2 rounded-lg border border-stone-200 p-4">
        <p className="text-sm font-medium">Tarifs</p>
        {prices.map((price, index) => (
          <div key={`${price.label}-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <input
              className="bo-input"
              placeholder="Label (1h, 1h30...)"
              value={price.label}
              onChange={(event) => {
                const next = [...prices];
                next[index] = { ...next[index], label: event.target.value };
                setPrices(next);
              }}
            />
            <input
              className="bo-input"
              type="number"
              min={1}
              placeholder="Prix"
              value={price.price}
              onChange={(event) => {
                const next = [...prices];
                next[index] = { ...next[index], price: Number(event.target.value || 0) };
                setPrices(next);
              }}
            />
            <button
              type="button"
              className="rounded-md border border-rose-200 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
              onClick={() => setPrices((prev) => prev.filter((_, i) => i !== index))}
              disabled={prices.length === 1}
            >
              Supprimer
            </button>
          </div>
        ))}
        <button
          type="button"
          className="rounded-md border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:border-amber-500 hover:text-amber-700"
          onClick={() => setPrices((prev) => [...prev, { label: "", price: 0 }])}
        >
          Ajouter un tarif
        </button>
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={highlight} onChange={(event) => setHighlight(event.target.checked)} />
        Mettre en avant sur la page d&apos;accueil
      </label>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button type="button" className="rounded-md border border-stone-200 px-4 py-2 text-sm text-stone-700" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="bo-button-primary" disabled={!canSubmit || submitting || isLoading}>
          {submitting || isLoading ? "Enregistrement..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
