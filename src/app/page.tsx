import { getPage, getServices } from "@/lib/api";
import { SectionRenderer } from "@/components/dynamic/SectionRenderer";

// Desactiver le cache pour voir les modifications en temps reel
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [page, services] = await Promise.all([
    getPage("home"),
    getServices(),
  ]);

  const sections = Object.entries(page.sections).map(([key, section]) => ({
    sectionKey: key,
    type: section.type,
    title: section.title,
    content: section.content,
    sortOrder: section.sortOrder,
  }));

  // Trier par sortOrder
  sections.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <main className="page-transition">
      <SectionRenderer sections={sections} services={services} />
    </main>
  );
}
