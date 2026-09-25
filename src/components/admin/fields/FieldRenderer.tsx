"use client";

import { useId } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { ChoiceCards } from "@/components/admin/ui/ChoiceCards";
import { ColorPicker } from "@/components/admin/ui/ColorPicker";
import { FieldLabel } from "@/components/admin/ui/FieldLabel";
import { Input } from "@/components/admin/ui/Input";
import { PageLinkPicker } from "@/components/admin/ui/PageLinkPicker";
import { RichTextEditor } from "@/components/admin/ui/RichTextEditor";
import { SegmentedControl } from "@/components/admin/ui/SegmentedControl";
import { Select } from "@/components/admin/ui/Select";
import { Textarea } from "@/components/admin/ui/Textarea";
import type { FieldDefinition } from "@/components/admin/page-builder/block-catalog";

/*
 * Rendu generique d'un champ decrit par une FieldDefinition (catalogue de blocs).
 * Reutilisable par tout formulaire admin pilote par une description de champs.
 */

export interface FieldRendererProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  token: string;
}

export function SelectField({ field, value, onChange }: Omit<FieldRendererProps, "token">) {
  const selectId = useId();
  const currentValue = (value as string | undefined) ?? "";
  const options = field.options ?? [];

  if (field.widget === "segmented") {
    return (
      <SegmentedControl
        label={field.label}
        help={field.help}
        optional={field.optional}
        value={currentValue}
        options={options}
        onChange={onChange}
      />
    );
  }

  if (field.widget === "cards") {
    return (
      <ChoiceCards
        label={field.label}
        help={field.help}
        optional={field.optional}
        value={currentValue}
        options={options}
        onChange={onChange}
      />
    );
  }

  return (
    <div>
      <FieldLabel label={field.label} htmlFor={selectId} help={field.help} optional={field.optional} />
      <Select
        id={selectId}
        value={currentValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder={currentValue === "" ? "-- Choisir --" : undefined}
        options={options}
      />
    </div>
  );
}

export function FieldRenderer({ field, value, onChange, token }: FieldRendererProps) {
  const fieldId = useId();

  switch (field.type) {
    case "text":
    case "textarea":
      if (field.rich) {
        return (
          <div>
            <FieldLabel
              as="span"
              id={`${fieldId}-label`}
              label={field.label}
              help={field.help}
              optional={field.optional}
            />
            <RichTextEditor
              id={fieldId}
              labelledBy={`${fieldId}-label`}
              value={(value as string) ?? ""}
              onChange={onChange}
              placeholder={field.placeholder}
              multiline={field.type === "textarea"}
            />
          </div>
        );
      }

      if (field.type === "text") {
        return (
          <div>
            <FieldLabel label={field.label} htmlFor={fieldId} help={field.help} optional={field.optional} />
            <Input
              id={fieldId}
              type="text"
              value={(value as string) ?? ""}
              onChange={(event) => onChange(event.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        );
      }

      return (
        <div>
          <FieldLabel label={field.label} htmlFor={fieldId} help={field.help} optional={field.optional} />
          <Textarea
            id={fieldId}
            value={(value as string) ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        </div>
      );

    case "image":
      return (
        <div>
          <FieldLabel as="span" label={field.label} help={field.help} optional={field.optional} />
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
        <div>
          {field.help || field.optional ? (
            <FieldLabel as="span" label={field.label} help={field.help} optional={field.optional} />
          ) : null}
          <PageLinkPicker
            label={field.help || field.optional ? undefined : field.label}
            placeholder={field.placeholder}
            value={(value as string) ?? ""}
            token={token}
            onChange={(nextValue) => onChange(nextValue)}
          />
        </div>
      );

    case "select":
      return <SelectField field={field} value={value} onChange={onChange} />;

    case "toggle": {
      const checked = value === true || value === "true";
      return (
        <div className="flex items-center justify-between gap-4">
          <FieldLabel as="span" label={field.label} help={field.help} optional={field.optional} />
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={field.label}
            onClick={() => onChange(!checked)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${checked ? "bg-amber-600" : "bg-stone-300"}`}
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
          <FieldLabel as="span" label={field.label} help={field.help} optional={field.optional} />
          <ColorPicker label={field.label} value={(value as string) ?? ""} onChange={(color) => onChange(color)} />
        </div>
      );

    default:
      return null;
  }
}

export interface ArrayFieldProps {
  field: FieldDefinition;
  value: unknown[];
  onChange: (value: unknown[]) => void;
  token: string;
}

export function ArrayField({ field, value, onChange, token }: ArrayFieldProps) {
  const itemLabel = field.itemLabel ?? "Élément";

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
      <FieldLabel as="span" label={field.label} help={field.help} optional={field.optional} />

      <div className="space-y-2">
        {value.map((item, index) => {
          const removeLabel = `Supprimer ${itemLabel.toLowerCase()} ${index + 1}`;

          if (field.arrayItemType === "object" && field.objectFields) {
            return (
              <div key={`${field.key}-${index}`} className="rounded-lg border border-stone-200 bg-stone-50">
                <div className="flex items-center justify-between border-b border-stone-200 px-3 py-2">
                  <span className="text-sm font-medium text-stone-700">
                    {itemLabel} {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label={removeLabel}
                    title={removeLabel}
                    className="rounded-md p-1 text-stone-400 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="space-y-3 p-3">
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
              </div>
            );
          }

          return (
            <div key={`${field.key}-${index}`} className="flex gap-2">
              {field.arrayItemType === "image" ? (
                <div className="flex-1">
                  <MediaPicker
                    token={token}
                    value={(item as string) ?? null}
                    onChange={(path) => updateItem(index, path)}
                  />
                </div>
              ) : field.rich && (field.arrayItemType === "textarea" || field.arrayItemType === "text") ? (
                <div className="min-w-0 flex-1">
                  <RichTextEditor
                    value={(item as string) ?? ""}
                    onChange={(nextValue) => updateItem(index, nextValue)}
                    ariaLabel={`${itemLabel} ${index + 1}`}
                    multiline={field.arrayItemType === "textarea"}
                  />
                </div>
              ) : field.arrayItemType === "textarea" ? (
                <Textarea
                  value={(item as string) ?? ""}
                  onChange={(event) => updateItem(index, event.target.value)}
                  aria-label={`${itemLabel} ${index + 1}`}
                  rows={3}
                  className="flex-1"
                />
              ) : (
                <Input
                  type="text"
                  value={(item as string) ?? ""}
                  onChange={(event) => updateItem(index, event.target.value)}
                  aria-label={`${itemLabel} ${index + 1}`}
                  className="flex-1"
                />
              )}

              <button
                type="button"
                onClick={() => removeItem(index)}
                aria-label={removeLabel}
                title={removeLabel}
                className="self-start rounded-lg p-2 text-stone-400 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onChange([...value, createDefaultArrayItem()])}
        className="mt-2 flex items-center gap-1 rounded-md text-sm font-medium text-amber-600 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Ajouter {field.itemLabel ? itemLabel.toLowerCase() : ""}
      </button>
    </div>
  );
}
