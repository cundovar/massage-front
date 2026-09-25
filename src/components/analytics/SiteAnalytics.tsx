"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/** Ignore les visites du backoffice pour ne compter que le site public. */
function ignoreAdmin(event: BeforeSendEvent): BeforeSendEvent | null {
  return new URL(event.url).pathname.startsWith("/admin") ? null : event;
}

/**
 * Mesure d'audience Vercel Web Analytics : sans cookie ni donnee personnelle,
 * donc sans bandeau de consentement.
 */
export function SiteAnalytics() {
  return <Analytics beforeSend={ignoreAdmin} />;
}
