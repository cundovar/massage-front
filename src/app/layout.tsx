import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Helene Massage & Ayurveda",
  description: "Site vitrine de massages ayurvediques et bien-etre.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${dmSerif.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
