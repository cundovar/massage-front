import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Playfair_Display } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { getImageUrl, getNavigation, getSettings } from "@/lib/api";
import { THEME_PRESETS, generateThemeCSS } from "@/lib/themes";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// Police de titre du thème Spa Luxe : pas de préchargement, le fichier n'est
// téléchargé que si le thème actif l'utilise.
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: settings.general.siteName,
      template: `%s | ${settings.general.siteName}`,
    },
    description: settings.general.defaultMetaDescription,
    icons: settings.general.favicon
      ? [{ url: getImageUrl(settings.general.favicon) ?? settings.general.favicon }]
      : [{ url: "/favicon-front.svg", type: "image/svg+xml" }],
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let themeCSS = generateThemeCSS(THEME_PRESETS.ayurveda);
  let initialSettings = await getSettings();
  const initialNavigation = await getNavigation();

  try {
    const settings = initialSettings;
    const preset = THEME_PRESETS[settings.appearance.themePreset] ?? THEME_PRESETS.ayurveda;
    const customAccentColor = settings.appearance.useCustomAccent
      ? settings.appearance.customAccentColor || undefined
      : undefined;
    themeCSS = generateThemeCSS(preset, customAccentColor);
  } catch {
    themeCSS = generateThemeCSS(THEME_PRESETS.ayurveda);
    initialSettings = await getSettings();
  }

  const bodyBackgroundImage = getImageUrl(initialSettings.appearance.bodyBackgroundImage);

  return (
    <html lang="fr" className={`${dmSerif.variable} ${playfair.variable} ${inter.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className="font-sans antialiased">
        {/* Background fixe - ne bouge jamais entre les pages */}
        <div
          className="fixed-background"
          aria-hidden="true"
          style={
            bodyBackgroundImage
              ? {
                  backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, var(--color-background) 78%, transparent), color-mix(in srgb, var(--color-background) 72%, transparent)), url(${bodyBackgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />

        <AppShell initialNavItems={initialNavigation.items} initialSettings={initialSettings}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
