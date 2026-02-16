import { Approche } from "@/components/home/Approche";
import { Presentation } from "@/components/home/Presentation";
import { Tarifs } from "@/components/home/Tarifs";
import { MassageAmma } from "@/components/entreprise/MassageAmma";
import { GenericGallerySection } from "@/components/dynamic/GenericGallerySection";
import { GenericHeroSection } from "@/components/dynamic/GenericHeroSection";
import { GenericTextSection } from "@/components/dynamic/GenericTextSection";
import type { ApprocheContent, EntrepriseContent, PresentationContent, TarifsContent } from "@/lib/api";

interface Section {
  sectionKey: string;
  title: string | null;
  content: Record<string, unknown>;
}

interface SectionRendererProps {
  sections: Section[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.sectionKey}-${index}`;

        switch (section.sectionKey) {
          case "hero":
            return <GenericHeroSection key={key} content={section.content as { title?: string; subtitle?: string; image?: string }} />;
          case "presentation":
            return <Presentation key={key} content={section.content as PresentationContent} />;
          case "approche":
            return <Approche key={key} content={section.content as ApprocheContent} />;
          case "tarifs":
            return <Tarifs key={key} content={section.content as TarifsContent} />;
          case "entreprise":
            return <MassageAmma key={key} content={section.content as EntrepriseContent} />;
          case "gallery":
            return <GenericGallerySection key={key} content={section.content as { title?: string; images?: string[] }} />;
          case "text":
          default:
            return <GenericTextSection key={key} content={section.content as { title?: string; paragraphs?: string[]; quote?: string }} />;
        }
      })}
    </>
  );
}
