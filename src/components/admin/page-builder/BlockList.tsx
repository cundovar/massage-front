"use client";

import { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";
import type { PageSection } from "@/lib/api-admin";
import { BlockEditor } from "./BlockEditor";
import { getBlockDefinition } from "./block-catalog";

interface BlockListProps {
  sections: PageSection[];
  activeSection: string | null;
  onSelect: (key: string | null) => void;
  onUpdate: (key: string, updates: Partial<PageSection>) => void;
  onDelete: (key: string) => void;
  token: string;
}

export function BlockList({ sections, activeSection, onSelect, onUpdate, onDelete, token }: BlockListProps) {
  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.sortOrder - b.sortOrder), [sections]);

  return (
    <div className="space-y-3">
      {sortedSections.map((section) => (
        <SortableBlock
          key={section.key}
          section={section}
          isActive={activeSection === section.key}
          onSelect={() => onSelect(activeSection === section.key ? null : section.key)}
          onUpdate={(updates) => onUpdate(section.key, updates)}
          onDelete={() => onDelete(section.key)}
          token={token}
        />
      ))}

      {sortedSections.length === 0 ? (
        <div className="py-12 text-center text-stone-400">
          <p className="text-lg">Aucun bloc</p>
          <p className="text-sm">Cliquez sur &quot;Ajouter un bloc&quot; pour commencer</p>
        </div>
      ) : null}
    </div>
  );
}

interface SortableBlockProps {
  section: PageSection;
  isActive: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<PageSection>) => void;
  onDelete: () => void;
  token: string;
}

function SortableBlock({ section, isActive, onSelect, onUpdate, onDelete, token }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const definition = getBlockDefinition(section.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "rounded-xl border bg-white transition-all",
        isDragging ? "border-amber-500 opacity-90 shadow-xl" : "border-stone-200",
        isActive ? "ring-2 ring-amber-500" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 text-stone-400 hover:text-stone-600 active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <span className="text-xl">{definition?.icon ?? "📄"}</span>
        <span className="flex-1 font-medium text-stone-900">{definition?.label ?? section.type}</span>

        <button type="button" onClick={onSelect} className="p-1 text-stone-400 hover:text-stone-600">
          {isActive ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        <button type="button" onClick={onDelete} className="p-1 text-stone-400 hover:text-red-600">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {isActive && definition ? (
        <div className="p-4">
          <BlockEditor section={section} definition={definition} onUpdate={onUpdate} token={token} />
        </div>
      ) : null}
    </div>
  );
}
