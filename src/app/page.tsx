import { HomeGsapEffects } from "@/components/animations/HomeGsapEffects";
import { Hero } from "@/components/home/Hero";
import { Approche } from "@/components/home/Approche";
import { Presentation } from "@/components/home/Presentation";
import { Footer } from "@/components/layout/Footer";
import { getPage, getSectionContent } from "@/lib/api";
import { DEFAULT_HOME } from "@/lib/defaultContent";
import type { ApprocheContent, HeroContent, PresentationContent } from "@/lib/api";

export default async function HomePage() {
  const page = await getPage("home");

  const heroContent = getSectionContent<HeroContent>(page, "hero", DEFAULT_HOME.hero);
  const presentationContent = getSectionContent<PresentationContent>(page, "presentation", DEFAULT_HOME.presentation);
  const approcheContent = getSectionContent<ApprocheContent>(page, "approche", DEFAULT_HOME.approche);

  return (
    <main className="bg-[var(--bg)] min-h-screen">
      <HomeGsapEffects />
      <Hero content={heroContent} />
      <div className="mx-auto max-w-full px-5 pb-16 md:px-8">
        <div className="pt-6 md:pt-8">
          <Presentation content={presentationContent} />
          <Approche content={approcheContent} />
        </div>
        <Footer />
      </div>
    </main>
  );
}
