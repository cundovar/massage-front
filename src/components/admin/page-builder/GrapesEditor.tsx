"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import grapesjs, { type Block, type Component, type Editor } from "grapesjs";
import advanceComponents from "grapesjs-advance-components";
import basicBlocks from "grapesjs-blocks-basic";
import postcssParser from "grapesjs-parser-postcss";
import richTextExtensions from "grapesjs-rte-extensions";
import fr from "grapesjs/locale/fr.mjs";
import "grapesjs/dist/css/grapes.min.css";
import "./grapes-editor.css";
import { Alert, Spinner } from "@/components/admin/ui";
import {
  fetchMedia,
  fetchSiteBuilder,
  revalidateFrontend,
  saveSiteBuilder,
  uploadMedia,
  type PageSection,
  type SiteBuilderPage,
} from "@/lib/api-admin";
import { parseHeroSlides } from "@/lib/grapesContent";
import { getPublicPagePath } from "@/lib/page-paths";
import type { HeroSlide } from "@/types";
import { BASIC_BLOCKS_OPTIONS, RICH_TEXT_OPTIONS, ensureBlockStyles, refreshSharedBlocks, registerGrapesBlocks } from "./grapesBlocks";
import { GRAPES_DEVICES, GRAPES_STYLE_SECTORS, type GrapesDevice } from "./grapesConfig";
import { GrapesLeftPanel, GrapesRightPanel, type LeftTab, type RightTab } from "./GrapesPanels";
import { GrapesToolbar } from "./GrapesToolbar";
import { sectionsToGrapes } from "./sectionsToGrapes";
import { PageDetailsModal } from "./PageDetailsModal";
import { SlidesModal } from "./SlidesModal";

interface GrapesEditorProps {
  token: string;
  pageId: number;
  pageTitle: string;
  pageSlug: string;
  slugEditable: boolean;
  initiallyPublished: boolean;
  sections: PageSection[];
  onBack?: () => void;
  onUpdatePageDetails: (details: { title: string; slug?: string }) => Promise<void>;
}

const OUTLINE_COMMAND = "core:component-outline";
const PREVIEW_COMMAND = "core:preview";
const LEAVE_MESSAGE = "Des modifications ne sont pas enregistrées. Quitter quand même ?";
const REIMPORT_MESSAGE = "Remplacer le contenu de cette page par celui de l'ancien éditeur ?";
const WIDE_SCREEN = 1024;

function normalizeSearch(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const THEME_COLORS = ["--primary-start", "--primary-end", "--text-primary", "--text-secondary", "--background", "--background-alt", "--card-bg", "--card-border"];

function themePalette(): string[] {
  const styles = getComputedStyle(document.documentElement);
  return THEME_COLORS.map((name) => styles.getPropertyValue(name).trim()).filter(Boolean);
}

/** The canvas iframe needs the theme variables and fonts of the site to preview the blocks faithfully. */
function copySiteStyles(canvas: Window) {
  const { document: frame } = canvas;
  frame.documentElement.className = document.documentElement.className;
  document.head.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => {
    frame.head.appendChild(node.cloneNode(true));
  });
}

/** Scales the page down when its device width does not fit, so that the editor shows its real layout. */
function fitCanvas(editor: Editor, container: HTMLElement) {
  const width = Number.parseInt(editor.Devices.getSelected()?.get("width") ?? "", 10);
  const zoom = Number.isFinite(width) ? Math.min(100, (container.clientWidth / width) * 100) : 100;
  editor.Canvas.setZoom(zoom);

  // GrapesJS réduit depuis le centre : la page réduite doit partir du coin et remplir toute la hauteur.
  const frames = editor.Canvas.getFramesEl();
  frames.style.transformOrigin = "0 0";
  frames.style.width = `${(100 / zoom) * 100}%`;
  frames.style.height = `${(100 / zoom) * 100}%`;
}

/** Keeps one GrapesJS page per site page, identified by its stable database id. */
function syncProjectPages(editor: Editor, pages: SiteBuilderPage[], currentPageId: number) {
  const knownIds = new Set(pages.map((page) => String(page.id)));
  const currentId = String(currentPageId);

  const current = editor.Pages.get(currentId) ?? editor.Pages.add({ id: currentId, name: currentId }, { select: false });
  if (current) {
    editor.Pages.select(current);
  }

  editor.Pages.getAll()
    .filter((page) => !knownIds.has(page.id as string))
    .forEach((page) => editor.Pages.remove(page));
}

export function GrapesEditor({
  token,
  pageId,
  pageTitle,
  pageSlug,
  slugEditable,
  initiallyPublished,
  sections,
  onBack,
  onUpdatePageDetails,
}: GrapesEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blocksRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);
  const selectorsRef = useRef<HTMLDivElement | null>(null);
  const stylesRef = useRef<HTMLDivElement | null>(null);
  const traitsRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const updatedAtRef = useRef<string | null>(null);
  const publishedRef = useRef<Map<string, string>>(new Map());
  const sectionsRef = useRef(sections);

  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(initiallyPublished);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selected, setSelected] = useState<Component | null>(null);
  const [slidesTarget, setSlidesTarget] = useState<Component | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [, refreshSharedState] = useState(0);
  const [pages, setPages] = useState<SiteBuilderPage[]>([]);
  const [leftTab, setLeftTab] = useState<LeftTab | null>(() => (window.innerWidth >= WIDE_SCREEN ? "blocks" : null));
  const [rightTab, setRightTab] = useState<RightTab>("styles");
  const [rightPanelOpen, setRightPanelOpen] = useState(() => window.innerWidth >= WIDE_SCREEN);
  const [device, setDevice] = useState<GrapesDevice>("desktop");
  const [previewing, setPreviewing] = useState(false);
  const [outlines, setOutlines] = useState(true);
  const [history, setHistory] = useState({ canUndo: false, canRedo: false, isDirty: false });
  const [blockQuery, setBlockQuery] = useState("");
  const [noBlockMatch, setNoBlockMatch] = useState(false);

  const importSections = useCallback((editor: Editor) => {
    const { html, unsupported } = sectionsToGrapes(sectionsRef.current);
    editor.getWrapper()?.components(html);
    setError(unsupported.length > 0 ? `Blocs à refaire à la main : ${[...new Set(unsupported)].join(", ")}.` : null);
  }, []);

  const syncHistory = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      setHistory({
        canUndo: editor.UndoManager.hasUndo(),
        canRedo: editor.UndoManager.hasRedo(),
        isDirty: editor.getDirtyCount() > 0,
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let editor: Editor | null = null;
    let resizeObserver: ResizeObserver | null = null;

    async function init() {
      try {
        const [data, media] = await Promise.all([fetchSiteBuilder(token), fetchMedia(token)]);
        if (cancelled || !containerRef.current) {
          return;
        }

        setPages(data.pages);
        updatedAtRef.current = data.updatedAt;
        publishedRef.current = new Map(
          data.pages.filter((page) => page.publishedInBuilder).map((page) => [String(page.id), page.slug]),
        );

        editor = grapesjs.init({
          container: containerRef.current,
          height: "100%",
          width: "auto",
          fromElement: false,
          projectData: data.project ?? undefined,
          // Pas "false" : GrapesJS garderait son enregistrement auto, qui remet le compteur de modifications à zéro.
          storageManager: { autosave: false, autoload: false },
          panels: { defaults: [] },
          blockManager: { appendTo: blocksRef.current ?? undefined },
          layerManager: { appendTo: layersRef.current ?? undefined },
          styleManager: { appendTo: stylesRef.current ?? undefined, sectors: GRAPES_STYLE_SECTORS },
          traitManager: { appendTo: traitsRef.current ?? undefined },
          plugins: [
            postcssParser,
            (instance) => basicBlocks(instance, BASIC_BLOCKS_OPTIONS),
            (instance) => advanceComponents(instance, { pages: false }),
            (instance) => richTextExtensions(instance, RICH_TEXT_OPTIONS),
          ],
          canvasCss: "body { background-color: var(--background) !important; }",
          i18n: { locale: "fr", detectLocale: false, messages: { fr } },
          colorPicker: { appendTo: "body", showPalette: true, palette: [themePalette()] },
          deviceManager: { devices: GRAPES_DEVICES },
          assetManager: {
            assets: media.map((item) => ({ src: item.path, name: item.originalName })),
            uploadFile: async (event: DragEvent | Event) => {
              const files = (event as DragEvent).dataTransfer?.files ?? (event.target as HTMLInputElement).files;
              for (const file of Array.from(files ?? [])) {
                const uploaded = await uploadMedia(token, file);
                editor?.AssetManager.add({ src: uploaded.path, name: uploaded.originalName });
              }
            },
          },
        });

        registerGrapesBlocks(editor);
        editor.on("canvas:frame:load:body", ({ window: canvas }: { window: Window }) => copySiteStyles(canvas));
        editor.on("component:selected", (component: Component) => {
          setSelected(component);
          // Le diaporama se règle par un bouton : il doit être visible dès la sélection.
          if (component.getTraits().some((trait) => trait.get("type") === "button")) {
            setRightTab("traits");
          }
        });
        editor.on("component:deselected", () => setSelected(null));
        editor.Commands.add("hm:edit-slides", (instance: Editor) => setSlidesTarget(instance.getSelected() ?? null));

        // GrapesJS resélectionne sa première page au chargement : la page voulue se choisit ensuite.
        editor.onReady(() => {
          if (cancelled || !editor || !containerRef.current) {
            return;
          }

          syncProjectPages(editor, data.pages, pageId);
          ensureBlockStyles(editor);
          // Page encore vide dans GrapesJS : elle reprend ce qu'affiche l'ancien éditeur.
          if (!editor.getWrapper()?.components().length) {
            importSections(editor);
          }
          refreshSharedBlocks(editor);

          selectorsRef.current?.replaceChildren(editor.Selectors.render([]));
          editor.runCommand(OUTLINE_COMMAND);
          editor.UndoManager.clear();
          editor.clearDirtyCount();

          editorRef.current = editor;
          editor.on("update run:core:undo run:core:redo", syncHistory);
          const container = containerRef.current;
          resizeObserver = new ResizeObserver(() => {
            if (editorRef.current) {
              fitCanvas(editorRef.current, container);
              editorRef.current.refresh();
            }
          });
          resizeObserver.observe(container);
          syncHistory();
          setIsReady(true);
        });
      } catch {
        if (!cancelled) {
          setError("Impossible de charger l'éditeur.");
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      editor?.destroy();
      editorRef.current = null;
    };
  }, [importSections, pageId, syncHistory, token]);

  useEffect(() => {
    function warnIfDirty(event: BeforeUnloadEvent) {
      if (editorRef.current?.getDirtyCount()) {
        event.preventDefault();
      }
    }

    window.addEventListener("beforeunload", warnIfDirty);
    return () => window.removeEventListener("beforeunload", warnIfDirty);
  }, []);

  const save = useCallback(
    async (publishCurrentPage: boolean) => {
      const editor = editorRef.current;
      if (!editor) {
        return;
      }

      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const published = new Map(publishedRef.current);
      if (publishCurrentPage) {
        published.set(String(pageId), pageSlug);
      }

      const pages: Record<string, { html: string; css: string }> = {};
      for (const id of published.keys()) {
        const main = editor.Pages.get(id)?.getMainComponent();
        if (main) {
          pages[id] = { html: main.getInnerHTML(), css: editor.getCss({ component: main }) ?? "" };
        }
      }

      try {
        const result = await saveSiteBuilder(token, {
          project: editor.getProjectData() as unknown as Record<string, unknown>,
          pages,
          updatedAt: updatedAtRef.current,
        });

        updatedAtRef.current = result.updatedAt;
        publishedRef.current = published;
        editor.clearDirtyCount();
        syncHistory();
        setIsPublished(published.has(String(pageId)));
        await Promise.all(result.slugs.map((slug) => revalidateFrontend(getPublicPagePath(slug))));
        setSuccess(publishCurrentPage ? "Page publiée sur le site." : "Modifications enregistrées.");
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : "Enregistrement impossible.");
      } finally {
        setIsSaving(false);
      }
    },
    [pageId, pageSlug, syncHistory, token],
  );

  function confirmLeave(event: MouseEvent) {
    if (editorRef.current?.getDirtyCount() && !window.confirm(LEAVE_MESSAGE)) {
      event.preventDefault();
    }
  }

  function reimportSections() {
    const editor = editorRef.current;
    if (editor && window.confirm(REIMPORT_MESSAGE)) {
      importSections(editor);
      setSelected(null);
    }
  }

  function selectDevice(next: GrapesDevice) {
    const editor = editorRef.current;
    if (editor) {
      editor.setDevice(next);
      if (containerRef.current) {
        fitCanvas(editor, containerRef.current);
      }
    }
    setDevice(next);
  }

  function toggleOutlines() {
    const editor = editorRef.current;
    if (editor) {
      if (outlines) {
        editor.stopCommand(OUTLINE_COMMAND);
      } else {
        selectorsRef.current?.replaceChildren(editor.Selectors.render([]));
        editor.runCommand(OUTLINE_COMMAND);
      }
      setOutlines(!outlines);
    }
  }

  function togglePreview() {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    if (previewing) {
      editor.stopCommand(PREVIEW_COMMAND);
    } else {
      editor.runCommand(PREVIEW_COMMAND);
    }
    setPreviewing(!previewing);
  }

  function filterBlocks(query: string) {
    setBlockQuery(query);
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const search = normalizeSearch(query.trim());
    const matches = editor.Blocks.getAll().filter((block: Block) => normalizeSearch(block.getLabel()).includes(search));
    editor.Blocks.render(matches);
    setNoBlockMatch(matches.length === 0);
  }

  function shareSelected() {
    const editor = editorRef.current;
    if (!editor || !selected) {
      return;
    }

    const name = window.prompt("Nom du composant partagé", selected.getName());
    if (!name) {
      return;
    }

    selected.set("custom-name", name);
    const main = editor.Components.addSymbol(selected);
    main?.set("custom-name", name);
    refreshSharedBlocks(editor);
    refreshSharedState((count) => count + 1);
  }

  function detachSelected() {
    if (editorRef.current && selected) {
      editorRef.current.Components.detachSymbol(selected);
      setSelected(null);
    }
  }

  function saveSlides(slides: HeroSlide[]) {
    slidesTarget?.addAttributes({ "data-slides": JSON.stringify(slides) });
    setSlidesTarget(null);
  }

  const isShared = Boolean(selected && editorRef.current?.Components.getSymbolInfo(selected).isSymbol);

  return (
    <div className="hm-grapes fixed inset-0 z-50 flex flex-col bg-stone-900 text-stone-200">
      <GrapesToolbar
        pageTitle={pageTitle}
        device={device}
        previewing={previewing}
        outlines={outlines}
        rightPanelOpen={rightPanelOpen}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        isDirty={history.isDirty}
        isReady={isReady}
        isSaving={isSaving}
        isPublished={isPublished}
        canShare={Boolean(selected) && !isShared}
        isShared={isShared}
        onLeave={confirmLeave}
        onBackToOldEditor={onBack}
        onReimport={isPublished ? undefined : reimportSections}
        onDevice={selectDevice}
        onUndo={() => editorRef.current?.runCommand("core:undo")}
        onRedo={() => editorRef.current?.runCommand("core:redo")}
        onToggleOutlines={toggleOutlines}
        onTogglePreview={togglePreview}
        onToggleRightPanel={() => setRightPanelOpen((open) => !open)}
        onDetails={() => setShowDetails(true)}
        onShare={shareSelected}
        onDetach={detachSelected}
        onSave={(publishCurrentPage) => void save(publishCurrentPage)}
      />

      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)}>{success}</Alert>}
      {isShared && <Alert variant="warning">Composant partagé : vos modifications s&apos;appliquent à toutes les pages qui l&apos;utilisent.</Alert>}

      <div className="relative flex min-h-0 flex-1">
        <GrapesLeftPanel
          tab={leftTab}
          hidden={previewing}
          pages={pages}
          currentPageId={pageId}
          blockQuery={blockQuery}
          noBlockMatch={noBlockMatch}
          blocksRef={blocksRef}
          layersRef={layersRef}
          onTab={setLeftTab}
          onBlockQuery={filterBlocks}
          onLeave={confirmLeave}
        />

        <div className="relative min-w-0 flex-1">
          <div ref={containerRef} className="h-full" />
          {!isReady && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-950">
              <Spinner size="lg" />
            </div>
          )}
        </div>

        <GrapesRightPanel
          tab={rightTab}
          open={rightPanelOpen && !previewing}
          hasSelection={Boolean(selected)}
          selectorsRef={selectorsRef}
          stylesRef={stylesRef}
          traitsRef={traitsRef}
          onTab={setRightTab}
        />
      </div>

      {slidesTarget && (
        <SlidesModal
          token={token}
          initialSlides={parseHeroSlides(slidesTarget.getAttributes()["data-slides"])}
          onClose={() => setSlidesTarget(null)}
          onSave={saveSlides}
        />
      )}
      {showDetails && (
        <PageDetailsModal
          pageTitle={pageTitle}
          pageSlug={pageSlug}
          slugEditable={slugEditable}
          onClose={() => setShowDetails(false)}
          onSave={onUpdatePageDetails}
        />
      )}
    </div>
  );
}
