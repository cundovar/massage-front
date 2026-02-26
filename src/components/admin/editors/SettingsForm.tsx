"use client";

import { useRef } from "react";
import {
  Button,
  Card,
  Checkbox,
  ColorPicker,
  FormField,
  FormSection,
  Input,
  Select,
  Switch,
  Textarea,
  ThemeSelector,
} from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { getImageUrl } from "@/lib/api";
import type { HeaderStyle, SiteSettings, ThemePreset } from "@/types/settings";

interface SettingsFormProps {
  token: string;
  settings: SiteSettings;
  saving: boolean;
  uploadingLogo: boolean;
  uploadingFavicon: boolean;
  onChange: (next: SiteSettings) => void;
  onSave: () => Promise<void>;
  onUploadLogo: (file: File) => Promise<void>;
  onUploadFavicon: (file: File) => Promise<void>;
}

export function SettingsForm({
  token,
  settings,
  saving,
  uploadingLogo,
  uploadingFavicon,
  onChange,
  onSave,
  onUploadLogo,
  onUploadFavicon,
}: SettingsFormProps) {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const headerStyleOptions = [
    { value: "transparent", label: "Transparent (fond visible)" },
    { value: "solid", label: "Solid (couleur de fond)" },
    { value: "sticky", label: "Sticky (reste en haut au scroll)" },
  ];

  return (
    <Card className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Parametres</p>
        <h2 className="mt-2 text-2xl font-semibold">Parametres du site</h2>
      </div>

      <FormSection title="Informations generales">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Nom du site">
            <Input
              value={settings.general.siteName}
              onChange={(event) => onChange({ ...settings, general: { ...settings.general, siteName: event.target.value } })}
            />
          </FormField>
          <FormField label="Meta description par defaut">
            <Input
              value={settings.general.defaultMetaDescription}
              onChange={(event) =>
                onChange({
                  ...settings,
                  general: { ...settings.general, defaultMetaDescription: event.target.value },
                })
              }
            />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-stone-600">Logo</p>
            {settings.general.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getImageUrl(settings.general.logo) ?? settings.general.logo} alt="Logo" className="h-12 rounded border border-stone-200 bg-white p-1" />
            ) : null}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onUploadLogo(file);
                event.currentTarget.value = "";
              }}
            />
            <Button type="button" loading={uploadingLogo} onClick={() => logoInputRef.current?.click()}>
              {uploadingLogo ? "Upload..." : "Uploader logo"}
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-stone-600">Favicon</p>
            {settings.general.favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getImageUrl(settings.general.favicon) ?? settings.general.favicon} alt="Favicon" className="h-10 w-10 rounded border border-stone-200 bg-white p-1" />
            ) : null}
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onUploadFavicon(file);
                event.currentTarget.value = "";
              }}
            />
            <Button type="button" loading={uploadingFavicon} onClick={() => faviconInputRef.current?.click()}>
              {uploadingFavicon ? "Upload..." : "Uploader favicon"}
            </Button>
          </div>
        </div>
      </FormSection>

      <FormSection title="Coordonnees">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Rue"
            value={settings.contact.address.street}
            onChange={(event) =>
              onChange({
                ...settings,
                contact: { ...settings.contact, address: { ...settings.contact.address, street: event.target.value } },
              })
            }
          />
          <Input
            placeholder="Code postal"
            value={settings.contact.address.postalCode}
            onChange={(event) =>
              onChange({
                ...settings,
                contact: { ...settings.contact, address: { ...settings.contact.address, postalCode: event.target.value } },
              })
            }
          />
          <Input
            placeholder="Ville"
            value={settings.contact.address.city}
            onChange={(event) =>
              onChange({
                ...settings,
                contact: { ...settings.contact, address: { ...settings.contact.address, city: event.target.value } },
              })
            }
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Telephone"
            value={settings.contact.phone}
            onChange={(event) => onChange({ ...settings, contact: { ...settings.contact, phone: event.target.value } })}
          />
          <Input
            placeholder="Email"
            value={settings.contact.email}
            onChange={(event) => onChange({ ...settings, contact: { ...settings.contact, email: event.target.value } })}
          />
        </div>
        <Input
          placeholder="Google Maps URL"
          value={settings.contact.googleMapsUrl ?? ""}
          onChange={(event) => onChange({ ...settings, contact: { ...settings.contact, googleMapsUrl: event.target.value || null } })}
        />
        <Textarea
          placeholder="Google Maps embed URL"
          rows={2}
          value={settings.contact.googleMapsEmbed ?? ""}
          onChange={(event) => onChange({ ...settings, contact: { ...settings.contact, googleMapsEmbed: event.target.value || null } })}
        />
      </FormSection>

      <FormSection title="Horaires">
        <div className="space-y-2">
          {settings.hours.schedule.map((item, index) => (
            <div key={`${item.days}-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder="Jours"
                value={item.days}
                onChange={(event) => {
                  const next = [...settings.hours.schedule];
                  next[index] = { ...next[index], days: event.target.value };
                  onChange({ ...settings, hours: { ...settings.hours, schedule: next } });
                }}
              />
              <Input
                placeholder="Horaires"
                value={item.hours}
                onChange={(event) => {
                  const next = [...settings.hours.schedule];
                  next[index] = { ...next[index], hours: event.target.value };
                  onChange({ ...settings, hours: { ...settings.hours, schedule: next } });
                }}
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => onChange({ ...settings, hours: { ...settings.hours, schedule: settings.hours.schedule.filter((_, i) => i !== index) } })}
              >
                Supprimer
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              onChange({
                ...settings,
                hours: { ...settings.hours, schedule: [...settings.hours.schedule, { days: "", hours: "" }] },
              })
            }
          >
            Ajouter un creneau
          </Button>
        </div>
        <Input
          placeholder="Message fermeture"
          value={settings.hours.closedMessage}
          onChange={(event) => onChange({ ...settings, hours: { ...settings.hours, closedMessage: event.target.value } })}
        />
      </FormSection>

      <FormSection title="Apparence" description="Personnalisez le style visuel de votre site">
        <ThemeSelector
          value={settings.appearance.themePreset}
          onChange={(preset) =>
            onChange({
              ...settings,
              appearance: { ...settings.appearance, themePreset: preset as ThemePreset },
            })
          }
        />

        <FormField label="Style du header">
          <Select
            options={headerStyleOptions}
            value={settings.appearance.headerStyle}
            onChange={(event) =>
              onChange({
                ...settings,
                appearance: { ...settings.appearance, headerStyle: event.target.value as HeaderStyle },
              })
            }
          />
        </FormField>

        <div className="space-y-3">
          <Checkbox
            checked={settings.appearance.useCustomAccent}
            onChange={(event) =>
              onChange({
                ...settings,
                appearance: { ...settings.appearance, useCustomAccent: event.target.checked },
              })
            }
            label="Utiliser une couleur d'accent personnalisee"
          />

          {settings.appearance.useCustomAccent ? (
            <ColorPicker
              value={settings.appearance.customAccentColor || "#FFCE67"}
              onChange={(color) =>
                onChange({
                  ...settings,
                  appearance: { ...settings.appearance, customAccentColor: color },
                })
              }
            />
          ) : null}
        </div>

        <Switch
          label="Afficher le bouton dark/light mode"
          checked={settings.appearance.showDarkModeToggle}
          onChange={(event) =>
            onChange({
              ...settings,
              appearance: { ...settings.appearance, showDarkModeToggle: event.target.checked },
            })
          }
        />

        <FormField label="Image de fond du body (optionnel)">
          <div className="space-y-2">
            <MediaPicker
              token={token}
              value={settings.appearance.bodyBackgroundImage}
              onChange={(path) =>
                onChange({
                  ...settings,
                  appearance: { ...settings.appearance, bodyBackgroundImage: path },
                })
              }
            />
            <p className="text-xs text-stone-500">
              Cette image s&apos;affiche en fond global du site public.
            </p>
          </div>
        </FormField>
      </FormSection>

      <Button type="button" loading={saving} onClick={() => void onSave()}>
        {saving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </Card>
  );
}
