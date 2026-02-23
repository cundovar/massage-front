"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SettingsForm } from "@/components/admin/editors/SettingsForm";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import { fetchSettings, revalidateFrontend, updateSettings, uploadFavicon, uploadLogo } from "@/lib/api-admin";
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
  },
  footer: {
    copyrightText: "© 2024 Helene Massage & Ayurveda",
    quickLinks: [],
  },
  navigation: {
    externalLinks: [],
  },
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
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
        setSettings(data);
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
      setSettings(updated);
      // Revalider le cache frontend pour refléter les changements
      await revalidateFrontend();
      setSuccess("Parametres enregistres.");
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

  async function handleUploadLogo(file: File) {
    if (!token) return;
    setUploadingLogo(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await uploadLogo(token, file);
      setSettings((prev) => ({ ...prev, general: { ...prev.general, logo: result.path } }));
      setSuccess("Logo mis a jour.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur upload logo.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleUploadFavicon(file: File) {
    if (!token) return;
    setUploadingFavicon(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await uploadFavicon(token, file);
      setSettings((prev) => ({ ...prev, general: { ...prev.general, favicon: result.path } }));
      setSuccess("Favicon mis a jour.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur upload favicon.");
    } finally {
      setUploadingFavicon(false);
    }
  }

  if (!mounted || !token || loading) {
    return <section className="bo-card p-6">Chargement...</section>;
  }

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p> : null}
      {success ? <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{success}</p> : null}
      <SettingsForm
        settings={settings}
        saving={saving}
        uploadingLogo={uploadingLogo}
        uploadingFavicon={uploadingFavicon}
        onChange={setSettings}
        onSave={handleSave}
        onUploadLogo={handleUploadLogo}
        onUploadFavicon={handleUploadFavicon}
      />
    </div>
  );
}
