"use client";

import { useEffect, useMemo, useState } from "react";
import { FALLBACK_SETTINGS } from "@/lib/defaultContent";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import type { PublicSettings } from "@/types/settings";

function isInternalUrl(url: string): boolean {
  return url.startsWith("/");
}

function getFooterClassName(themePreset: PublicSettings["appearance"]["themePreset"]): string {
  const themeClasses: Record<PublicSettings["appearance"]["themePreset"], string> = {
    ayurveda: "footer-theme-ayurveda",
    "spa-luxe": "footer-theme-spa-luxe",
    nature: "footer-theme-nature",
    zen: "footer-theme-zen",
    energique: "footer-theme-energique",
  };

  return themeClasses[themePreset] ?? themeClasses.ayurveda;
}

interface FooterProps {
  initialSettings?: PublicSettings;
}

export function Footer({ initialSettings }: FooterProps) {
  const [settings, setSettings] = useState<PublicSettings>(initialSettings ?? FALLBACK_SETTINGS);

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
  const footerThemeClassName = getFooterClassName(settings.appearance.themePreset);

  return (
    <footer
      className={`site-footer ${footerThemeClassName} relative mx-4 mb-4 overflow-hidden py-16 md:mx-6`}
    >
      <div className="footer-pattern" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Titre + Description + Réseaux sociaux */}
          <div className="md:col-span-2">
            <h3 className="mb-4 text-2xl font-serif drop-shadow-sm">{settings.general.siteName}</h3>
            <p
              className="mb-6 max-w-md"
              style={{ color: "var(--footer-text-muted, #A8A29E)" }}
            >
              {settings.footer.customDescription || settings.general.defaultMetaDescription}
            </p>
            {(settings.footer.showSocialLinks ?? true) && (
              <div className="flex gap-4">
                {settings.social.instagram ? (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-link text-sm transition"
                    style={{ color: "var(--footer-text-muted, #A8A29E)" }}
                  >
                    Instagram
                  </a>
                ) : null}
                {settings.social.facebook ? (
                  <a
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-link text-sm transition"
                    style={{ color: "var(--footer-text-muted, #A8A29E)" }}
                  >
                    Facebook
                  </a>
                ) : null}
                {settings.social.linkedin ? (
                  <a
                    href={settings.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-link text-sm transition"
                    style={{ color: "var(--footer-text-muted, #A8A29E)" }}
                  >
                    LinkedIn
                  </a>
                ) : null}
              </div>
            )}
          </div>

          {/* Navigation + Contact : flex sur mobile, colonnes séparées sur desktop */}
          <div className="flex flex-row gap-8 md:contents">
            <div className="flex-1">
              <h4 className="mb-4 font-medium drop-shadow-sm">Navigation</h4>
              <ul className="space-y-2" style={{ color: "var(--footer-text-muted, #A8A29E)" }}>
                {quickLinks.map((link) => (
                  <li key={`${link.label}-${link.url}`}>
                    {isInternalUrl(link.url) ? (
                      <TransitionLink href={link.url} className="footer-link transition">
                        {link.label}
                      </TransitionLink>
                    ) : (
                      <a href={link.url} className="footer-link transition" target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {(settings.footer.showContactInfo ?? true) && (
              <div className="flex-1">
                <h4 className="mb-4 font-medium drop-shadow-sm">Contact</h4>
                <ul className="space-y-2" style={{ color: "var(--footer-text-muted, #A8A29E)" }}>
                  <li>{settings.contact.address.street}</li>
                  <li>{addressLine}</li>
                  <li className="pt-2">
                    <a href={`tel:${telHref}`} className="footer-link transition">
                      {settings.contact.phone}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${settings.contact.email}`} className="footer-link transition">
                      {settings.contact.email}
                    </a>
                  </li>
                </ul>
              </div>
            )}

            {(settings.footer.showHours ?? false) && settings.hours.schedule.length > 0 && (
              <div className="flex-1">
                <h4 className="mb-4 font-medium drop-shadow-sm">Horaires</h4>
                <ul className="space-y-2" style={{ color: "var(--footer-text-muted, #A8A29E)" }}>
                  {settings.hours.schedule.map((slot, index) => (
                    <li key={index}>
                      <span className="font-medium">{slot.days}</span>: {slot.hours}
                    </li>
                  ))}
                  {settings.hours.closedMessage && (
                    <li className="pt-2 text-sm italic">{settings.hours.closedMessage}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm md:flex-row"
          style={{
            borderColor: "color-mix(in srgb, var(--footer-border, #292524) 52%, transparent)",
            color: "var(--footer-text-muted, #A8A29E)",
          }}
        >
          <p>{settings.footer.copyrightText || FALLBACK_SETTINGS.footer.copyrightText}</p>
          {(settings.footer.showMentionsLegales ?? true) && (
            <TransitionLink href="/mentions-legales" className="footer-link transition">
              {settings.footer.mentionsLegalesText || "Mentions legales"}
            </TransitionLink>
          )}
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div
        className="footer-glow"
        aria-hidden="true"
      />
    </footer>
  );
}
