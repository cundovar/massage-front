import { getPage, fetchServices, getSectionContent } from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { Presentation } from "@/components/home/Presentation";
import { Approche } from "@/components/home/Approche";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { DEFAULT_HOME } from "@/lib/defaultContent";
import type { HeroContent, PresentationContent, ApprocheContent } from "@/types";
import { Footer } from "@/components/layout/Footer";

export default async function HomePage() {
  const [page, services] = await Promise.all([
    getPage("home"),
    fetchServices(),
  ]);

  const heroContent = getSectionContent<HeroContent>(page, "hero", DEFAULT_HOME.hero);
  const presentationContent = getSectionContent<PresentationContent>(page, "presentation", DEFAULT_HOME.presentation);
  const approcheContent = getSectionContent<ApprocheContent>(page, "approche", DEFAULT_HOME.approche);

  return (
    <main className="absolute top-0 left-0 right-0 page-transition">
    <div data-animate="section">
        <Hero content={heroContent} />
      </div> 
      <div data-animate="section">
        <Presentation content={presentationContent} />
      </div>
      <div data-animate="section">
        <ServicesPreview services={services.slice(0, 3)} />
      </div>
      <div data-animate="section">
        <Approche content={approcheContent} />
      </div>
      <ContactCTA />
      <Footer />
    </main>
  );
}
