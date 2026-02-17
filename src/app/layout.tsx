import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { getSettings } from "@/lib/api";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
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
    icons: settings.general.favicon ? [{ url: settings.general.favicon }] : undefined,
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${dmSerif.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
