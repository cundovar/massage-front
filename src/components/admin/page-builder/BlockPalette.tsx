"use client";

import { BLOCK_CATEGORIES, BLOCK_CATALOG } from "./block-catalog";

interface BlockPaletteProps {
  onSelect: (blockType: string) => void;
}

export function BlockPalette({ onSelect }: BlockPaletteProps) {
  return (
    <div className="space-y-6 rounded-xl border border-stone-200 bg-white p-4 shadow-lg">
      {BLOCK_CATEGORIES.map((category) => {
        const blocks = BLOCK_CATALOG.filter((block) => block.category === category.id);
        if (blocks.length === 0) {
          return null;
        }

        return (
          <div key={category.id}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
              <span>{category.icon}</span>
              {category.label}
            </h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {blocks.map((block) => (
                <button
                  key={block.type}
                  type="button"
                  onClick={() => onSelect(block.type)}
                  className="group flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3 text-left transition-all hover:border-amber-500 hover:bg-amber-50"
                >
                  <span className="text-2xl">{block.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-stone-900 group-hover:text-amber-700">{block.label}</p>
                    <p className="line-clamp-2 text-xs text-stone-500">{block.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
