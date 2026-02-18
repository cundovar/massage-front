"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Card, Checkbox, FormField, FormSection, Input, Textarea } from "@/components/admin/ui";
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
    <form onSubmit={handleSubmit}>
      <Card className="space-y-6">
        <FormSection title="Informations generales" description="Details du service">
          <FormField label="Categorie" required>
            <Input list="service-categories" value={category} onChange={(event) => setCategory(event.target.value)} required />
            <datalist id="service-categories">
              {CATEGORIES.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </FormField>

          <FormField label="Nom du service" required>
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </FormField>

          <FormField label="Description" required>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} required />
          </FormField>
        </FormSection>

        <FormSection title="Tarification">
          <div className="space-y-2">
            {prices.map((price, index) => (
              <div key={`${price.label}-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <Input
                  placeholder="Label (1h, 1h30...)"
                  value={price.label}
                  onChange={(event) => {
                    const next = [...prices];
                    next[index] = { ...next[index], label: event.target.value };
                    setPrices(next);
                  }}
                />
                <Input
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
                <Button type="button" variant="danger" size="sm" onClick={() => setPrices((prev) => prev.filter((_, i) => i !== index))} disabled={prices.length === 1}>
                  Supprimer
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => setPrices((prev) => [...prev, { label: "", price: 0 }])}>
              Ajouter un tarif
            </Button>
          </div>
        </FormSection>

        <FormSection title="Options">
          <Checkbox
            label="Mettre en avant sur la page d&apos;accueil"
            checked={highlight}
            onChange={(event) => setHighlight(event.target.checked)}
          />
        </FormSection>

        {error ? <Alert variant="error">{error}</Alert> : null}

        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={!canSubmit || submitting || isLoading} loading={submitting || isLoading}>
            {submitLabel}
          </Button>
        </div>
      </Card>
    </form>
  );
}
