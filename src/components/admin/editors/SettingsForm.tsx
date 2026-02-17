"use client";

import { useRef } from "react";
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
    <section className="bo-card space-y-6 p-6">
      <div>
        <p className="bo-label">Parametres</p>
        <h2 className="mt-2 text-2xl font-semibold">Parametres du site</h2>
      </div>

      <div className="space-y-6 rounded-lg border border-stone-200 p-4">
        <h3 className="text-lg font-semibold">Informations generales</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Nom du site</label>
            <input
              className="bo-input"
              value={settings.general.siteName}
              onChange={(event) => onChange({ ...settings, general: { ...settings.general, siteName: event.target.value } })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Meta description par defaut</label>
            <input
              className="bo-input"
              value={settings.general.defaultMetaDescription}
              onChange={(event) =>
                onChange({
                  ...settings,
                  general: { ...settings.general, defaultMetaDescription: event.target.value },
                })
              }
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Logo</label>
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
            <button type="button" className="bo-button-primary" disabled={uploadingLogo} onClick={() => logoInputRef.current?.click()}>
              {uploadingLogo ? "Upload..." : "Uploader logo"}
            </button>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Favicon</label>
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
            <button type="button" className="bo-button-primary" disabled={uploadingFavicon} onClick={() => faviconInputRef.current?.click()}>
              {uploadingFavicon ? "Upload..." : "Uploader favicon"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-lg border border-stone-200 p-4">
        <h3 className="text-lg font-semibold">Coordonnees</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            className="bo-input"
            placeholder="Rue"
            value={settings.contact.address.street}
            onChange={(event) =>
              onChange({
                ...settings,
                contact: { ...settings.contact, address: { ...settings.contact.address, street: event.target.value } },
              })
            }
          />
          <input
            className="bo-input"
            placeholder="Code postal"
            value={settings.contact.address.postalCode}
            onChange={(event) =>
              onChange({
                ...settings,
                contact: { ...settings.contact, address: { ...settings.contact.address, postalCode: event.target.value } },
              })
            }
          />
          <input
            className="bo-input"
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
          <input
            className="bo-input"
            placeholder="Telephone"
            value={settings.contact.phone}
            onChange={(event) => onChange({ ...settings, contact: { ...settings.contact, phone: event.target.value } })}
          />
          <input
            className="bo-input"
            placeholder="Email"
            value={settings.contact.email}
            onChange={(event) => onChange({ ...settings, contact: { ...settings.contact, email: event.target.value } })}
          />
        </div>
        <input
          className="bo-input"
          placeholder="Google Maps URL"
          value={settings.contact.googleMapsUrl ?? ""}
          onChange={(event) => onChange({ ...settings, contact: { ...settings.contact, googleMapsUrl: event.target.value || null } })}
        />
        <textarea
          className="bo-input"
          placeholder="Google Maps embed URL"
          rows={2}
          value={settings.contact.googleMapsEmbed ?? ""}
          onChange={(event) => onChange({ ...settings, contact: { ...settings.contact, googleMapsEmbed: event.target.value || null } })}
        />
      </div>

      <div className="space-y-6 rounded-lg border border-stone-200 p-4">
        <h3 className="text-lg font-semibold">Horaires</h3>
        <div className="space-y-2">
          {settings.hours.schedule.map((item, index) => (
            <div key={`${item.days}-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input
                className="bo-input"
                placeholder="Jours"
                value={item.days}
                onChange={(event) => {
                  const next = [...settings.hours.schedule];
                  next[index] = { ...next[index], days: event.target.value };
                  onChange({ ...settings, hours: { ...settings.hours, schedule: next } });
                }}
              />
              <input
                className="bo-input"
                placeholder="Horaires"
                value={item.hours}
                onChange={(event) => {
                  const next = [...settings.hours.schedule];
                  next[index] = { ...next[index], hours: event.target.value };
                  onChange({ ...settings, hours: { ...settings.hours, schedule: next } });
                }}
              />
              <button
                type="button"
                className="rounded-md border border-rose-200 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
                onClick={() => onChange({ ...settings, hours: { ...settings.hours, schedule: settings.hours.schedule.filter((_, i) => i !== index) } })}
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-md border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:border-amber-500 hover:text-amber-700"
            onClick={() =>
              onChange({
                ...settings,
                hours: { ...settings.hours, schedule: [...settings.hours.schedule, { days: "", hours: "" }] },
              })
            }
          >
            Ajouter un creneau
          </button>
        </div>
        <input
          className="bo-input"
          placeholder="Message fermeture"
          value={settings.hours.closedMessage}
          onChange={(event) => onChange({ ...settings, hours: { ...settings.hours, closedMessage: event.target.value } })}
        />
      </div>

      <div className="space-y-6 rounded-lg border border-stone-200 p-4">
        <h3 className="text-lg font-semibold">Reseaux sociaux</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            className="bo-input"
            placeholder="Instagram"
            value={settings.social.instagram ?? ""}
            onChange={(event) => onChange({ ...settings, social: { ...settings.social, instagram: event.target.value || null } })}
          />
          <input
            className="bo-input"
            placeholder="Facebook"
            value={settings.social.facebook ?? ""}
            onChange={(event) => onChange({ ...settings, social: { ...settings.social, facebook: event.target.value || null } })}
          />
          <input
            className="bo-input"
            placeholder="LinkedIn"
            value={settings.social.linkedin ?? ""}
            onChange={(event) => onChange({ ...settings, social: { ...settings.social, linkedin: event.target.value || null } })}
          />
        </div>
      </div>

      <div className="space-y-6 rounded-lg border border-stone-200 p-4">
        <h3 className="text-lg font-semibold">Reservations</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="bo-input"
            placeholder="Email notification"
            value={settings.booking.notificationEmail}
            onChange={(event) => onChange({ ...settings, booking: { ...settings.booking, notificationEmail: event.target.value } })}
          />
          <input
            className="bo-input"
            type="number"
            min={0}
            placeholder="Delai minimum (heures)"
            value={settings.booking.minDelayHours}
            onChange={(event) =>
              onChange({ ...settings, booking: { ...settings.booking, minDelayHours: Number(event.target.value || 0) } })
            }
          />
        </div>
        <textarea
          className="bo-input"
          rows={3}
          placeholder="Message de confirmation"
          value={settings.booking.confirmationMessage}
          onChange={(event) => onChange({ ...settings, booking: { ...settings.booking, confirmationMessage: event.target.value } })}
        />
      </div>

      <div className="space-y-6 rounded-lg border border-stone-200 p-4">
        <h3 className="text-lg font-semibold">Apparence</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="bo-input"
            type="color"
            value={settings.appearance.primaryColor}
            onChange={(event) => onChange({ ...settings, appearance: { ...settings.appearance, primaryColor: event.target.value } })}
          />
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.appearance.darkModeDefault}
              onChange={(event) => onChange({ ...settings, appearance: { ...settings.appearance, darkModeDefault: event.target.checked } })}
            />
            Mode sombre par defaut
          </label>
        </div>
      </div>

      <div className="space-y-6 rounded-lg border border-stone-200 p-4">
        <h3 className="text-lg font-semibold">Footer</h3>
        <input
          className="bo-input"
          placeholder="Copyright"
          value={settings.footer.copyrightText}
          onChange={(event) => onChange({ ...settings, footer: { ...settings.footer, copyrightText: event.target.value } })}
        />
        <div className="space-y-2">
          {settings.footer.quickLinks.map((link, index) => (
            <div key={`${link.label}-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input
                className="bo-input"
                placeholder="Label"
                value={link.label}
                onChange={(event) => {
                  const next = [...settings.footer.quickLinks];
                  next[index] = { ...next[index], label: event.target.value };
                  onChange({ ...settings, footer: { ...settings.footer, quickLinks: next } });
                }}
              />
              <input
                className="bo-input"
                placeholder="URL"
                value={link.url}
                onChange={(event) => {
                  const next = [...settings.footer.quickLinks];
                  next[index] = { ...next[index], url: event.target.value };
                  onChange({ ...settings, footer: { ...settings.footer, quickLinks: next } });
                }}
              />
              <button
                type="button"
                className="rounded-md border border-rose-200 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
                onClick={() =>
                  onChange({
                    ...settings,
                    footer: { ...settings.footer, quickLinks: settings.footer.quickLinks.filter((_, i) => i !== index) },
                  })
                }
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-md border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:border-amber-500 hover:text-amber-700"
            onClick={() =>
              onChange({
                ...settings,
                footer: { ...settings.footer, quickLinks: [...settings.footer.quickLinks, { label: "", url: "" }] },
              })
            }
          >
            Ajouter un lien
          </button>
        </div>
      </div>

      <button type="button" className="bo-button-primary" disabled={saving} onClick={() => void onSave()}>
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </section>
  );
}
