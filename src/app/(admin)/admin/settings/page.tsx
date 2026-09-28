"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SettingsForm } from "@/components/admin/editors/SettingsForm";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";
import {
  deleteFavicon,
  deleteLogo,
  fetchSettings,
  revalidateFrontend,
  updateSettings,
  uploadFavicon,
  uploadLogo,
} from "@/lib/api-admin";
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
    locations: [],
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
    addressDisplay: "all",
    selectedAddressIndex: 0,
    addressSummary: "Deux lieux pour les massages",
    showHours: false,
    customDescription: null,
    mentionsLegalesText: "Mentions legales",
    showMentionsLegales: true,
    style: "light",
    backgroundColor: "",
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

  async function runAssetAction(
    kind: "logo" | "favicon",
    action: (token: string) => Promise<string | null>,
    successMessage: string,
    fallbackError: string,
  ) {
    if (!token) return;
    const setBusy = kind === "logo" ? setUploadingLogo : setUploadingFavicon;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const path = await action(token);
      setSettings((prev) => ({ ...prev, general: { ...prev.general, [kind]: path } }));
      await revalidateFrontend();
      setSuccess(successMessage);
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        clearTokenFromStorage();
        router.replace("/admin/login");
        return;
      }
      setError(err instanceof Error ? err.message : fallbackError);
    } finally {
      setBusy(false);
    }
  }

  function handleUploadLogo(file: File) {
    return runAssetAction("logo", async (t) => (await uploadLogo(t, file)).path, "Logo mis a jour.", "Erreur upload logo.");
  }

  function handleUploadFavicon(file: File) {
    return runAssetAction("favicon", async (t) => (await uploadFavicon(t, file)).path, "Favicon mis a jour.", "Erreur upload favicon.");
  }

  function handleDeleteLogo() {
    return runAssetAction("logo", async (t) => { await deleteLogo(t); return null; }, "Logo supprime.", "Erreur suppression logo.");
  }

  function handleDeleteFavicon() {
    return runAssetAction("favicon", async (t) => { await deleteFavicon(t); return null; }, "Favicon supprime.", "Erreur suppression favicon.");
  }

  if (!mounted || !token || loading) {
    return <section className="bo-card p-6">Chargement...</section>;
  }

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p> : null}
      {success ? <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{success}</p> : null}
      <SettingsForm
        token={token}
        settings={settings}
        saving={saving}
        uploadingLogo={uploadingLogo}
        uploadingFavicon={uploadingFavicon}
        onChange={setSettings}
        onSave={handleSave}
        onUploadLogo={handleUploadLogo}
        onUploadFavicon={handleUploadFavicon}
        onDeleteLogo={handleDeleteLogo}
        onDeleteFavicon={handleDeleteFavicon}
      />
    </div>
  );
}
