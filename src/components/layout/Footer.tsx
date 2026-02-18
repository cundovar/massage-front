"use client";

import { useEffect, useMemo, useState } from "react";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import type { PublicSettings } from "@/types/settings";

const FALLBACK_SETTINGS: PublicSettings = {
  general: {
    siteName: "Helene Massage & Ayurveda",
    logo: null,
    favicon: null,
    defaultMetaDescription: "Massages ayurvediques, reflexologie et Kobido a Paris.",
  },
  contact: {
    address: { street: "123 Rue du Bien-Etre", postalCode: "75011", city: "Paris" },
    phone: "06 12 34 56 78",
    email: "contact@helene-massage.fr",
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
  social: { instagram: null, facebook: null, linkedin: null },
  booking: {
    minDelayHours: 24,
    confirmationMessage: "Merci pour votre demande. Je vous recontacte dans les 24h.",
  },
  appearance: { primaryColor: "#D4A574", darkModeDefault: false },
  footer: {
    copyrightText: "© 2024 Helene Massage & Ayurveda",
    quickLinks: [
      { label: "Accueil", url: "/" },
      { label: "Soins", url: "/soins" },
      { label: "À propos", url: "/a-propos" },
      { label: "Contact", url: "/contact" },
    ],
  },
};

function isInternalUrl(url: string): boolean {
  return url.startsWith("/");
}

export function Footer() {
  const [settings, setSettings] = useState<PublicSettings>(FALLBACK_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

    async function refreshSettings() {
      try {
        const response = await fetch(`${baseUrl}/api/settings`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as PublicSettings;
        if (!cancelled && data?.general?.siteName) {
          setSettings(data);
        }
      } catch {
        // Keep fallback settings
      }
    }

    void refreshSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  const quickLinks = useMemo(() => {
    if (settings.footer.quickLinks.length > 0) return settings.footer.quickLinks;
    return FALLBACK_SETTINGS.footer.quickLinks;
  }, [settings.footer.quickLinks]);

  const addressLine = [settings.contact.address.postalCode, settings.contact.address.city].filter(Boolean).join(" ");
  const telHref = settings.contact.phone.replace(/\s+/g, "");

  return (
    <footer className="bg-gray-900 py-16 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="mb-4 text-2xl font-serif">{settings.general.siteName}</h3>
            <p className="mb-6 max-w-md text-gray-400">{settings.general.defaultMetaDescription}</p>
            <div className="flex gap-4">
              {settings.social.instagram ? (
                <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white">
                  Instagram
                </a>
              ) : null}
              {settings.social.facebook ? (
                <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white">
                  Facebook
                </a>
              ) : null}
              {settings.social.linkedin ? (
                <a href={settings.social.linkedin} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white">
                  LinkedIn
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-medium">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link) => (
                <li key={`${link.label}-${link.url}`}>
                  {isInternalUrl(link.url) ? (
                    <TransitionLink href={link.url} className="transition hover:text-white">
                      {link.label}
                    </TransitionLink>
                  ) : (
                    <a href={link.url} className="transition hover:text-white" target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>{settings.contact.address.street}</li>
              <li>{addressLine}</li>
              <li className="pt-2">
                <a href={`tel:${telHref}`} className="transition hover:text-white">
                  {settings.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.contact.email}`} className="transition hover:text-white">
                  {settings.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-sm text-gray-500 md:flex-row">
          <p>{settings.footer.copyrightText || FALLBACK_SETTINGS.footer.copyrightText}</p>
          <TransitionLink href="/mentions-legales" className="transition hover:text-white">
            Mentions légales
          </TransitionLink>
        </div>
      </div>
    </footer>
  );
}
