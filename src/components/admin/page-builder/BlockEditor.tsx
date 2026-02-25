"use client";

import { Plus, X } from "lucide-react";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { PageLinkPicker } from "@/components/admin/ui/PageLinkPicker";
import type { PageSection } from "@/lib/api-admin";
import type { BlockDefinition, FieldDefinition } from "./block-catalog";

const ANIMATION_OPTIONS = [
  { value: "none", label: "Aucune" },
  { value: "fade-up", label: "Fondu + montee" },
  { value: "fade-down", label: "Fondu + descente" },
  { value: "slide-left", label: "Glissement gauche" },
  { value: "slide-right", label: "Glissement droite" },
  { value: "zoom-in", label: "Zoom entrant" },
  { value: "zoom-out", label: "Zoom sortant" },
  { value: "bounce", label: "Rebond" },
] as const;

interface BlockEditorProps {
  section: PageSection;
  definition: BlockDefinition;
  onUpdate: (updates: Partial<PageSection>) => void;
  token: string;
}

export function BlockEditor({ section, definition, onUpdate, token }: BlockEditorProps) {
  // S'assurer que le contenu est un objet valide (pas un tableau vide ou undefined)
  const safeContent = (
    section.content && typeof section.content === "object" && !Array.isArray(section.content)
      ? section.content
      : definition.defaultContent
  ) as Record<string, unknown>;

  function getValue(path: string): unknown {
    const keys = path.split(".");
    let value: unknown = safeContent;

    for (const key of keys) {
      if (value === null || value === undefined || typeof value !== "object") {
        return undefined;
      }
      value = (value as Record<string, unknown>)[key];
    }

    return value;
  }

  function setValue(path: string, nextValue: unknown) {
    const keys = path.split(".");
    const newContent = JSON.parse(JSON.stringify(safeContent)) as Record<string, unknown>;

    let current: Record<string, unknown> = newContent;
    for (let index = 0; index < keys.length - 1; index += 1) {
      const currentKey = keys[index];
      const candidate = current[currentKey];

      if (!candidate || typeof candidate !== "object") {
        current[currentKey] = {};
      }

      current = current[currentKey] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = nextValue;
    onUpdate({ content: newContent });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Titre affiche (optionnel)</label>
        <input
          type="text"
          value={section.title ?? ""}
          onChange={(event) => onUpdate({ title: event.target.value || null })}
          placeholder="Laisser vide pour utiliser le titre du contenu"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {definition.fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={getValue(field.key)}
          onChange={(value) => setValue(field.key, value)}
          token={token}
        />
      ))}

      <div className="space-y-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
        <h4 className="text-sm font-medium text-stone-700">Animation d&apos;entree</h4>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Effet</label>
          <select
            value={(section.content.animation as string | undefined) ?? "fade-up"}
            onChange={(event) => setValue("animation", event.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
          >
            {ANIMATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Delai (secondes)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={(section.content.animationDelay as number | undefined) ?? 0}
            onChange={(event) => setValue("animationDelay", Number.parseFloat(event.target.value) || 0)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
    </div>
  );
}

interface FieldRendererProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  token: string;
}

function FieldRenderer({ field, value, onChange, token }: FieldRendererProps) {
  switch (field.type) {
    case "text":
      return (
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{field.label}</label>
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={field.placeholder}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
          />
        </div>
      );

    case "textarea":
      return (
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{field.label}</label>
          <textarea
            value={(value as string) ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full resize-y rounded-lg border border-stone-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
          />
        </div>
      );

    case "image":
      return (
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{field.label}</label>
          <MediaPicker token={token} value={(value as string) ?? null} onChange={(path) => onChange(path)} />
        </div>
      );

    case "array":
      return (
        <ArrayField
          field={field}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          token={token}
        />
      );

    case "page-link":
      return (
        <PageLinkPicker
          label={field.label}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          token={token}
          onChange={(nextValue) => onChange(nextValue)}
        />
      );

    case "select":
      return (
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{field.label}</label>
          <select
            value={(value as string) ?? ""}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
          >
            <option value="">-- Sélectionner --</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "toggle": {
      const checked = value === true || value === "true";
      return (
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{field.label}</label>
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-amber-600" : "bg-stone-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>
      );
    }

    case "color":
      return (
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">{field.label}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={((value as string) || "#ffffff").startsWith("#") ? (value as string) : "#ffffff"}
              onChange={(event) => onChange(event.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-stone-300 bg-white p-1"
            />
            <input
              type="text"
              value={(value as string) ?? ""}
              onChange={(event) => onChange(event.target.value)}
              placeholder={field.placeholder || "#FFFFFF"}
              className="flex-1 rounded-lg border border-stone-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}

interface ArrayFieldProps {
  field: FieldDefinition;
  value: unknown[];
  onChange: (value: unknown[]) => void;
  token: string;
}

function ArrayField({ field, value, onChange, token }: ArrayFieldProps) {
  function createDefaultArrayItem(): unknown {
    if (field.arrayItemType === "object" && field.objectFields) {
      const item: Record<string, unknown> = {};
      for (const subField of field.objectFields) {
        if (subField.type === "array") {
          item[subField.key] = [];
        } else if (subField.type === "image") {
          item[subField.key] = null;
        } else {
          item[subField.key] = "";
        }
      }
      return item;
    }

    return "";
  }

  function removeItem(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  function updateItem(index: number, nextItemValue: unknown) {
    const updated = [...value];
    updated[index] = nextItemValue;
    onChange(updated);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-700">{field.label}</label>

      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={`${field.key}-${index}`} className="flex gap-2">
            {field.arrayItemType === "object" && field.objectFields ? (
              <div className="flex-1 space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
                {field.objectFields.map((subField) => (
                  <FieldRenderer
                    key={`${field.key}-${subField.key}-${index}`}
                    field={subField}
                    value={(item as Record<string, unknown>)?.[subField.key]}
                    onChange={(nextSubFieldValue) => {
                      const nextObjectValue = {
                        ...((item as Record<string, unknown>) ?? {}),
                        [subField.key]: nextSubFieldValue,
                      };
                      updateItem(index, nextObjectValue);
                    }}
                    token={token}
                  />
                ))}
              </div>
            ) : field.arrayItemType === "image" ? (
              <div className="flex-1">
                <MediaPicker
                  token={token}
                  value={(item as string) ?? null}
                  onChange={(path) => updateItem(index, path)}
                />
              </div>
            ) : field.arrayItemType === "textarea" ? (
              <textarea
                value={(item as string) ?? ""}
                onChange={(event) => updateItem(index, event.target.value)}
                rows={3}
                className="flex-1 resize-y rounded-lg border border-stone-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
              />
            ) : (
              <input
                type="text"
                value={(item as string) ?? ""}
                onChange={(event) => updateItem(index, event.target.value)}
                className="flex-1 rounded-lg border border-stone-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
              />
            )}

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="self-start rounded-lg p-2 text-stone-400 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...value, createDefaultArrayItem()])}
        className="mt-2 flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
      >
        <Plus className="h-4 w-4" />
        Ajouter
      </button>
    </div>
  );
}
