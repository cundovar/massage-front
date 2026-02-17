import { Approche } from "@/components/home/Approche";
import { Presentation } from "@/components/home/Presentation";
import { Tarifs } from "@/components/home/Tarifs";
import { MassageAmma } from "@/components/entreprise/MassageAmma";
import { GenericGallerySection } from "@/components/dynamic/GenericGallerySection";
import { GenericHeroSection } from "@/components/dynamic/GenericHeroSection";
import { GenericTextSection } from "@/components/dynamic/GenericTextSection";
import { ImageSection } from "@/components/dynamic/ImageSection";
import { QuoteSection } from "@/components/dynamic/QuoteSection";
import { TextSection } from "@/components/dynamic/TextSection";
import type { ApprocheContent, EntrepriseContent, PresentationContent, TarifsContent } from "@/lib/api";

interface Section {
  sectionKey: string;
  type?: string;
  title: string | null;
  content: Record<string, unknown>;
  sortOrder?: number;
}

interface SectionRendererProps {
  sections: Section[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.sectionKey}-${section.sortOrder ?? index}`;
        const sectionType = section.type ?? section.sectionKey;

        switch (sectionType) {
          case "hero":
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
            return <QuoteSection key={key} content={section.content as { text?: string; author?: string }} />;
          default:
            console.warn(`Type de section inconnu: ${sectionType}`);
            return <GenericTextSection key={key} content={section.content as unknown as { title?: string; paragraphs?: string[]; quote?: string }} />;
        }
      })}
    </>
  );
}
