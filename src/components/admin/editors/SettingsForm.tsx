"use client";

import { useRef } from "react";
import { Button, Card, ColorPicker, FormField, FormSection, Input, Switch, Textarea } from "@/components/admin/ui";
import { getImageUrl } from "@/lib/api";
import type { SiteSettings } from "@/types/settings";

interface SettingsFormProps {
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

      <FormSection title="Reseaux sociaux">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Instagram"
            value={settings.social.instagram ?? ""}
            onChange={(event) => onChange({ ...settings, social: { ...settings.social, instagram: event.target.value || null } })}
          />
          <Input
            placeholder="Facebook"
            value={settings.social.facebook ?? ""}
            onChange={(event) => onChange({ ...settings, social: { ...settings.social, facebook: event.target.value || null } })}
          />
          <Input
            placeholder="LinkedIn"
            value={settings.social.linkedin ?? ""}
            onChange={(event) => onChange({ ...settings, social: { ...settings.social, linkedin: event.target.value || null } })}
          />
        </div>
      </FormSection>

      <FormSection title="Reservations">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Email notification"
            value={settings.booking.notificationEmail}
            onChange={(event) => onChange({ ...settings, booking: { ...settings.booking, notificationEmail: event.target.value } })}
          />
          <Input
            type="number"
            min={0}
            placeholder="Delai minimum (heures)"
            value={settings.booking.minDelayHours}
            onChange={(event) =>
              onChange({ ...settings, booking: { ...settings.booking, minDelayHours: Number(event.target.value || 0) } })
            }
          />
        </div>
        <Textarea
          rows={3}
          placeholder="Message de confirmation"
          value={settings.booking.confirmationMessage}
          onChange={(event) => onChange({ ...settings, booking: { ...settings.booking, confirmationMessage: event.target.value } })}
        />
      </FormSection>

      <FormSection title="Apparence">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Couleur principale">
            <ColorPicker
              value={settings.appearance.primaryColor}
              onChange={(color) => onChange({ ...settings, appearance: { ...settings.appearance, primaryColor: color } })}
            />
          </FormField>
          <Switch
            label="Mode sombre par defaut"
            checked={settings.appearance.darkModeDefault}
            onChange={(event) => onChange({ ...settings, appearance: { ...settings.appearance, darkModeDefault: event.target.checked } })}
          />
        </div>
      </FormSection>

      <FormSection title="Footer">
        <Input
          placeholder="Copyright"
          value={settings.footer.copyrightText}
          onChange={(event) => onChange({ ...settings, footer: { ...settings.footer, copyrightText: event.target.value } })}
        />
        <div className="space-y-2">
          {settings.footer.quickLinks.map((link, index) => (
            <div key={`${link.label}-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder="Label"
                value={link.label}
                onChange={(event) => {
                  const next = [...settings.footer.quickLinks];
                  next[index] = { ...next[index], label: event.target.value };
                  onChange({ ...settings, footer: { ...settings.footer, quickLinks: next } });
                }}
              />
              <Input
                placeholder="URL"
                value={link.url}
                onChange={(event) => {
                  const next = [...settings.footer.quickLinks];
                  next[index] = { ...next[index], url: event.target.value };
                  onChange({ ...settings, footer: { ...settings.footer, quickLinks: next } });
                }}
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() =>
                  onChange({
                    ...settings,
                    footer: { ...settings.footer, quickLinks: settings.footer.quickLinks.filter((_, i) => i !== index) },
                  })
                }
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
                footer: { ...settings.footer, quickLinks: [...settings.footer.quickLinks, { label: "", url: "" }] },
              })
            }
          >
            Ajouter un lien
          </Button>
        </div>
      </FormSection>

      <Button type="button" loading={saving} onClick={() => void onSave()}>
        {saving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </Card>
  );
}
