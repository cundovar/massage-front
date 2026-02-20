"use client";

import { useMemo, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { PageSection } from "@/lib/api-admin";

const GenericHeroSection = dynamic(() => import("@/components/dynamic/GenericHeroSection").then((mod) => mod.GenericHeroSection), { ssr: false });
const Hero = dynamic(() => import("@/components/home/Hero").then((mod) => mod.Hero), { ssr: false });
const Presentation = dynamic(() => import("@/components/home/Presentation").then((mod) => mod.Presentation), { ssr: false });
const Approche = dynamic(() => import("@/components/home/Approche").then((mod) => mod.Approche), { ssr: false });
const Tarifs = dynamic(() => import("@/components/home/Tarifs").then((mod) => mod.Tarifs), { ssr: false });
const MassageAmma = dynamic(() => import("@/components/entreprise/MassageAmma").then((mod) => mod.MassageAmma), { ssr: false });
const ContactCTA = dynamic(() => import("@/components/sections/ContactCTA").then((mod) => mod.ContactCTA), { ssr: false });
const ContactInfoSection = dynamic(() => import("@/components/dynamic/ContactInfoSection").then((mod) => mod.ContactInfoSection), { ssr: false });
const GoogleMapSection = dynamic(() => import("@/components/dynamic/GoogleMapSection").then((mod) => mod.GoogleMapSection), { ssr: false });
const TextSection = dynamic(() => import("@/components/dynamic/TextSection").then((mod) => mod.TextSection), { ssr: false });
const QuoteSection = dynamic(() => import("@/components/dynamic/QuoteSection").then((mod) => mod.QuoteSection), { ssr: false });
const ImageSection = dynamic(() => import("@/components/dynamic/ImageSection").then((mod) => mod.ImageSection), { ssr: false });
const GenericGallerySection = dynamic(() => import("@/components/dynamic/GenericGallerySection").then((mod) => mod.GenericGallerySection), { ssr: false });
const ParcoursSection = dynamic(() => import("@/components/dynamic/ParcoursSection").then((mod) => mod.ParcoursSection), { ssr: false });
const FormationsSection = dynamic(() => import("@/components/dynamic/FormationsSection").then((mod) => mod.FormationsSection), { ssr: false });

interface LivePreviewProps {
  sections: PageSection[];
  activeSection: string | null;
  onSelectSection: (key: string) => void;
}

export function LivePreview({ sections, activeSection, onSelectSection }: LivePreviewProps) {
  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.sortOrder - b.sortOrder), [sections]);

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 border-b bg-stone-100 px-4 py-2 text-sm text-stone-500">
        Apercu en temps reel - Cliquez sur une section pour la modifier
      </div>

      <div className="origin-top-left p-4" style={{ transform: "scale(0.7)", width: "142.85%" }}>
        {sortedSections.map((section) => (
          <PreviewSection
            key={section.key}
            section={section}
            isActive={activeSection === section.key}
            onClick={() => onSelectSection(section.key)}
          />
        ))}

        {sortedSections.length === 0 ? (
          <div className="flex h-96 items-center justify-center text-stone-400">
            <p>Ajoutez des blocs pour voir l&apos;apercu</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface PreviewSectionProps {
  section: PageSection;
  isActive: boolean;
  onClick: () => void;
}

function PreviewSection({ section, isActive, onClick }: PreviewSectionProps) {
  const content = section.content as Record<string, unknown>;
  const sectionType = section.type ?? "text";

  function withWrapper(children: ReactNode) {
    return (
      <div
        onClick={onClick}
        className={[
          "relative mb-4 cursor-pointer transition-all",
          isActive ? "ring-inset ring-4 ring-amber-500" : "hover:ring-2 hover:ring-inset hover:ring-amber-300",
        ].join(" ")}
      >
        {children}
        {isActive ? (
          <div className="absolute right-2 top-2 z-10 rounded bg-amber-500 px-2 py-1 text-xs text-white">En edition</div>
        ) : null}
      </div>
    );
  }

  switch (sectionType) {
    case "hero-home":
      return withWrapper(<Hero content={content as never} />);
    case "hero":
      return withWrapper(<GenericHeroSection content={content as { title?: string; subtitle?: string; image?: string }} />);
    case "presentation":
      return withWrapper(<Presentation content={content as never} />);
    case "approche":
      return withWrapper(<Approche content={content as never} />);
    case "tarifs":
      return withWrapper(<Tarifs content={content as never} />);
    case "entreprise":
      return withWrapper(<MassageAmma content={content as never} />);
    case "contact-cta":
      return withWrapper(<ContactCTA content={content as { title?: string; subtitle?: string; buttonText?: string }} />);
    case "contact-infos":
      return withWrapper(<ContactInfoSection content={content as never} />);
    case "google-map":
      return withWrapper(<GoogleMapSection content={content as never} />);
    case "text":
      return withWrapper(<TextSection content={content as never} />);
    case "quote":
    case "philosophie":
      return withWrapper(<QuoteSection content={content as never} />);
    case "image":
      return withWrapper(<ImageSection content={content as never} />);
    case "gallery":
      return withWrapper(<GenericGallerySection content={content as never} />);
    case "parcours":
      return withWrapper(<ParcoursSection content={content as never} />);
    case "formations":
      return withWrapper(<FormationsSection content={content as never} />);
    default:
      return withWrapper(
        <div className="rounded-lg bg-stone-100 px-6 py-12 text-center text-stone-500">
          <p className="font-medium">{sectionType}</p>
          <p className="text-sm">Apercu non disponible</p>
        </div>,
      );
  }
}
