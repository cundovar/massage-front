import { getPage, fetchServices, getSectionContent } from "@/lib/api";
import { Hero } from "@/components/sections/Hero";
import { Presentation } from "@/components/sections/Presentation";
import { Approche } from "@/components/sections/Approche";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { DEFAULT_HOME } from "@/lib/defaultContent";
import type { HeroContent, PresentationContent, ApprocheContent } from "@/types";

export default async function HomePage() {
  const [page, services] = await Promise.all([
    getPage("home"),
    fetchServices(),
  ]);

  const heroContent = getSectionContent<HeroContent>(page, "hero", DEFAULT_HOME.hero);
  const presentationContent = getSectionContent<PresentationContent>(page, "presentation", DEFAULT_HOME.presentation);
  const approcheContent = getSectionContent<ApprocheContent>(page, "approche", DEFAULT_HOME.approche);

  return (
    <>
      <Hero content={heroContent} />
      <Presentation content={presentationContent} />
      <ServicesPreview services={services.slice(0, 3)} />
      <Approche content={approcheContent} />
      <ContactCTA />
    </>
  );
}
