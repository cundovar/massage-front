"use client";

import { useEffect, useRef, useState } from "react";
import { Extension, Mark, mergeAttributes } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Baseline,
  Bold,
  Check,
  ChevronDown,
  CornerDownLeft,
  Italic,
  RemoveFormatting,
  Underline,
  type LucideIcon,
} from "lucide-react";
import { RICH_TEXT_COLORS, fromEditorHtml, getRichTextColor, toEditorHtml } from "@/lib/richText";

/** Un seul paragraphe : le texte reste "en ligne" dans la balise du bloc. */
const SingleParagraphDocument = Document.extend({ content: "paragraph" });

/** Entree = saut de ligne (et non nouveau paragraphe). */
const EnterAsLineBreak = Extension.create({
  name: "enterAsLineBreak",
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.setHardBreak(),
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    themeColor: {
      setThemeColor: (color: string) => ReturnType;
      unsetThemeColor: () => ReturnType;
    };
  }
}

/** Couleur limitee aux couleurs du theme, stockee en data-color (pas de code couleur libre). */
const ThemeColor = Mark.create({
  name: "themeColor",
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-color"),
        renderHTML: (attributes) => {
          const color = getRichTextColor(attributes.color as string | null);
          return color ? { "data-color": color.id, style: `color: ${color.css}` } : {};
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[data-color]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setThemeColor:
        (color) =>
        ({ commands }) =>
          commands.setMark(this.name, { color }),
      unsetThemeColor:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Zone haute (paragraphes) plutot qu'une ligne (titres). */
  multiline?: boolean;
  id?: string;
  /** Id de l'element qui sert de libelle (FieldLabel). */
  labelledBy?: string;
  /** Libelle accessible quand aucun libelle visible n'est relie. */
  ariaLabel?: string;
}

/**
 * Champ de texte avec mise en forme simple, pense pour une personne non technique :
 * gras, italique, souligne, saut de ligne et couleurs du theme.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  multiline = false,
  id,
  labelledBy,
  ariaLabel,
}: RichTextEditorProps) {
  const lastEmitted = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        document: false,
        heading: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        listKeymap: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        strike: false,
        link: false,
        dropcursor: false,
        gapcursor: false,
      }),
      SingleParagraphDocument,
      EnterAsLineBreak,
      ThemeColor,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: toEditorHtml(value),
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        ...(labelledBy ? { "aria-labelledby": labelledBy } : {}),
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
        role: "textbox",
        "aria-multiline": String(multiline),
        class: [
          "px-3 py-2 text-sm leading-6 text-stone-900 outline-none",
          multiline ? "min-h-[7rem]" : "min-h-[2.5rem]",
          "[&_p.is-editor-empty:first-child]:before:pointer-events-none",
          "[&_p.is-editor-empty:first-child]:before:float-left",
          "[&_p.is-editor-empty:first-child]:before:h-0",
          "[&_p.is-editor-empty:first-child]:before:text-stone-400",
          "[&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]",
          "[&_strong]:font-semibold [&_u]:underline-offset-4",
        ].join(" "),
      },
    },
    onUpdate: ({ editor: current }) => {
      const next = fromEditorHtml(current.getHTML());
      lastEmitted.current = next;
      onChangeRef.current(next);
    },
  });

  // Valeur modifiee de l'exterieur (autre bloc, annulation) : on resynchronise l'editeur.
  useEffect(() => {
    if (!editor || value === lastEmitted.current) return;
    lastEmitted.current = value;
    editor.commands.setContent(toEditorHtml(value), { emitUpdate: false });
  }, [editor, value]);

  return (
    <div className="overflow-visible rounded-md border border-stone-200 bg-white transition-colors hover:border-stone-300 focus-within:border-transparent focus-within:ring-2 focus-within:ring-amber-500">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ToolbarButton({ icon: Icon, label, isActive = false, onClick, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      disabled={disabled}
      // Garde la selection dans l'editeur au clic.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={[
        "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-40",
        isActive ? "bg-amber-100 text-amber-800" : "text-stone-500 hover:bg-stone-200/70 hover:text-stone-800",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current?.isActive("bold") ?? false,
      italic: current?.isActive("italic") ?? false,
      underline: current?.isActive("underline") ?? false,
      color: (current?.getAttributes("themeColor").color as string | undefined) ?? null,
    }),
  });

  const disabled = !editor;

  return (
    <div
      role="toolbar"
      aria-label="Mise en forme du texte"
      className="flex flex-wrap items-center gap-0.5 rounded-t-md border-b border-stone-100 bg-stone-50 px-1.5 py-1"
    >
      <ToolbarButton
        icon={Bold}
        label="Gras (Ctrl+B)"
        isActive={state?.bold}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        label="Italique (Ctrl+I)"
        isActive={state?.italic}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={Underline}
        label="Souligné (Ctrl+U)"
        isActive={state?.underline}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      />

      <span className="mx-1 h-4 w-px bg-stone-200" aria-hidden="true" />

      <ColorMenu editor={editor} activeColor={state?.color ?? null} />

      <span className="mx-1 h-4 w-px bg-stone-200" aria-hidden="true" />

      <ToolbarButton
        icon={CornerDownLeft}
        label="Saut de ligne (Entrée)"
        disabled={disabled}
        onClick={() => editor?.chain().focus().setHardBreak().run()}
      />
      <ToolbarButton
        icon={RemoveFormatting}
        label="Retirer la mise en forme"
        disabled={disabled}
        onClick={() => editor?.chain().focus().unsetAllMarks().run()}
      />
    </div>
  );
}

function ColorMenu({ editor, activeColor }: { editor: Editor | null; activeColor: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = getRichTextColor(activeColor);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function apply(colorId: string | null) {
    if (!editor) return;
    const chain = editor.chain().focus();
    (colorId ? chain.setThemeColor(colorId) : chain.unsetThemeColor()).run();
    setIsOpen(false);
  }

  const options = [{ id: null, label: "Couleur normale", css: "var(--text-primary)" }, ...RICH_TEXT_COLORS];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        title="Couleur du texte"
        aria-label="Couleur du texte"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        disabled={!editor}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setIsOpen((open) => !open)}
        className={[
          "flex h-7 items-center gap-0.5 rounded-md px-1.5 transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-40",
          active || isOpen ? "bg-amber-100 text-amber-800" : "text-stone-500 hover:bg-stone-200/70 hover:text-stone-800",
        ].join(" ")}
      >
        <span className="flex flex-col items-center">
          <Baseline className="h-4 w-4" aria-hidden="true" />
          <span
            className="-mt-0.5 h-0.5 w-3.5 rounded-full"
            style={{ background: active?.css ?? "currentColor" }}
            aria-hidden="true"
          />
        </span>
        <ChevronDown className="h-3 w-3" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Couleurs du thème"
          className="absolute left-0 top-full z-30 mt-1 w-52 rounded-lg border border-stone-200 bg-white p-1 shadow-lg"
        >
          {options.map((option) => {
            const isSelected = (option.id ?? null) === (active?.id ?? null);
            return (
              <button
                key={option.id ?? "default"}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => apply(option.id)}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-stone-700 hover:bg-stone-100 focus:bg-stone-100 focus:outline-none"
              >
                <span
                  className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                  style={{ background: option.css }}
                  aria-hidden="true"
                />
                <span className="flex-1" style={{ color: option.css }}>
                  {option.label}
                </span>
                {isSelected ? <Check className="h-4 w-4 text-amber-600" aria-hidden="true" /> : null}
              </button>
            );
          })}
          <p className="border-t border-stone-100 px-2 pt-1.5 pb-1 text-xs leading-4 text-stone-400">
            Couleurs du thème : elles s&apos;adaptent au mode sombre.
          </p>
        </div>
      ) : null}
    </div>
  );
}
