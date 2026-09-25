/**
 * Configuration du consentement cookies (Axeptio) et de la mesure d'audience.
 * Tout est pilote par des variables d'environnement publiques : sans identifiant
 * Axeptio, aucun script tiers n'est charge.
 */

export const AXEPTIO_CLIENT_ID = process.env.NEXT_PUBLIC_AXEPTIO_CLIENT_ID ?? "";
export const AXEPTIO_COOKIES_VERSION = process.env.NEXT_PUBLIC_AXEPTIO_COOKIES_VERSION ?? "";
/** Conteneur Google Tag Manager (prioritaire sur GA_MEASUREMENT_ID). */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
/** Google Analytics 4 en direct, utilise seulement sans conteneur GTM. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** Nom du fournisseur Google Analytics dans le projet Axeptio. */
export const GA_VENDOR_KEY = "google_analytics";
/** Nom du fournisseur Google Ads dans le projet Axeptio (optionnel). */
export const GOOGLE_ADS_VENDOR_KEY = "google_ads";

export const isConsentEnabled = AXEPTIO_CLIENT_ID !== "";

export type AxeptioChoices = Record<string, boolean | undefined>;

interface AxeptioSdk {
  on: (event: "cookies:complete", callback: (choices: AxeptioChoices) => void) => void;
}

declare global {
  interface Window {
    axeptioSettings?: {
      clientId: string;
      cookiesVersion?: string;
    };
    _axcb?: Array<(sdk: AxeptioSdk) => void>;
    openAxeptioCookies?: () => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Rouvre la fenetre de choix des cookies (lien « Gestion des cookies »). */
export function openCookieSettings(): void {
  window.openAxeptioCookies?.();
}
