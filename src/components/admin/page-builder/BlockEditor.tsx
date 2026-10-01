"use client";

import {
  Images,
  MousePointerClick,
  Palette,
  SlidersHorizontal,
  Sparkles,
  Type,
  type LucideIcon,
} from "lucide-react";
import { FieldRenderer, SelectField } from "@/components/admin/fields/FieldRenderer";
import { ButtonField } from "@/components/admin/ui/ButtonField";
import { FieldGroup } from "@/components/admin/ui/FieldGroup";
import { FieldLabel } from "@/components/admin/ui/FieldLabel";
import { Input } from "@/components/admin/ui/Input";
import { SegmentedControl } from "@/components/admin/ui/SegmentedControl";
import type { PageSection } from "@/lib/api-admin";
import type { BlockDefinition, FieldDefinition, FieldGroupId } from "./block-catalog";

const ANIMATION_OPTIONS = [
  { value: "none", label: "Aucune" },
  { value: "fade-up", label: "Fondu + montée" },
  { value: "fade-down", label: "Fondu + descente" },
  { value: "slide-left", label: "Glissement gauche" },
  { value: "slide-right", label: "Glissement droite" },
  { value: "zoom-in", label: "Zoom entrant" },
  { value: "zoom-out", label: "Zoom sortant" },
  { value: "bounce", label: "Rebond" },
];

const ANIMATION_DELAY_OPTIONS = [
  { value: "0", label: "Immédiat" },
  { value: "0.3", label: "0,3 s" },
  { value: "0.6", label: "0,6 s" },
  { value: "1", label: "1 s" },
];

const SPACING_OPTIONS = [
  { value: "none", label: "Aucun" },
  { value: "sm", label: "Petit" },
  { value: "md", label: "Moyen" },
  { value: "lg", label: "Grand" },
];

/** Reglages communs a tous les blocs (cadre autour du contenu). */
const APPEARANCE_FIELDS: FieldDefinition[] = [
  {
    key: "_appearance.background",
    label: "Fond du bloc",
    type: "select",
    widget: "segmented",
    help: "Couleur posée derrière tout le bloc. « Léger » et « Carte » le détachent du reste de la page.",
    options: [
      { value: "transparent", label: "Aucun" },
      { value: "soft", label: "Léger" },
      { value: "surface", label: "Carte" },
      { value: "accent", label: "Thème" },
    ],
  },
  {
    key: "_appearance.width",
    label: "Largeur",
    type: "select",
    widget: "segmented",
    help: "Place occupée par le bloc sur un grand écran. Sur téléphone, il prend toujours toute la largeur.",
    options: [
      { value: "full", label: "Pleine" },
      { value: "wide", label: "Large" },
      { value: "normal", label: "Normale" },
      { value: "narrow", label: "Étroite" },
    ],
  },
  {
    key: "_appearance.paddingTop",
    label: "Espace au-dessus",
    type: "select",
    widget: "segmented",
    help: "Espace vide ajouté entre ce bloc et celui du dessus.",
    options: SPACING_OPTIONS,
  },
  {
    key: "_appearance.paddingBottom",
    label: "Espace en dessous",
    type: "select",
    widget: "segmented",
    help: "Espace vide ajouté entre ce bloc et celui du dessous.",
    options: SPACING_OPTIONS,
  },
  {
    key: "_appearance.radius",
    label: "Coins arrondis",
    type: "select",
    widget: "segmented",
    help: "Arrondit les angles du fond du bloc. Visible seulement si un fond est choisi.",
    options: [
      { value: "none", label: "Droits" },
      { value: "md", label: "Arrondis" },
      { value: "lg", label: "Très arrondis" },
    ],
  },
];

const APPEARANCE_DEFAULTS: Record<string, string | boolean> = {
  "_appearance.background": "transparent",
  "_appearance.width": "full",
  "_appearance.paddingTop": "none",
  "_appearance.paddingBottom": "none",
  "_appearance.radius": "none",
  "_appearance.visibility.mobile": true,
  "_appearance.visibility.tablet": true,
  "_appearance.visibility.desktop": true,
};

const VISIBILITY_FIELDS: FieldDefinition[] = [
  {
    key: "_appearance.visibility.mobile",
    label: "Afficher sur mobile",
    type: "toggle",
    help: "Visible sur les téléphones.",
  },
  {
    key: "_appearance.visibility.tablet",
    label: "Afficher sur tablette",
    type: "toggle",
    help: "Visible entre les formats téléphone et bureau.",
  },
  {
    key: "_appearance.visibility.desktop",
    label: "Afficher sur bureau",
    type: "toggle",
    help: "Visible sur les grands écrans.",
  },
];

const RESPONSIVE_LAYOUT_FIELDS: Record<NonNullable<BlockDefinition["responsiveLayout"]>, FieldDefinition[]> = {
  "text-image": [
    {
      key: "_appearance.layout.mobileOrder",
      label: "Sur mobile",
      type: "select",
      widget: "segmented",
      help: "Choisit quel élément apparaît en premier sur téléphone.",
      options: [
        { value: "default", label: "Automatique" },
        { value: "text-first", label: "Texte d'abord" },
        { value: "image-first", label: "Image d'abord" },
      ],
    },
    {
      key: "_appearance.layout.tabletLayout",
      label: "Sur tablette",
      type: "select",
      widget: "segmented",
      help: "Garde les éléments l'un sous l'autre ou les affiche côte à côte.",
      options: [
        { value: "default", label: "Automatique" },
        { value: "stacked", label: "L'un sous l'autre" },
        { value: "two-columns", label: "2 colonnes" },
      ],
    },
    {
      key: "_appearance.layout.desktopLayout",
      label: "Sur bureau",
      type: "select",
      widget: "segmented",
      help: "Garde les éléments l'un sous l'autre ou les affiche côte à côte.",
      options: [
        { value: "default", label: "Automatique" },
        { value: "stacked", label: "L'un sous l'autre" },
        { value: "two-columns", label: "2 colonnes" },
      ],
    },
  ],
  "card-grid": [
    {
      key: "_appearance.layout.tabletColumns",
      label: "Sur tablette",
      type: "select",
      widget: "segmented",
      help: "Nombre de cartes par ligne. Sur mobile, les cartes restent sur une colonne pour rester lisibles.",
      options: [
        { value: "default", label: "Automatique" },
        { value: "1", label: "1 colonne" },
        { value: "2", label: "2 colonnes" },
      ],
    },
    {
      key: "_appearance.layout.desktopColumns",
      label: "Sur bureau",
      type: "select",
      widget: "segmented",
      help: "Nombre de cartes par ligne sur un grand écran.",
      options: [
        { value: "default", label: "Automatique" },
        { value: "1", label: "1 colonne" },
        { value: "2", label: "2 colonnes" },
        { value: "3", label: "3 colonnes" },
      ],
    },
  ],
};

const GROUPS: Array<{
  id: FieldGroupId;
  title: string;
  icon: LucideIcon;
  description: string;
  defaultOpen: boolean;
}> = [
  { id: "content", title: "Textes", icon: Type, description: "Ce qui est écrit dans le bloc", defaultOpen: true },
  { id: "button", title: "Bouton", icon: MousePointerClick, description: "Bouton d'action et sa destination", defaultOpen: true },
  { id: "media", title: "Images", icon: Images, description: "Photos affichées dans le bloc", defaultOpen: true },
  { id: "design", title: "Apparence", icon: Palette, description: "Fond, couleurs, largeur et espacements", defaultOpen: false },
  { id: "animation", title: "Animation", icon: Sparkles, description: "Effet quand le bloc apparaît à l'écran", defaultOpen: false },
  { id: "advanced", title: "Avancé", icon: SlidersHorizontal, description: "Réglages rarement utiles", defaultOpen: false },
];

function getFieldGroup(field: FieldDefinition): FieldGroupId {
  if (field.group) return field.group;
  if (field.type === "button") return "button";
  if (field.type === "color") return "design";
  if (field.type === "image" || (field.type === "array" && field.arrayItemType === "image")) return "media";
  return "content";
}

interface BlockEditorProps {
  section: PageSection;
  definition: BlockDefinition;
  onUpdate: (updates: Partial<PageSection>) => void;
  token: string;
}

export function BlockEditor({ section, definition, onUpdate, token }: BlockEditorProps) {
  const isHeroType = ["hero-home", "hero", "hero-simple", "hero-compact"].includes(section.type);

  // S'assurer que le contenu est un objet valide (pas un tableau vide ou undefined)
  const safeContent = (
    section.content && typeof section.content === "object" && !Array.isArray(section.content)
      ? section.content
      : definition.defaultContent
  ) as Record<string, unknown>;

  function readPath(source: Record<string, unknown>, path: string): unknown {
    let value: unknown = source;

    for (const key of path.split(".")) {
      if (value === null || value === undefined || typeof value !== "object") {
        return undefined;
      }
      value = (value as Record<string, unknown>)[key];
    }

    return value;
  }

  function getValue(path: string): unknown {
    return readPath(safeContent, path);
  }

  /** Valeur enregistree, ou valeur par defaut du bloc si le champ n'a jamais ete rempli. */
  function getValueOrDefault(path: string): unknown {
    return getValue(path) ?? readPath(definition.defaultContent, path) ?? APPEARANCE_DEFAULTS[path];
  }

  function setValues(patch: Record<string, unknown>) {
    const newContent = JSON.parse(JSON.stringify(safeContent)) as Record<string, unknown>;

    for (const [path, nextValue] of Object.entries(patch)) {
      const keys = path.split(".");
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
    }

    onUpdate({ content: newContent });
  }

  function setValue(path: string, nextValue: unknown) {
    setValues({ [path]: nextValue });
  }

  function isFieldVisible(field: FieldDefinition): boolean {
    if (!field.showIf) return true;

    const current = String(getValueOrDefault(field.showIf.key) ?? "");
    if (field.showIf.in && !field.showIf.in.includes(current)) return false;
    if (field.showIf.notIn && field.showIf.notIn.includes(current)) return false;
    return true;
  }

  function renderField(field: FieldDefinition) {
    if (field.type === "button" && field.buttonKeys) {
      const keys = field.buttonKeys;
      const newTabValue = keys.newTab ? getValue(keys.newTab) : undefined;

      return (
        <ButtonField
          key={field.key}
          token={token}
          withNewTab={Boolean(keys.newTab)}
          textPlaceholder={field.placeholder}
          value={{
            text: (getValue(keys.text) as string) ?? "",
            link: (getValue(keys.link) as string) ?? "",
            newTab: newTabValue === true || newTabValue === "true",
          }}
          onChange={(next) =>
            setValues({
              [keys.text]: next.text,
              [keys.link]: next.link,
              ...(keys.newTab ? { [keys.newTab]: next.newTab ? "true" : "false" } : {}),
            })
          }
        />
      );
    }

    const value = field.type === "select" || field.type === "toggle" ? getValueOrDefault(field.key) : getValue(field.key);

    return (
      <FieldRenderer
        key={field.key}
        field={field}
        value={value}
        onChange={(nextValue) => setValue(field.key, nextValue)}
        token={token}
      />
    );
  }

  const visibleFields = definition.fields.filter(isFieldVisible);
  const animationValue = String(getValueOrDefault("animation") ?? "fade-up");
  const delayValue = String(getValue("animationDelay") ?? 0);
  const delayOptions = ANIMATION_DELAY_OPTIONS.some((option) => option.value === delayValue)
    ? ANIMATION_DELAY_OPTIONS
    : [...ANIMATION_DELAY_OPTIONS, { value: delayValue, label: `${delayValue.replace(".", ",")} s` }];

  return (
    <div className="space-y-3">
      {GROUPS.map((group) => {
        const fields = visibleFields.filter((field) => getFieldGroup(field) === group.id);
        const appearanceFields = group.id === "design" ? APPEARANCE_FIELDS : [];
        const visibilityFields = group.id === "design" ? VISIBILITY_FIELDS : [];
        const responsiveLayoutFields = group.id === "design" && definition.responsiveLayout
          ? RESPONSIVE_LAYOUT_FIELDS[definition.responsiveLayout]
          : [];
        const hasGenericAnimation = group.id === "animation" && !isHeroType;
        const hasBlockName = group.id === "advanced";

        if (
          fields.length === 0 &&
          appearanceFields.length === 0 &&
          visibilityFields.length === 0 &&
          responsiveLayoutFields.length === 0 &&
          !hasGenericAnimation &&
          !hasBlockName
        ) {
          return null;
        }

        return (
          <FieldGroup
            key={group.id}
            title={group.title}
            icon={group.icon}
            description={group.description}
            defaultOpen={group.defaultOpen}
          >
            {fields.map(renderField)}

            {appearanceFields.length > 0 ? (
              <div className={fields.length > 0 ? "space-y-4 border-t border-stone-100 pt-4" : "space-y-4"}>
                {fields.length > 0 ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Cadre du bloc</p>
                ) : null}
                {appearanceFields.map(renderField)}
              </div>
            ) : null}

            {visibilityFields.length > 0 ? (
              <div className="space-y-4 border-t border-stone-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Affichage selon l&apos;écran</p>
                {visibilityFields.map(renderField)}
              </div>
            ) : null}

            {responsiveLayoutFields.length > 0 ? (
              <div className="space-y-4 border-t border-stone-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Disposition responsive</p>
                {responsiveLayoutFields.map(renderField)}
              </div>
            ) : null}

            {hasGenericAnimation ? (
              <>
                <SelectField
                  field={{
                    key: "animation",
                    label: "Effet d'apparition",
                    type: "select",
                    help: "Mouvement joué quand le visiteur fait défiler la page jusqu'à ce bloc.",
                    options: ANIMATION_OPTIONS,
                  }}
                  value={animationValue}
                  onChange={(nextValue) => setValue("animation", nextValue)}
                />
                {animationValue !== "none" ? (
                  <SegmentedControl
                    label="Délai avant l'effet"
                    help="Temps d'attente avant que l'effet démarre. Utile pour faire apparaître les blocs l'un après l'autre."
                    value={delayValue}
                    options={delayOptions}
                    onChange={(nextValue) => setValue("animationDelay", Number.parseFloat(nextValue) || 0)}
                  />
                ) : null}
              </>
            ) : null}

            {hasBlockName ? (
              <div>
                <FieldLabel
                  label="Nom du bloc"
                  htmlFor={`block-name-${section.key}`}
                  optional
                  help="Visible uniquement dans l'administration, pour reconnaître ce bloc dans la liste (ex. « Carte cabinet Paris »). N'apparaît pas sur le site."
                />
                <Input
                  id={`block-name-${section.key}`}
                  type="text"
                  value={section.title ?? ""}
                  onChange={(event) => onUpdate({ title: event.target.value || null })}
                  placeholder={definition.label}
                />
              </div>
            ) : null}
          </FieldGroup>
        );
      })}
    </div>
  );
}
