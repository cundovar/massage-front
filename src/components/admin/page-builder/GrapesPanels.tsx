import type { RefObject } from "react";
import Link from "next/link";
import { FileText, Layers, LayoutGrid, Search, type LucideIcon } from "lucide-react";
import { IconButton } from "@/components/admin/ui";
import type { SiteBuilderPage } from "@/lib/api-admin";

export type LeftTab = "blocks" | "layers" | "pages";
export type RightTab = "styles" | "traits";

const LEFT_TABS: { id: LeftTab; label: string; icon: LucideIcon }[] = [
  { id: "blocks", label: "Blocs", icon: LayoutGrid },
  { id: "layers", label: "Calques", icon: Layers },
  { id: "pages", label: "Pages", icon: FileText },
];

const RIGHT_TABS: { id: RightTab; label: string }[] = [
  { id: "styles", label: "Styles" },
  { id: "traits", label: "Réglages" },
];

// Sous lg, les panneaux passent au-dessus du canvas pour lui laisser toute la largeur.
const PANEL_CLASS = "absolute inset-y-0 z-20 flex w-72 max-w-[calc(100%-3rem)] flex-col bg-stone-900 lg:static lg:z-auto";

interface GrapesLeftPanelProps {
  tab: LeftTab | null;
  hidden: boolean;
  pages: SiteBuilderPage[];
  currentPageId: number;
  blockQuery: string;
  noBlockMatch: boolean;
  blocksRef: RefObject<HTMLDivElement | null>;
  layersRef: RefObject<HTMLDivElement | null>;
  onTab: (tab: LeftTab | null) => void;
  onBlockQuery: (query: string) => void;
  onLeave: (event: React.MouseEvent) => void;
}

export function GrapesLeftPanel({
  tab,
  hidden,
  pages,
  currentPageId,
  blockQuery,
  noBlockMatch,
  blocksRef,
  layersRef,
  onTab,
  onBlockQuery,
  onLeave,
}: GrapesLeftPanelProps) {
  return (
    <div className={hidden ? "hidden" : "contents"}>
      <nav aria-label="Outils de l'éditeur" className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-stone-700 bg-stone-900 py-2">
        {LEFT_TABS.map(({ id, label, icon: Icon }) => (
          <IconButton
            key={id}
            icon={<Icon className="h-5 w-5" />}
            label={label}
            title={label}
            variant={tab === id ? "darkActive" : "dark"}
            aria-pressed={tab === id}
            onClick={() => onTab(tab === id ? null : id)}
          />
        ))}
      </nav>

      <aside className={`${PANEL_CLASS} left-12 border-r border-stone-700 ${tab ? "" : "hidden"}`}>
        <h2 className="border-b border-stone-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
          {LEFT_TABS.find(({ id }) => id === tab)?.label}
        </h2>

        <div className={tab === "blocks" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
          <label className="relative m-2 block">
            <span className="sr-only">Rechercher un bloc</span>
            <Search className="pointer-events-none absolute left-2 top-2 h-4 w-4 text-stone-500" />
            <input
              type="search"
              value={blockQuery}
              onChange={(event) => onBlockQuery(event.target.value)}
              placeholder="Rechercher un bloc"
              className="w-full rounded-md border border-stone-700 bg-stone-800 py-1.5 pl-8 pr-2 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </label>
          {noBlockMatch && <p className="px-3 py-2 text-sm text-stone-400">Aucun bloc trouvé.</p>}
          <div ref={blocksRef} className="min-h-0 flex-1 overflow-y-auto" />
        </div>

        <div ref={layersRef} className={tab === "layers" ? "min-h-0 flex-1 overflow-y-auto" : "hidden"} />

        {tab === "pages" && (
          <ul className="min-h-0 flex-1 overflow-y-auto p-2">
            {pages.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/admin/pages/${page.slug}`}
                  onClick={onLeave}
                  aria-current={page.id === currentPageId ? "page" : undefined}
                  className={`flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    page.id === currentPageId ? "bg-amber-500/20 text-amber-400" : "text-stone-200 hover:bg-stone-800"
                  }`}
                >
                  <span className="truncate">{page.title}</span>
                  {!page.publishedInBuilder && <span className="shrink-0 text-xs text-stone-400">Ancien éditeur</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

interface GrapesRightPanelProps {
  tab: RightTab;
  open: boolean;
  hasSelection: boolean;
  selectorsRef: RefObject<HTMLDivElement | null>;
  stylesRef: RefObject<HTMLDivElement | null>;
  traitsRef: RefObject<HTMLDivElement | null>;
  onTab: (tab: RightTab) => void;
}

export function GrapesRightPanel({ tab, open, hasSelection, selectorsRef, stylesRef, traitsRef, onTab }: GrapesRightPanelProps) {
  return (
    <aside className={`${PANEL_CLASS} right-0 border-l border-stone-700 ${open ? "" : "hidden"}`}>
      <div role="tablist" aria-label="Propriétés de l'élément" className="flex border-b border-stone-700">
        {RIGHT_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTab(id)}
            className={`flex-1 border-b-2 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 ${
              tab === id ? "border-amber-400 text-amber-400" : "border-transparent text-stone-400 hover:text-stone-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {!hasSelection && <p className="p-4 text-sm text-stone-400">Sélectionnez un élément de la page pour le modifier.</p>}

      <div className={hasSelection ? "min-h-0 flex-1 overflow-y-auto" : "hidden"}>
        <div className={tab === "styles" ? "" : "hidden"}>
          <div ref={selectorsRef} />
          <div ref={stylesRef} />
        </div>
        <div ref={traitsRef} className={tab === "traits" ? "" : "hidden"} />
      </div>
    </aside>
  );
}
