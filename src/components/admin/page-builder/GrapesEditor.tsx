"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import grapesjs, { type Component, type Editor } from "grapesjs";
import basicBlocks from "grapesjs-blocks-basic";
import fr from "grapesjs/locale/fr.mjs";
import "grapesjs/dist/css/grapes.min.css";
import { Alert, Button } from "@/components/admin/ui";
import {
  fetchMedia,
  fetchSiteBuilder,
  revalidateFrontend,
  saveSiteBuilder,
  uploadMedia,
  type SiteBuilderPage,
} from "@/lib/api-admin";
import { parseHeroSlides } from "@/lib/grapesContent";
import { getPublicPagePath } from "@/lib/page-paths";
import type { HeroSlide } from "@/types";
import { BASIC_BLOCKS_OPTIONS, ensureBlockStyles, refreshSharedBlocks, registerGrapesBlocks } from "./grapesBlocks";
import { PageDetailsModal } from "./PageDetailsModal";
import { SlidesModal } from "./SlidesModal";

interface GrapesEditorProps {
  token: string;
  pageId: number;
  pageTitle: string;
  pageSlug: string;
  slugEditable: boolean;
  initiallyPublished: boolean;
  onBack?: () => void;
  onUpdatePageDetails: (details: { title: string; slug?: string }) => Promise<void>;
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
  onBack,
  onUpdatePageDetails,
}: GrapesEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const updatedAtRef = useRef<string | null>(null);
  const publishedRef = useRef<Map<string, string>>(new Map());

  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(initiallyPublished);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selected, setSelected] = useState<Component | null>(null);
  const [slidesTarget, setSlidesTarget] = useState<Component | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [, refreshSharedState] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let editor: Editor | null = null;

    async function init() {
      try {
        const [data, media] = await Promise.all([fetchSiteBuilder(token), fetchMedia(token)]);
        if (cancelled || !containerRef.current) {
          return;
        }

        updatedAtRef.current = data.updatedAt;
        publishedRef.current = new Map(
          data.pages.filter((page) => page.publishedInBuilder).map((page) => [String(page.id), page.slug]),
        );

        editor = grapesjs.init({
          container: containerRef.current,
          height: "100%",
          width: "auto",
          fromElement: false,
          storageManager: false,
          plugins: [(instance) => basicBlocks(instance, BASIC_BLOCKS_OPTIONS)],
          canvasCss: "body { background-color: var(--background) !important; }",
          i18n: { locale: "fr", detectLocale: false, messages: { fr } },
          colorPicker: { showPalette: true, palette: [themePalette()] },
          deviceManager: {
            devices: [
              { id: "desktop", name: "Ordinateur", width: "" },
              { id: "tablet", name: "Tablette", width: "768px", widthMedia: "1023px" },
              { id: "mobile", name: "Téléphone", width: "375px", widthMedia: "767px" },
            ],
          },
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
        editor.on("component:selected", (component: Component) => setSelected(component));
        editor.on("component:deselected", () => setSelected(null));
        editor.Commands.add("hm:edit-slides", (instance: Editor) => setSlidesTarget(instance.getSelected() ?? null));

        if (data.project) {
          editor.loadProjectData(data.project);
        }
        syncProjectPages(editor, data.pages, pageId);
        ensureBlockStyles(editor);
        refreshSharedBlocks(editor);

        editorRef.current = editor;
        setIsReady(true);
      } catch {
        if (!cancelled) {
          setError("Impossible de charger l'éditeur.");
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
      editor?.destroy();
      editorRef.current = null;
    };
  }, [pageId, token]);

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
        setIsPublished(published.has(String(pageId)));
        await Promise.all(result.slugs.map((slug) => revalidateFrontend(getPublicPagePath(slug))));
        setSuccess(publishCurrentPage ? "Page publiée sur le site." : "Modifications enregistrées.");
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : "Enregistrement impossible.");
      } finally {
        setIsSaving(false);
      }
    },
    [pageId, pageSlug, token],
  );

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
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-lg font-semibold text-stone-800">{pageTitle}</h1>
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            Revenir à l&apos;ancien éditeur
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={() => setShowDetails(true)}>
          Titre et URL
        </Button>
        {selected && !isShared && (
          <Button variant="secondary" size="sm" onClick={shareSelected}>
            Partager ce bloc
          </Button>
        )}
        {isShared && (
          <Button variant="secondary" size="sm" onClick={detachSelected}>
            Détacher
          </Button>
        )}
        {isPublished ? (
          <Button size="sm" loading={isSaving} disabled={!isReady} onClick={() => void save(false)}>
            Enregistrer et publier
          </Button>
        ) : (
          <>
            <Button variant="secondary" size="sm" loading={isSaving} disabled={!isReady} onClick={() => void save(false)}>
              Enregistrer le brouillon
            </Button>
            <Button size="sm" loading={isSaving} disabled={!isReady} onClick={() => void save(true)}>
              Publier cette page
            </Button>
          </>
        )}
      </div>

      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)}>{success}</Alert>}
      {isShared && <Alert variant="warning">Composant partagé : vos modifications s&apos;appliquent à toutes les pages qui l&apos;utilisent.</Alert>}

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-stone-200">
        <div ref={containerRef} className="h-full" />
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
