"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Clock,
  Info,
  MapPin,
  Plus,
  Scale,
  Share2,
  Trash2,
} from "lucide-react";
import {
  Button,
  Card,
  ChoiceCards,
  ColorPicker,
  FieldLabel,
  IconButton,
  FormField,
  FormSection,
  Input,
  PageLinkPicker,
  Select,
  Textarea,
  ToggleRow,
} from "@/components/admin/ui";
import { hexToRgb, prefersDarkText } from "@/lib/color";
import type { FooterStyle, SiteSettings } from "@/types/settings";

/** Couleurs proposees pour un fond personnalise, accordees a l'univers bien-etre. */
const FOOTER_COLOR_PRESETS = [
  "#F5EBDD",
  "#E9D5B7",
  "#C8A27A",
  "#B4654A",
  "#8A9A7B",
  "#3F4A3C",
  "#5B4636",
  "#2B2A28",
];

/** Miniature d'un footer : fond + deux lignes de texte + trait du haut. */
function FooterSwatch({ background, textColor, dashed = false }: { background: string; textColor: string; dashed?: boolean }) {
  return (
    <span
      className={`relative block h-14 w-full overflow-hidden rounded-md border ${dashed ? "border-dashed border-stone-300" : "border-black/5"}`}
      style={{ background }}
    >
      <span
        className="absolute top-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full"
        style={{ background: "linear-gradient(90deg, transparent, var(--primary-start), var(--primary-end), transparent)" }}
      />
      <span className="absolute top-4 left-3 h-1.5 w-16 rounded-full" style={{ background: textColor }} />
      <span className="absolute top-7 left-3 h-1 w-24 rounded-full opacity-60" style={{ background: textColor }} />
      <span className="absolute top-10 left-3 h-1 w-12 rounded-full opacity-40" style={{ background: textColor }} />
    </span>
  );
}

const CHECKERBOARD = "repeating-conic-gradient(#f5f5f4 0 25%, #ffffff 0 50%) 0 0 / 12px 12px";

interface FooterFormProps {
  token: string;
  settings: SiteSettings;
  saving: boolean;
  onChange: (next: SiteSettings) => void;
  onSave: () => Promise<void>;
}

export function FooterForm({ token, settings, saving, onChange, onSave }: FooterFormProps) {
  const [showContactSync, setShowContactSync] = useState(false);
  const footerStyle: FooterStyle = settings.footer.style ?? "light";
  const customColor = settings.footer.backgroundColor ?? "";
  const hasCustomColor = hexToRgb(customColor) !== null;
  const customTextIsDark = hasCustomColor ? prefersDarkText(customColor) : true;
  const quickLinks = settings.footer.quickLinks;

  function updateFooter(patch: Partial<SiteSettings["footer"]>) {
    onChange({ ...settings, footer: { ...settings.footer, ...patch } });
  }

  function updateLink(index: number, patch: Partial<SiteSettings["footer"]["quickLinks"][number]>) {
    updateFooter({ quickLinks: quickLinks.map((link, i) => (i === index ? { ...link, ...patch } : link)) });
  }

  function moveLink(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= quickLinks.length) return;
    const next = [...quickLinks];
    [next[index], next[target]] = [next[target], next[index]];
    updateFooter({ quickLinks: next });
  }

  return (
    <Card className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Configuration</p>
        <h2 className="mt-2 text-2xl font-semibold">Bas de page (Footer)</h2>
        <p className="mt-1 text-sm text-stone-500">
          Personnalisez le contenu et l&apos;apparence du bas de page de votre site.
        </p>
      </div>

      {/* Apparence */}
      <FormSection
        title="Apparence"
        description="Couleur de fond du bas de page. Le texte s'adapte automatiquement pour rester lisible."
      >
        <ChoiceCards
          label="Style du bas de page"
          value={footerStyle}
          onChange={(value) =>
            onChange({ ...settings, footer: { ...settings.footer, style: value as FooterStyle } })
          }
          options={[
            {
              value: "light",
              label: "Clair",
              hint: "Sable très pâle, teinté par le thème",
              preview: (
                <FooterSwatch
                  background="color-mix(in srgb, var(--primary-start) 12%, var(--background))"
                  textColor="var(--text-primary)"
                />
              ),
            },
            {
              value: "theme",
              label: "Couleur du thème",
              hint: "Dégradé doux des couleurs du thème",
              preview: (
                <FooterSwatch
                  background="linear-gradient(145deg, color-mix(in srgb, var(--primary-start) 40%, var(--background)), color-mix(in srgb, var(--primary-end) 32%, var(--background)))"
                  textColor="var(--text-primary)"
                />
              ),
            },
            {
              value: "dark",
              label: "Sombre",
              hint: "Fond foncé du thème (ancien style)",
              preview: <FooterSwatch background="var(--footer-bg, #1c1917)" textColor="#ffffff" />,
            },
            {
              value: "transparent",
              label: "Transparent",
              hint: "Le fond de la page reste visible",
              preview: <FooterSwatch background={CHECKERBOARD} textColor="var(--text-primary)" dashed />,
            },
            {
              value: "custom",
              label: "Couleur au choix",
              hint: "Choisissez votre propre couleur",
              preview: (
                <FooterSwatch
                  background={hasCustomColor ? customColor : "#e7e5e4"}
                  textColor={customTextIsDark ? "#1c1917" : "#ffffff"}
                />
              ),
            },
          ]}
        />

        {footerStyle === "custom" ? (
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <FieldLabel
              as="span"
              label="Couleur de fond"
              help="Choisissez une couleur proposée ou saisissez un code couleur (#RRGGBB). Le texte passe en foncé ou en clair selon la couleur."
            />
            <div role="radiogroup" aria-label="Couleurs proposées" className="mb-3 flex flex-wrap gap-2">
              {FOOTER_COLOR_PRESETS.map((color) => {
                const isSelected = customColor.toUpperCase() === color;
                return (
                  <button
                    key={color}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Couleur ${color}`}
                    title={color}
                    onClick={() => onChange({ ...settings, footer: { ...settings.footer, backgroundColor: color } })}
                    className={`h-9 w-9 rounded-full border shadow-sm transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                      isSelected ? "border-stone-900 ring-2 ring-amber-500 ring-offset-2" : "border-black/10"
                    }`}
                    style={{ background: color }}
                  />
                );
              })}
            </div>
            <ColorPicker
              label="Autre couleur du bas de page"
              value={customColor}
              presets={FOOTER_COLOR_PRESETS}
              onChange={(color) =>
                onChange({ ...settings, footer: { ...settings.footer, backgroundColor: color.toUpperCase() } })
              }
            />
            <p className="mt-2 text-xs text-stone-500">
              {hasCustomColor
                ? `Texte affiché en ${customTextIsDark ? "foncé" : "clair"} pour rester lisible.`
                : "Tant qu'aucune couleur valide n'est choisie, le style « Clair » est utilisé."}
            </p>
          </div>
        ) : null}
      </FormSection>

      {/* Sections a afficher */}
      <FormSection title="Contenu du bas de page" description="Choisissez les éléments affichés en bas de chaque page.">
        <div className="space-y-2">
          <ToggleRow
            icon={MapPin}
            label="Coordonnées"
            description="Adresse, téléphone et e-mail"
            checked={settings.footer.showContactInfo ?? true}
            onChange={(checked) => updateFooter({ showContactInfo: checked })}
          />
          <ToggleRow
            icon={Clock}
            label="Horaires"
            description="Jours et heures d'ouverture"
            checked={settings.footer.showHours ?? false}
            onChange={(checked) => updateFooter({ showHours: checked })}
          />
          <ToggleRow
            icon={Share2}
            label="Réseaux sociaux"
            description="Liens Instagram, Facebook, LinkedIn"
            checked={settings.footer.showSocialLinks ?? true}
            onChange={(checked) => updateFooter({ showSocialLinks: checked })}
          />
          <ToggleRow
            icon={Scale}
            label="Lien « Mentions légales »"
            description="Obligatoire pour un site professionnel"
            checked={settings.footer.showMentionsLegales ?? true}
            onChange={(checked) => updateFooter({ showMentionsLegales: checked })}
          />
        </div>
        <p className="flex items-center gap-1.5 text-xs text-stone-500">
          <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Les liens de navigation sont toujours affichés.
        </p>
      </FormSection>

      {/* Liens rapides */}
      <FormSection
        title="Liens de navigation"
        description="Colonne « Navigation » du bas de page. Si le texte est vide, il reprend le nom de la page choisie."
      >
        {quickLinks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500">
            Aucun lien pour le moment.
          </p>
        ) : (
          <ol className="space-y-3">
            {quickLinks.map((link, index) => {
              const position = index + 1;
              const name = link.label.trim() || link.url || "Nouveau lien";
              return (
                <li key={`link-${index}`} className="min-w-0 rounded-xl border border-stone-200 bg-white">
                  <div className="flex items-center gap-2 border-b border-stone-100 px-3 py-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
                      {position}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-stone-800">{name}</span>
                    <IconButton
                      icon={<ArrowUp className="h-4 w-4" />}
                      label={`Monter le lien ${position}`}
                      title={`Monter le lien ${position}`}
                      variant="ghost"
                      disabled={index === 0}
                      onClick={() => moveLink(index, -1)}
                    />
                    <IconButton
                      icon={<ArrowDown className="h-4 w-4" />}
                      label={`Descendre le lien ${position}`}
                      title={`Descendre le lien ${position}`}
                      variant="ghost"
                      disabled={index === quickLinks.length - 1}
                      onClick={() => moveLink(index, 1)}
                    />
                    <IconButton
                      icon={<Trash2 className="h-4 w-4" />}
                      label={`Supprimer le lien ${position}`}
                      title={`Supprimer le lien ${position}`}
                      variant="ghost"
                      className="hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => updateFooter({ quickLinks: quickLinks.filter((_, i) => i !== index) })}
                    />
                  </div>
                  <div className="grid min-w-0 gap-3 p-3 md:grid-cols-2">
                    <div className="min-w-0">
                      <FieldLabel as="span" label="Page" />
                      <PageLinkPicker
                        token={token}
                        value={link.url}
                        showValue={false}
                        ariaLabel={`Page du lien ${position}`}
                        placeholder="/contact ou https://..."
                        onChange={(url, pageLabel) =>
                          updateLink(index, {
                            url,
                            ...(!link.label.trim() && pageLabel ? { label: pageLabel } : {}),
                          })
                        }
                    />
                    </div>
                    <div className="min-w-0">
                      <FieldLabel label="Texte affiché" htmlFor={`footer-link-label-${index}`} />
                      <Input
                        id={`footer-link-label-${index}`}
                        placeholder="Ex. Accueil"
                        value={link.label}
                        onChange={(event) => updateLink(index, { label: event.target.value })}
                    />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        <button
          type="button"
          onClick={() => updateFooter({ quickLinks: [...quickLinks, { label: "", url: "" }] })}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-amber-300 px-4 py-3 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter un lien
        </button>
      </FormSection>

      {/* Description personnalisee */}
      <FormSection title="Description" description="Texte affiché sous le nom du site">
        <Textarea
          placeholder="Laissez vide pour utiliser la description par défaut"
          rows={3}
          value={settings.footer.customDescription ?? ""}
          onChange={(e) =>
            onChange({
              ...settings,
              footer: { ...settings.footer, customDescription: e.target.value || null },
            })
          }
        />
        <p className="text-xs text-stone-500">
          Si vide, la description par défaut est utilisée : &quot;{settings.general.defaultMetaDescription}&quot;
        </p>
      </FormSection>

      {/* Copyright */}
      <FormSection title="Copyright et mentions légales">
        <FormField label="Texte de copyright">
          <Input
            placeholder="© 2024 Mon Site"
            value={settings.footer.copyrightText}
            onChange={(e) =>
              onChange({
                ...settings,
                footer: { ...settings.footer, copyrightText: e.target.value },
              })
            }
          />
        </FormField>
        <FormField label="Texte du lien « Mentions légales »">
          <Input
            placeholder="Mentions légales"
            value={settings.footer.mentionsLegalesText ?? "Mentions legales"}
            onChange={(e) =>
              onChange({
                ...settings,
                footer: { ...settings.footer, mentionsLegalesText: e.target.value },
              })
            }
          />
        </FormField>
      </FormSection>

      {/* Coordonnees (synchronisees) */}
      <FormSection
        title="Coordonnées"
        description={
          <span className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            Partagées avec la page Contact et les réglages
          </span>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Adresses affichées dans le footer">
            <Select
              value={settings.footer.addressDisplay}
              options={[
                { value: "all", label: "Tous les lieux" },
                { value: "selected", label: "Un lieu précis" },
                { value: "summary", label: "Texte simplifié" },
              ]}
              onChange={(event) => onChange({
                ...settings,
                footer: { ...settings.footer, addressDisplay: event.target.value as SiteSettings["footer"]["addressDisplay"] },
              })}
            />
          </FormField>
          {settings.footer.addressDisplay === "selected" ? (
            <FormField label="Lieu affiché">
              <Select
                value={String(settings.footer.selectedAddressIndex)}
                options={settings.contact.locations.map((location, index) => ({
                  value: String(index),
                  label: location.label || `Lieu ${index + 1}`,
                }))}
                onChange={(event) => onChange({
                  ...settings,
                  footer: { ...settings.footer, selectedAddressIndex: Number(event.target.value) },
                })}
              />
            </FormField>
          ) : null}
        </div>
        {settings.footer.addressDisplay === "summary" ? (
          <FormField label="Texte simplifié">
            <Input
              placeholder="Ex. Deux lieux pour les massages à Paris"
              value={settings.footer.addressSummary}
              onChange={(event) => onChange({
                ...settings,
                footer: { ...settings.footer, addressSummary: event.target.value },
              })}
            />
          </FormField>
        ) : null}
        <button
          type="button"
          onClick={() => setShowContactSync(!showContactSync)}
          className="flex w-full items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-left text-sm hover:bg-stone-100"
        >
          <span>
            Modifier l’adresse principale ({settings.contact.locations.length} lieu(x) partagé(s))
          </span>
          {showContactSync ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showContactSync && (
          <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs text-amber-700">
              Ces informations sont partagées avec la page Contact et les autres sections du site.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                placeholder="Rue"
                value={settings.contact.address.street}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      address: { ...settings.contact.address, street: e.target.value },
                    },
                  })
                }
              />
              <Input
                placeholder="Code postal"
                value={settings.contact.address.postalCode}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      address: { ...settings.contact.address, postalCode: e.target.value },
                    },
                  })
                }
              />
              <Input
                placeholder="Ville"
                value={settings.contact.address.city}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      address: { ...settings.contact.address, city: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Téléphone"
                value={settings.contact.phone}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    contact: { ...settings.contact, phone: e.target.value },
                  })
                }
              />
              <Input
                placeholder="E-mail"
                value={settings.contact.email}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    contact: { ...settings.contact, email: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}
      </FormSection>

      {/* Reseaux sociaux (synchronises) */}
      {(settings.footer.showSocialLinks ?? true) && (
        <FormSection
          title="Réseaux sociaux"
          description={
            <span className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              Partagés avec les réglages généraux
            </span>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="Instagram">
              <Input
                placeholder="https://instagram.com/..."
                value={settings.social.instagram ?? ""}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    social: { ...settings.social, instagram: e.target.value || null },
                  })
                }
              />
            </FormField>
            <FormField label="Facebook">
              <Input
                placeholder="https://facebook.com/..."
                value={settings.social.facebook ?? ""}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    social: { ...settings.social, facebook: e.target.value || null },
                  })
                }
              />
            </FormField>
            <FormField label="LinkedIn">
              <Input
                placeholder="https://linkedin.com/..."
                value={settings.social.linkedin ?? ""}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    social: { ...settings.social, linkedin: e.target.value || null },
                  })
                }
              />
            </FormField>
          </div>
        </FormSection>
      )}

      <Button type="button" loading={saving} onClick={() => void onSave()}>
        {saving ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
    </Card>
  );
}
