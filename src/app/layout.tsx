import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import "./globals.css";

const titleFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-title",
  weight: ["300", "400", "500", "600"],
});
const bodyFont = Source_Sans_3({ subsets: ["latin"], variable: "--font-body", weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: "Helene Massage & Ayurveda",
  description: "Site vitrine de massages ayurvediques et bien-etre.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${titleFont.variable} ${bodyFont.variable} antialiased`}>
        <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <header className="glass-panel sticky top-4 z-20 mt-4 rounded-2xl px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href="/" className="text-3xl leading-none" style={{ fontFamily: "var(--font-title)" }}>
                Helene
              </Link>
              <nav className="flex flex-wrap gap-5 text-sm tracking-wide text-[var(--muted)]" aria-label="Navigation principale">
                <Link className="hover:text-[var(--text)]" href="/#bienvenue">Bienvenue</Link>
                <Link className="hover:text-[var(--text)]" href="/#parcours">Parcours</Link>
                <Link className="hover:text-[var(--text)]" href="/#tarifs">Tarifs</Link>
                <Link className="hover:text-[var(--text)]" href="/entreprise">Entreprise</Link>
              </nav>
              <ThemeToggle />
            </div>
          </header>
          <div className="page-transition">{children}</div>
          <footer className="mt-16 border-t border-[var(--line)] py-6 text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} Helene Massage & Ayurveda
          </footer>
        </div>
      </body>
    </html>
  );
}
