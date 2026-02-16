import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { HeaderNoSSR } from "@/components/layout/HeaderNoSSR";
import { getNavigation } from "@/lib/api";
import { DM_Serif_Display, Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
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

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Helene Massage & Ayurveda",
  description: "Site vitrine de massages ayurvediques et bien-etre.",
};




export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const navigation = await getNavigation();

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${titleFont.variable} ${bodyFont.variable} antialiased`}>
        <HeaderNoSSR initialNavItems={navigation.items} />
        {children}
    <html lang="fr" className={`${dmSerif.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
