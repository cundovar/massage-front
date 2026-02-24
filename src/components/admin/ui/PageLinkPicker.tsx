"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { fetchPages, type PageListItem } from "@/lib/api-admin";

const PREDEFINED_LINKS = [
  { value: "/", label: "Accueil" },
  { value: "/soins", label: "Carte & tarifs" },
  { value: "/contact", label: "Contact" },
  { value: "/a-propos", label: "A propos" },
  { value: "/entreprise", label: "Entreprise" },
  { value: "/mentions-legales", label: "Mentions legales" },
  { value: "#", label: "# (ancre)" },
];

interface PageLinkPickerProps {
  token: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

function getPagePath(page: PageListItem): string {
  return page.slug === "home" ? "/" : `/${page.slug}`;
}

export function PageLinkPicker({
  token,
  value,
  onChange,
  label,
  placeholder,
}: PageLinkPickerProps) {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPages() {
      try {
        const data = await fetchPages(token);
        if (!cancelled) {
          setPages(data);
          setLoadError(null);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Impossible de charger les pages.");
          setPages([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPages();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const knownLinks = useMemo(() => {
    const pageLinks = pages.map(getPagePath);
    return new Set([...PREDEFINED_LINKS.map((item) => item.value), ...pageLinks]);
  }, [pages]);

  useEffect(() => {
    if (!value) {
      setIsCustom(false);
      return;
    }

    setIsCustom(!knownLinks.has(value));
  }, [knownLinks, value]);

  const handleSelectChange = (nextValue: string) => {
    if (nextValue === "__custom__") {
      setIsCustom(true);
      onChange("");
      return;
    }

    setIsCustom(false);
    onChange(nextValue);
  };

  return (
    <div>
      {label ? <label className="mb-1 block text-sm font-medium text-stone-700">{label}</label> : null}

      {isCustom ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder || "https://... ou /chemin"}
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={() => {
              setIsCustom(false);
              onChange("");
            }}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
          >
            Liste
          </button>
        </div>
      ) : (
        <div className="relative">
          <select
            value={value}
            onChange={(event) => handleSelectChange(event.target.value)}
            disabled={loading}
            className="w-full appearance-none rounded-lg border border-stone-300 bg-white px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-amber-500 disabled:bg-stone-100"
          >
            <option value="">-- Sélectionner une page --</option>

            <optgroup label="Pages du site">
              {pages.map((page) => {
                const path = getPagePath(page);
                return (
                  <option key={page.slug} value={path}>
                    {page.title} ({path})
                  </option>
                );
              })}
            </optgroup>

            <optgroup label="Liens prédéfinis">
              {PREDEFINED_LINKS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label} ({item.value})
                </option>
              ))}
            </optgroup>

            <optgroup label="Autre">
              <option value="__custom__">Saisir un lien personnalisé...</option>
            </optgroup>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
        </div>
      )}

      {loadError ? <p className="mt-1 text-xs text-amber-700">{loadError}</p> : null}
      {value && !isCustom ? (
        <p className="mt-1 text-xs text-stone-500">
          Lien: <code className="rounded bg-stone-100 px-1">{value}</code>
        </p>
      ) : null}
    </div>
  );
}
