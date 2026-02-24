"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Info } from "lucide-react";
import {
  Button,
  Card,
  FormField,
  FormSection,
  Input,
  PageLinkPicker,
  Switch,
  Textarea,
} from "@/components/admin/ui";
import type { SiteSettings } from "@/types/settings";

interface FooterFormProps {
  token: string;
  settings: SiteSettings;
  saving: boolean;
  onChange: (next: SiteSettings) => void;
  onSave: () => Promise<void>;
}

export function FooterForm({ token, settings, saving, onChange, onSave }: FooterFormProps) {
  const [showContactSync, setShowContactSync] = useState(false);

  return (
    <Card className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Configuration</p>
        <h2 className="mt-2 text-2xl font-semibold">Bas de page (Footer)</h2>
        <p className="mt-1 text-sm text-stone-500">
          Personnalisez le contenu et l&apos;apparence du bas de page de votre site.
        </p>
      </div>

      {/* Sections a afficher */}
      <FormSection title="Sections a afficher" description="Choisissez quels elements apparaissent dans le footer">
        <div className="space-y-3">
          <Switch
            label="Afficher les liens de navigation"
            checked={true}
            disabled
            onChange={() => {}}
          />
          <Switch
            label="Afficher les informations de contact"
            checked={settings.footer.showContactInfo ?? true}
            onChange={(e) =>
              onChange({
                ...settings,
                footer: { ...settings.footer, showContactInfo: e.target.checked },
              })
            }
          />
          <Switch
            label="Afficher les reseaux sociaux"
            checked={settings.footer.showSocialLinks ?? true}
            onChange={(e) =>
              onChange({
                ...settings,
                footer: { ...settings.footer, showSocialLinks: e.target.checked },
              })
            }
          />
          <Switch
            label="Afficher les horaires"
            checked={settings.footer.showHours ?? false}
            onChange={(e) =>
              onChange({
                ...settings,
                footer: { ...settings.footer, showHours: e.target.checked },
              })
            }
          />
          <Switch
            label="Afficher le lien Mentions legales"
            checked={settings.footer.showMentionsLegales ?? true}
            onChange={(e) =>
              onChange({
                ...settings,
                footer: { ...settings.footer, showMentionsLegales: e.target.checked },
              })
            }
          />
        </div>
      </FormSection>

      {/* Liens rapides */}
      <FormSection title="Liens de navigation" description="Les liens affiches dans la colonne Navigation du footer">
        <div className="space-y-2">
          {settings.footer.quickLinks.map((link, index) => (
            <div key={`link-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder="Label (ex: Accueil)"
                value={link.label}
                onChange={(e) => {
                  const next = [...settings.footer.quickLinks];
                  next[index] = { ...next[index], label: e.target.value };
                  onChange({ ...settings, footer: { ...settings.footer, quickLinks: next } });
                }}
              />
              <PageLinkPicker
                token={token}
                value={link.url}
                onChange={(url) => {
                  const next = [...settings.footer.quickLinks];
                  next[index] = { ...next[index], url };
                  onChange({ ...settings, footer: { ...settings.footer, quickLinks: next } });
                }}
                placeholder="/, /contact ou https://..."
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() =>
                  onChange({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      quickLinks: settings.footer.quickLinks.filter((_, i) => i !== index),
                    },
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              onChange({
                ...settings,
                footer: {
                  ...settings.footer,
                  quickLinks: [...settings.footer.quickLinks, { label: "", url: "" }],
                },
              })
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Ajouter un lien
          </Button>
        </div>
      </FormSection>

      {/* Description personnalisee */}
      <FormSection title="Description" description="Texte affiche sous le nom du site">
        <Textarea
          placeholder="Laissez vide pour utiliser la meta description par defaut"
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
          Si vide, la description par defaut sera utilisee : &quot;{settings.general.defaultMetaDescription}&quot;
        </p>
      </FormSection>

      {/* Copyright */}
      <FormSection title="Copyright et mentions">
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
        <FormField label="Texte du lien Mentions legales">
          <Input
            placeholder="Mentions legales"
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
        title="Coordonnees"
        description={
          <span className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            Synchronisees avec les parametres de contact
          </span>
        }
      >
        <button
          type="button"
          onClick={() => setShowContactSync(!showContactSync)}
          className="flex w-full items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-left text-sm hover:bg-stone-100"
        >
          <span>
            {settings.contact.address.street || "Adresse non definie"},{" "}
            {settings.contact.address.postalCode} {settings.contact.address.city}
          </span>
          {showContactSync ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showContactSync && (
          <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs text-amber-700">
              Ces informations sont partagees avec la page Contact et les autres sections du site.
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
                placeholder="Telephone"
                value={settings.contact.phone}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    contact: { ...settings.contact, phone: e.target.value },
                  })
                }
              />
              <Input
                placeholder="Email"
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
          title="Reseaux sociaux"
          description={
            <span className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              Synchronises avec les parametres generaux
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
