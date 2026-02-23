"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { PageSection } from "@/lib/api-admin";
import { Alert } from "@/components/admin/ui";
import { BlockList } from "./BlockList";
import { BlockPalette } from "./BlockPalette";
import { getBlockDefinition } from "./block-catalog";
import { LivePreview } from "./LivePreview";
import { getPageTemplate, hasPageTemplate } from "./page-templates";

interface PageBuilderProps {
  token: string;
  pageSlug: string;
  pageTitle: string;
  initialSections: PageSection[];
  showInNav: boolean;
  onSave: (sections: PageSection[]) => Promise<void>;
  onToggleNav: (showInNav: boolean) => Promise<void>;
}

export function PageBuilder({ token, pageSlug, pageTitle, initialSections, showInNav, onSave, onToggleNav }: PageBuilderProps) {
  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInNav, setIsInNav] = useState(showInNav);
  const [isTogglingNav, setIsTogglingNav] = useState(false);

  const handleToggleNav = useCallback(async () => {
    setIsTogglingNav(true);
    try {
      await onToggleNav(!isInNav);
      setIsInNav(!isInNav);
    } catch {
      setError("Impossible de modifier la visibilité dans le menu.");
    } finally {
      setIsTogglingNav(false);
    }
  }, [isInNav, onToggleNav]);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const orderedSections = useMemo(() => [...sections].sort((a, b) => a.sortOrder - b.sortOrder), [sections]);

  const handleAddBlock = useCallback(
    (blockType: string) => {
      const definition = getBlockDefinition(blockType);
      if (!definition) {
        return;
      }

      const newSection: PageSection = {
        key: `${blockType}-${Date.now()}`,
        type: blockType,
        title: null,
        content: JSON.parse(JSON.stringify(definition.defaultContent)) as Record<string, unknown>,
        sortOrder: sections.length,
        updatedAt: new Date().toISOString(),
      };

      setSections((prev) => [...prev, newSection]);
      setActiveSection(newSection.key);
      setIsPaletteOpen(false);
    },
    [sections.length],
  );

  const handleInitializeWithTemplate = useCallback(() => {
    const template = getPageTemplate(pageSlug);
    if (!template) return;

    const now = new Date().toISOString();
    const newSections: PageSection[] = template.map((section) => ({
      ...section,
      updatedAt: now,
    }));

    setSections(newSections);
    setActiveSection(newSections[0]?.key ?? null);
  }, [pageSlug]);

  const handleUpdateBlock = useCallback((key: string, updates: Partial<PageSection>) => {
    setSections((prev) =>
      prev.map((section) =>
        section.key === key
          ? {
              ...section,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : section,
      ),
    );
  }, []);

  const handleDeleteBlock = useCallback(
    (key: string) => {
      setSections((prev) => {
        const filtered = prev.filter((section) => section.key !== key);
        return filtered.map((section, index) => ({ ...section, sortOrder: index }));
      });
      if (activeSection === key) {
        setActiveSection(null);
      }
    },
    [activeSection],
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setSections((prev) => {
      const oldIndex = prev.findIndex((section) => section.key === active.id);
      const newIndex = prev.findIndex((section) => section.key === over.id);
      if (oldIndex === -1 || newIndex === -1) {
        return prev;
      }

      const reordered = arrayMove(prev, oldIndex, newIndex);
      return reordered.map((section, index) => ({ ...section, sortOrder: index }));
    });
  }, []);

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    try {
      await onSave(orderedSections);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible d'enregistrer les sections.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">{pageTitle}</h1>
          <p className="text-sm text-stone-500">/{pageSlug}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle afficher dans le menu */}
          <label className="flex cursor-pointer items-center gap-2">
            <span className="text-sm text-stone-600">Afficher dans le menu</span>
            <button
              type="button"
              role="switch"
              aria-checked={isInNav}
              disabled={isTogglingNav}
              onClick={handleToggleNav}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                isInNav ? "bg-amber-600" : "bg-stone-300"
              } ${isTogglingNav ? "opacity-50" : ""}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isInNav ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-amber-600 px-4 py-2 text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="border-b bg-white px-6 py-3">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 overflow-y-auto border-r bg-stone-50">
          <div className="space-y-4 p-6">
            {sections.length === 0 && hasPageTemplate(pageSlug) ? (
              <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">Page vide</h3>
                <p className="mb-6 text-stone-600">
                  Cette page n&apos;a pas encore de contenu. Vous pouvez la pre-remplir avec un modele ou commencer de zero.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={handleInitializeWithTemplate}
                    className="rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-700"
                  >
                    Utiliser le modele par defaut
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaletteOpen(true)}
                    className="rounded-lg border border-stone-300 bg-white px-6 py-3 font-medium text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    Commencer de zero
                  </button>
                </div>
              </div>
            ) : (
              <>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={orderedSections.map((section) => section.key)} strategy={verticalListSortingStrategy}>
                    <BlockList
                      sections={orderedSections}
                      activeSection={activeSection}
                      onSelect={setActiveSection}
                      onUpdate={handleUpdateBlock}
                      onDelete={handleDeleteBlock}
                      token={token}
                    />
                  </SortableContext>
                </DndContext>

                <button
                  type="button"
                  onClick={() => setIsPaletteOpen((prev) => !prev)}
                  className="w-full rounded-xl border-2 border-dashed border-stone-300 py-4 text-stone-500 transition-colors hover:border-amber-500 hover:text-amber-600"
                >
                  {isPaletteOpen ? "Fermer" : "Ajouter un bloc"}
                </button>
              </>
            )}

            {isPaletteOpen ? <BlockPalette onSelect={handleAddBlock} /> : null}
          </div>
        </div>

        <div className="w-1/2 overflow-y-auto bg-white">
          <LivePreview sections={orderedSections} activeSection={activeSection} onSelectSection={setActiveSection} />
        </div>
      </div>
    </div>
  );
}
