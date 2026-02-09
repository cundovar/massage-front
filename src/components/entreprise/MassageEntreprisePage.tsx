"use client";

import { useEffect } from "react";
import { MassageAmma } from "@/components/entreprise/MassageAmma";
import type { EntrepriseContent } from "@/types";

interface MassageEntreprisePageProps {
  content: EntrepriseContent;
}

export function MassageEntreprisePage({ content }: MassageEntreprisePageProps) {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const target = document.getElementById("entreprise");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" role="main">
      <MassageAmma content={content} />
    </main>
  );
}
