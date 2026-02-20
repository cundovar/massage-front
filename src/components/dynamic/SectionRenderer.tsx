"use client";

import { Approche } from "@/components/home/Approche";
import { Hero } from "@/components/home/Hero";
import { Presentation } from "@/components/home/Presentation";
import { Tarifs } from "@/components/home/Tarifs";
import { MassageAmma } from "@/components/entreprise/MassageAmma";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { ContactInfoSection } from "@/components/dynamic/ContactInfoSection";
import { FormationsSection } from "@/components/dynamic/FormationsSection";
import { GenericGallerySection } from "@/components/dynamic/GenericGallerySection";
import { GenericHeroSection } from "@/components/dynamic/GenericHeroSection";
import { GenericTextSection } from "@/components/dynamic/GenericTextSection";
import { GoogleMapSection } from "@/components/dynamic/GoogleMapSection";
import { ImageSection } from "@/components/dynamic/ImageSection";
import { ParcoursSection } from "@/components/dynamic/ParcoursSection";
import { QuoteSection } from "@/components/dynamic/QuoteSection";
import { TextSection } from "@/components/dynamic/TextSection";
import type {
  ApprocheContent,
  EntrepriseContent,
  FormationsContent,
  HeroContent,
  ParcoursContent,
  PresentationContent,
  TarifsContent,
} from "@/lib/api";
import type { ServiceItem } from "@/types/service";

interface Section {
  sectionKey: string;
  type?: string;
  title: string | null;
  content: Record<string, unknown>;
  sortOrder?: number;
}

interface SectionRendererProps {
  sections: Section[];
  services?: ServiceItem[];
}

export function SectionRenderer({ sections, services }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.sectionKey}-${section.sortOrder ?? index}`;
        const sectionType = section.type ?? section.sectionKey;

        switch (sectionType) {
          case "hero-home":
            return <Hero key={key} content={section.content as unknown as HeroContent} />;
          case "hero":
          case "hero-simple":
            return <GenericHeroSection key={key} content={section.content as unknown as { title?: string; subtitle?: string; image?: string }} />;
          case "presentation":
            return <Presentation key={key} content={section.content as unknown as PresentationContent} />;
          case "approche":
            return <Approche key={key} content={section.content as unknown as ApprocheContent} />;
          case "tarifs":
            return <Tarifs key={key} content={section.content as unknown as TarifsContent} />;
          case "entreprise":
            return <MassageAmma key={key} content={section.content as unknown as EntrepriseContent} />;
          case "gallery":
            return <GenericGallerySection key={key} content={section.content as unknown as { title?: string; images?: string[] }} />;
          case "text":
            return <TextSection key={key} content={section.content as { title?: string; paragraphs?: string[]; image?: string | null }} />;
          case "image":
            return <ImageSection key={key} content={section.content as { image?: string | null; alt?: string; caption?: string }} />;
          case "quote":
          case "philosophie":
            return <QuoteSection key={key} content={section.content as { text?: string; author?: string }} />;
          case "parcours":
            return <ParcoursSection key={key} content={section.content as unknown as ParcoursContent} />;
          case "formations":
            return <FormationsSection key={key} content={section.content as unknown as FormationsContent} />;
          case "contact-cta":
            return (
              <ContactCTA
                key={key}
                content={section.content as { title?: string; subtitle?: string; buttonText?: string }}
              />
            );
          case "contact-infos":
            return (
              <ContactInfoSection
                key={key}
                content={section.content as { title?: string; address?: { street?: string; city?: string }; phone?: string; email?: string; hours?: Array<{ days: string; hours: string }> }}
              />
            );
          case "google-map":
            return (
              <GoogleMapSection
                key={key}
                content={section.content as { title?: string; embedUrl?: string }}
              />
            );
          case "services-preview":
            return services && services.length > 0 ? (
              <ServicesPreview key={key} services={services.slice(0, 3)} />
            ) : null;
          default:
            console.warn(`Type de section inconnu: ${sectionType}`);
            return <GenericTextSection key={key} content={section.content as unknown as { title?: string; paragraphs?: string[]; quote?: string }} />;
        }
      })}
    </>
  );
}
