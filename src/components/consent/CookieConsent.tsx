"use client";

import { useEffect } from "react";
import {
  AXEPTIO_CLIENT_ID,
  AXEPTIO_COOKIES_VERSION,
  GA_MEASUREMENT_ID,
  GA_VENDOR_KEY,
  GOOGLE_ADS_VENDOR_KEY,
  GTM_ID,
  isConsentEnabled,
  type AxeptioChoices,
} from "@/lib/consent";

const AXEPTIO_SDK_URL = "https://static.axept.io/sdk.js";

let googleLoaded = false;

function ensureGtag() {
  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // gtag attend l'objet `arguments` tel quel.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
  return window.gtag;
}

function appendScript(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function setGoogleAnalyticsDisabled(disabled: boolean) {
  if (!GA_MEASUREMENT_ID) return;
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = disabled;
}

/** Transmet les choix du visiteur a Google (Consent Mode v2). */
function updateGoogleConsent(choices: AxeptioChoices) {
  const analytics = choices[GA_VENDOR_KEY] ? "granted" : "denied";
  const ads = choices[GOOGLE_ADS_VENDOR_KEY] ? "granted" : "denied";
  ensureGtag()("consent", "update", {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

/**
 * Charge Google Tag Manager (ou GA4 en direct), uniquement apres accord du visiteur.
 * Tout est refuse par defaut, puis mis a jour selon ses choix.
 */
function loadGoogle(choices: AxeptioChoices) {
  const gtag = ensureGtag();

  if (!googleLoaded) {
    googleLoaded = true;
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    updateGoogleConsent(choices);

    if (GTM_ID) {
      window.dataLayer?.push({ "gtm.start": Date.now(), event: "gtm.js" });
      appendScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`);
    } else {
      gtag("js", new Date());
      gtag("config", GA_MEASUREMENT_ID);
      appendScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`);
    }
    return;
  }

  updateGoogleConsent(choices);
}

/**
 * Bandeau de consentement Axeptio : affiche la banniere, memorise le choix
 * et ne declenche Google (Tag Manager ou Analytics) qu'avec l'accord du visiteur.
 * Ne rend rien : tout se passe dans le script Axeptio.
 */
export function CookieConsent() {
  useEffect(() => {
    if (!isConsentEnabled) return;

    window.axeptioSettings = {
      clientId: AXEPTIO_CLIENT_ID,
      ...(AXEPTIO_COOKIES_VERSION ? { cookiesVersion: AXEPTIO_COOKIES_VERSION } : {}),
    };

    if (GTM_ID || GA_MEASUREMENT_ID) {
      window._axcb = window._axcb ?? [];
      window._axcb.push((axeptio) => {
        axeptio.on("cookies:complete", (choices: AxeptioChoices) => {
          if (choices[GA_VENDOR_KEY]) {
            setGoogleAnalyticsDisabled(false);
            loadGoogle(choices);
          } else if (googleLoaded) {
            // Retrait de l'accord : plus aucune mesure envoyee.
            setGoogleAnalyticsDisabled(true);
            updateGoogleConsent(choices);
          }
        });
      });
    }

    if (document.querySelector(`script[src="${AXEPTIO_SDK_URL}"]`)) return;
    appendScript(AXEPTIO_SDK_URL);
  }, []);

  return null;
}
