
import { fetchPage, fetchServices } from "@/lib/api";
import { Hero } from "@/components/sections/Hero";
import { Presentation } from "@/components/sections/Presentation";
import { Approche } from "@/components/sections/Approche";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { ContactCTA } from "@/components/sections/ContactCTA";
import type {
  HeroContent,
  PresentationContent,
  ApprocheContent,
} from "@/types/sections";

export default async function HomePage() {
  // Récupérer les données depuis l'API (avec fallback automatique)
  const [page, services] = await Promise.all([
    fetchPage("home"),
    fetchServices(),
  ]);

  // Extraire le contenu des sections avec typage
  const heroContent = page.sections.hero?.content as HeroContent | undefined;
  const presentationContent = page.sections.presentation?.content as PresentationContent | undefined;
  const approcheContent = page.sections.approche?.content as ApprocheContent | undefined;

  return (
    <main>
      {/* Hero - Contenu depuis backoffice */}
      {heroContent && (
        <Hero content={heroContent} />
      )}

      {/* Présentation - Contenu depuis backoffice */}
      {presentationContent && (
        <Presentation content={presentationContent} />
      )}

      {/* Aperçu Services - Données depuis /api/services */}
      <ServicesPreview services={services.slice(0, 3)} />

      {/* Approche - Contenu depuis backoffice */}
      {approcheContent && (
        <Approche content={approcheContent} />
      )}

      {/* CTA Contact - Contenu statique ou depuis settings */}
      <ContactCTA />
    </main>
  );
}
