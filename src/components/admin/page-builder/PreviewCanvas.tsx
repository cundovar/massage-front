"use client";

import { Component, type ErrorInfo, type MouseEvent, type ReactNode, useMemo } from "react";
import dynamic from "next/dynamic";
import { Leaf } from "lucide-react";
import { BlockAppearanceFrame, type BlockAppearance } from "@/components/dynamic/BlockAppearanceFrame";
import { EmptyBlockPlaceholder } from "@/components/dynamic/EmptyBlockPlaceholder";
import type { GenericHeroContent } from "@/components/dynamic/GenericHeroSection";
import type { ServicesPreviewContent } from "@/components/sections/ServicesPreview";
import { PreviewModeProvider } from "@/contexts/PreviewModeContext";
import type { PageSection } from "@/lib/api-admin";
import { hasRichText } from "@/lib/richText";

const GenericHeroSection = dynamic(() => import("@/components/dynamic/GenericHeroSection").then((mod) => mod.GenericHeroSection), { ssr: false });
const Hero = dynamic(() => import("@/components/home/Hero").then((mod) => mod.Hero), { ssr: false });
const Presentation = dynamic(() => import("@/components/home/Presentation").then((mod) => mod.Presentation), { ssr: false });
const Approche = dynamic(() => import("@/components/home/Approche").then((mod) => mod.Approche), { ssr: false });
const Tarifs = dynamic(() => import("@/components/home/Tarifs").then((mod) => mod.Tarifs), { ssr: false });
const MassageAmma = dynamic(() => import("@/components/entreprise/MassageAmma").then((mod) => mod.MassageAmma), { ssr: false });
const ContactCTA = dynamic(() => import("@/components/sections/ContactCTA").then((mod) => mod.ContactCTA), { ssr: false });
const ContactForm = dynamic(() => import("@/components/sections/ContactForm").then((mod) => mod.ContactForm), { ssr: false });
const ContactInfo = dynamic(() => import("@/components/sections/ContactInfo").then((mod) => mod.ContactInfo), { ssr: false });
const ContactLayout = dynamic(() => import("@/components/sections/ContactLayout").then((mod) => mod.ContactLayout), { ssr: false });
const ServiceSelector = dynamic(() => import("@/components/sections/ServiceSelector").then((mod) => mod.ServiceSelector), { ssr: false });
const ContactInfoSection = dynamic(() => import("@/components/dynamic/ContactInfoSection").then((mod) => mod.ContactInfoSection), { ssr: false });
const BenefitsGridSection = dynamic(() => import("@/components/dynamic/BenefitsGridSection").then((mod) => mod.BenefitsGridSection), { ssr: false });
const GoogleMapSection = dynamic(() => import("@/components/dynamic/GoogleMapSection").then((mod) => mod.GoogleMapSection), { ssr: false });
const GoogleReviewsSection = dynamic(() => import("@/components/dynamic/GoogleReviewsSection").then((mod) => mod.GoogleReviewsSection), { ssr: false });
const TextSection = dynamic(() => import("@/components/dynamic/TextSection").then((mod) => mod.TextSection), { ssr: false });
const NeutralSection = dynamic(() => import("@/components/dynamic/NeutralSection").then((mod) => mod.NeutralSection), { ssr: false });
const QuoteSection = dynamic(() => import("@/components/dynamic/QuoteSection").then((mod) => mod.QuoteSection), { ssr: false });
const SpacerSection = dynamic(() => import("@/components/dynamic/SpacerSection").then((mod) => mod.SpacerSection), { ssr: false });
const ImageSection = dynamic(() => import("@/components/dynamic/ImageSection").then((mod) => mod.ImageSection), { ssr: false });
const GenericGallerySection = dynamic(() => import("@/components/dynamic/GenericGallerySection").then((mod) => mod.GenericGallerySection), { ssr: false });
const ParcoursSection = dynamic(() => import("@/components/dynamic/ParcoursSection").then((mod) => mod.ParcoursSection), { ssr: false });
const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview").then((mod) => mod.ServicesPreview), { ssr: false });
const FormationsSection = dynamic(() => import("@/components/dynamic/FormationsSection").then((mod) => mod.FormationsSection), { ssr: false });

interface PreviewCanvasProps {
  sections: PageSection[];
  activeSection?: string | null;
  onSelectSection?: (key: string) => void;
}

class PreviewErrorBoundary extends Component<{ children: ReactNode; sectionType: string }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Erreur apercu bloc ${this.props.sectionType}`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="rounded-lg border border-rose-200 bg-rose-50 px-6 py-8 text-center text-sm text-rose-700">Aperçu indisponible pour ce bloc.</div>;
    }

    return this.props.children;
  }
}

export function PreviewCanvas({ sections, activeSection = null, onSelectSection }: PreviewCanvasProps) {
  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.sortOrder - b.sortOrder), [sections]);

  return (
    <PreviewModeProvider>
      {sortedSections.map((section) => (
        <PreviewErrorBoundary key={section.key} sectionType={section.type}>
          <PreviewSection
            section={section}
            isActive={activeSection === section.key}
            onClick={onSelectSection ? () => onSelectSection(section.key) : undefined}
          />
        </PreviewErrorBoundary>
      ))}

      {sortedSections.length === 0 ? (
        <div className="flex h-96 items-center justify-center text-stone-400">
          <p>Ajoutez des blocs pour voir l&apos;aperçu</p>
        </div>
      ) : null}
    </PreviewModeProvider>
  );
}

interface PreviewSectionProps {
  section: PageSection;
  isActive: boolean;
  onClick?: () => void;
}

function PreviewSection({ section, isActive, onClick }: PreviewSectionProps) {
  const content = section.content as Record<string, unknown>;
  const sectionType = section.type ?? "text";
  const isVisible = section.visible ?? true;
  const blockAppearance = content._appearance as BlockAppearance | undefined;

  function withWrapper(children: ReactNode) {
    function handleClick(event: MouseEvent<HTMLDivElement>) {
      if (!onClick) return;
      event.preventDefault();
      event.stopPropagation();
      onClick();
    }

    return (
      <div
        data-preview-section={section.key}
        onClick={onClick ? handleClick : undefined}
        className={[
          "relative mb-4 transition-all",
          onClick ? "cursor-pointer" : "",
          isActive ? "ring-inset ring-4 ring-amber-500" : onClick ? "hover:ring-2 hover:ring-inset hover:ring-amber-300" : "",
          !isVisible ? "opacity-45 grayscale" : "",
        ].join(" ")}
      >
        <BlockAppearanceFrame appearance={blockAppearance}>{children}</BlockAppearanceFrame>
        {!isVisible ? <div className="absolute left-2 top-2 z-10 rounded bg-stone-900 px-2 py-1 text-xs text-white">Masqué sur le site</div> : null}
        {isActive ? <div className="absolute right-2 top-2 z-10 rounded bg-amber-500 px-2 py-1 text-xs text-white">En édition</div> : null}
      </div>
    );
  }

  switch (sectionType) {
    case "hero-home": return withWrapper(<Hero content={content as never} />);
    case "hero": return withWrapper(<GenericHeroSection content={content as GenericHeroContent} />);
    case "hero-compact": return withWrapper(<GenericHeroSection content={{ ...(content as GenericHeroContent), compact: true }} />);
    case "presentation": return withWrapper(<Presentation content={content as never} />);
    case "approche": return withWrapper(<Approche content={content as never} />);
    case "tarifs": return withWrapper(<Tarifs content={content as never} />);
    case "entreprise": return withWrapper(<MassageAmma content={content as never} />);
    case "contact-cta": return withWrapper(<ContactCTA content={content as { title?: string; subtitle?: string; buttonText?: string; buttonLink?: string }} />);
    case "contact-infos": return withWrapper(<ContactInfoSection content={content as never} />);
    case "contact-info": return withWrapper(<ContactInfo content={content as never} />);
    case "contact-form": return withWrapper(<ContactForm />);
    case "contact-layout": return withWrapper(<ContactLayout content={content as never} />);
    case "google-map": return withWrapper(<GoogleMapSection content={content as never} />);
    case "google-reviews": return withWrapper(<GoogleReviewsSection content={content as never} />);
    case "benefits-grid": return withWrapper(<BenefitsGridSection content={content as never} />);
    case "text": return withWrapper(<TextSection content={content as never} />);
    case "neutral": return withWrapper(<NeutralSection content={content as never} />);
    case "spacer": return withWrapper(<div className="relative bg-stone-100/70"><SpacerSection content={content as never} /><div className="absolute inset-x-0 top-1/2 border-t border-dashed border-stone-300" /></div>);
    case "quote":
    case "philosophie": return withWrapper(<QuoteSection content={content as never} />);
    case "image": return withWrapper(<ImageSection content={content as never} />);
    case "gallery": return withWrapper(<GenericGallerySection content={content as never} />);
    case "parcours": return withWrapper(<ParcoursSection content={content as never} />);
    case "formations": return withWrapper(<FormationsSection content={content as never} />);
    case "service-selector": return withWrapper(<ServiceSelector content={{ title: (content.title as string) ?? "Carte & tarifs", subtitle: (content.subtitle as string | undefined) ?? "", offers: (content.offers as Array<{ title: string; description: string; prices: string[] }>) ?? [] }} />);
    case "services-preview": {
      const previewContent = content as ServicesPreviewContent;
      const hasItems = previewContent.items?.some((item) => hasRichText(item.name));
      return withWrapper(hasItems ? <ServicesPreview content={previewContent} /> : <EmptyBlockPlaceholder icon={Leaf} title="Aperçu des soins" hint="Ajoutez des soins dans le bloc : sur le site, les soins de « Services » s'affichent sinon." />);
    }
    default: return withWrapper(<div className="rounded-lg bg-stone-100 px-6 py-12 text-center text-stone-500"><p className="font-medium">{sectionType}</p><p className="text-sm">Aperçu non disponible</p></div>);
  }
}
