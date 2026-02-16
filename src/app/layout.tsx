import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { HeaderNoSSR } from "@/components/layout/HeaderNoSSR";
import { getNavigation } from "@/lib/api";
import "./globals.css";

const titleFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-title",
  weight: ["300", "400", "500", "600"],
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
      </body>
    </html>
  );
}
