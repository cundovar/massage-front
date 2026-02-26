"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FooterForm } from "@/components/admin/editors/FooterForm";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { fetchSettings, revalidateFrontend, updateSettings } from "@/lib/api-admin";
import type { SiteSettings } from "@/types/settings";

const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    siteName: "Helene Massage & Ayurveda",
    logo: null,
    favicon: null,
    defaultMetaDescription: "Massages ayurvediques, reflexologie et Kobido a Paris.",
  },
  contact: {
    address: { street: "", postalCode: "", city: "" },
    phone: "",
    email: "",
    googleMapsUrl: null,
    googleMapsEmbed: null,
  },
  hours: {
    schedule: [
      { days: "Lundi - Vendredi", hours: "10h - 20h" },
      { days: "Samedi", hours: "10h - 18h" },
    ],
    closedMessage: "Ferme le dimanche",
  },
  social: {
    instagram: null,
    facebook: null,
    linkedin: null,
  },
  booking: {
    notificationEmail: "contact@helene-massage.fr",
    minDelayHours: 24,
    confirmationMessage: "Merci pour votre demande. Je vous recontacte dans les 24h.",
  },
  appearance: {
    themePreset: "ayurveda",
    useCustomAccent: false,
    customAccentColor: null,
    headerStyle: "sticky",
    showDarkModeToggle: true,
    bodyBackgroundImage: null,
  },
  footer: {
    copyrightText: "© 2024 Helene Massage & Ayurveda",
    quickLinks: [],
    showSocialLinks: true,
    showContactInfo: true,
    showHours: false,
    customDescription: null,
    mentionsLegalesText: "Mentions legales",
    showMentionsLegales: true,
  },
  navigation: {
    externalLinks: [],
  },
};

export default function AdminFooterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setToken(getTokenFromStorage());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    fetchSettings(token)
      .then((data) => {
        // Merge with defaults to ensure all new fields exist
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
          footer: {
            ...DEFAULT_SETTINGS.footer,
            ...data.footer,
          },
        });
        setError(null);
      })
      .catch((err: Error) => {
        if (err.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }
        setError("Impossible de charger les parametres.");
      })
      .finally(() => setLoading(false));
  }, [mounted, router, token]);

  async function handleSave() {
    if (!token) return;

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateSettings(token, settings);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...updated,
        footer: {
          ...DEFAULT_SETTINGS.footer,
          ...updated.footer,
        },
      });
      await revalidateFrontend();
      setSuccess("Footer enregistre avec succes.");
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        clearTokenFromStorage();
        router.replace("/admin/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Erreur de sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  if (!mounted || !token || loading) {
    return <section className="bo-card p-6">Chargement...</section>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {success}
        </p>
      )}
      <FooterForm
        token={token}
        settings={settings}
        saving={saving}
        onChange={setSettings}
        onSave={handleSave}
      />
    </div>
  );
}
