"use client";

import type { ReactNode } from "react";
import { AnimationWrapper, type AnimationEffect } from "@/components/animations/AnimationWrapper";
import { BenefitsGridSection, type BenefitsGridContent } from "@/components/dynamic/BenefitsGridSection";
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
import { MassageAmma } from "@/components/entreprise/MassageAmma";
import { Approche } from "@/components/home/Approche";
import { Hero } from "@/components/home/Hero";
import { Presentation } from "@/components/home/Presentation";
import { Tarifs } from "@/components/home/Tarifs";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { ContactLayout } from "@/components/sections/ContactLayout";
import { ServiceSelector } from "@/components/sections/ServiceSelector";
import { ServicesPreview, type ServicesPreviewContent } from "@/components/sections/ServicesPreview";
import type {
  ApprocheContent,
  ContactInfosContent,
  EntrepriseContent,
  FormationsContent,
  HeroContent,
  ParcoursContent,
  PresentationContent,
  TarifsContent,
} from "@/lib/api";
import type { ServiceItem } from "@/types/service";

interface SectionContent {
  animation?: AnimationEffect;
  animationDelay?: number;
  [key: string]: unknown;
}

interface Section {
  sectionKey: string;
  type?: string;
  title: string | null;
  content: SectionContent;
  sortOrder?: number;
}

interface SectionRendererProps {
  sections: Section[];
  services?: ServiceItem[];
  tarifsContent?: TarifsContent;
  contactInfos?: ContactInfosContent;
}

export function SectionRenderer({
  sections,
  services,
  tarifsContent,
  contactInfos,
}: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.sectionKey}-${section.sortOrder ?? index}`;
        const sectionType = section.type ?? section.sectionKey;
        const animation = section.content.animation ?? "fade-up";
        const animationDelay = section.content.animationDelay ?? 0;

        const withAnimation = (component: ReactNode) => {
          const noAnimationTypes = ["hero-home", "hero", "hero-simple", "hero-compact"];
          if (noAnimationTypes.includes(sectionType)) {
            return component;
          }

          return (
            <AnimationWrapper effect={animation} delay={animationDelay}>
              {component}
            </AnimationWrapper>
          );
        };

        switch (sectionType) {
          case "hero-home":
            return <Hero key={key} content={section.content as unknown as HeroContent} />;

          case "hero":
          case "hero-simple":
          case "hero-compact":
            return (
              <GenericHeroSection
                key={key}
                content={{
                  ...(section.content as unknown as {
                    title?: string;
                    subtitle?: string;
                    image?: string;
                  }),
                  compact: sectionType === "hero-compact",
                }}
              />
            );

          case "presentation":
            return withAnimation(
              <Presentation key={key} content={section.content as unknown as PresentationContent} />,
            );

          case "approche":
            return withAnimation(
              <Approche key={key} content={section.content as unknown as ApprocheContent} />,
            );

          case "tarifs":
            return withAnimation(<Tarifs key={key} content={section.content as unknown as TarifsContent} />);

          case "entreprise":
            return withAnimation(
              <MassageAmma key={key} content={section.content as unknown as EntrepriseContent} />,
            );

          case "benefits-grid":
            return <BenefitsGridSection key={key} content={section.content as BenefitsGridContent} />;

          case "text":
            return withAnimation(
              <TextSection
                key={key}
                content={section.content as {
                  title?: string;
                  paragraphs?: string[];
                  image?: string | null;
                }}
              />,
            );

          case "image":
            return withAnimation(
              <ImageSection
                key={key}
                content={section.content as { image?: string | null; alt?: string; caption?: string }}
              />,
            );

          case "gallery":
            return withAnimation(
              <GenericGallerySection
                key={key}
                content={section.content as unknown as { title?: string; images?: string[] }}
              />,
            );

          case "quote":
          case "philosophie":
            return withAnimation(
              <QuoteSection key={key} content={section.content as { text?: string; author?: string }} />,
            );

          case "parcours":
            return withAnimation(
              <ParcoursSection key={key} content={section.content as unknown as ParcoursContent} />,
            );

          case "formations":
            return withAnimation(
              <FormationsSection key={key} content={section.content as unknown as FormationsContent} />,
            );

          case "contact-cta":
            return withAnimation(
              <ContactCTA
                key={key}
                content={section.content as { title?: string; subtitle?: string; buttonText?: string }}
              />,
            );

          case "contact-infos":
            return withAnimation(
              <ContactInfoSection
                key={key}
                content={section.content as unknown as ContactInfosContent & { title?: string }}
              />,
            );

          case "contact-info":
            return withAnimation(
              <ContactInfo
                key={key}
                content={contactInfos ?? (section.content as unknown as ContactInfosContent)}
              />,
            );

          case "contact-form":
            return withAnimation(<ContactForm key={key} />);

          case "contact-layout":
            return withAnimation(
              <ContactLayout
                key={key}
                content={contactInfos ?? (section.content as unknown as ContactInfosContent)}
              />,
            );

          case "google-map":
            return withAnimation(
              <GoogleMapSection key={key} content={section.content as { title?: string; embedUrl?: string }} />,
            );

          case "services-preview": {
            const previewContent = section.content as ServicesPreviewContent;
            // Afficher si on a des items manuels OU des services API
            const hasManualItems = previewContent.items?.some((item) => item.name?.trim());
            const hasApiServices = services && services.length > 0;

            if (!hasManualItems && !hasApiServices) {
              return null;
            }

            return withAnimation(
              <ServicesPreview
                key={key}
                services={hasApiServices ? services.slice(0, 3) : []}
                content={previewContent}
              />,
            );
          }

          case "service-selector": {
            const baseContent = tarifsContent ?? (section.content as unknown as TarifsContent);
            const safeContent: TarifsContent = {
              title: baseContent?.title ?? "Carte & tarifs",
              subtitle: baseContent?.subtitle,
              offers: Array.isArray(baseContent?.offers) ? baseContent.offers : [],
            };
            return withAnimation(<ServiceSelector key={key} content={safeContent} />);
          }

          default:
            console.warn(`Type de section inconnu: ${sectionType}`);
            return withAnimation(
              <GenericTextSection
                key={key}
                content={section.content as unknown as {
                  title?: string;
                  paragraphs?: string[];
                  quote?: string;
                }}
              />,
            );
        }
      })}
    </>
  );
}
