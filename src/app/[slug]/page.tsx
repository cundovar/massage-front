import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/dynamic/SectionRenderer";
import { Footer } from "@/components/layout/Footer";
import { getPage } from "@/lib/api";

const DEDICATED_ROUTES = new Set(["soins", "entreprise", "a-propos", "contact", "mentions-legales", "admin", "register"]);

interface DynamicPageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicPageProps) {
  const { slug } = await Promise.resolve(params);

  if (DEDICATED_ROUTES.has(slug)) {

    
    return {};
  }

  const page = await getPage(slug, { fallback: false });
  if (!page) {
    return {};
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription ?? undefined,
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await Promise.resolve(params);

  if (DEDICATED_ROUTES.has(slug)) {
    notFound();
  }

  const page = await getPage(slug, { fallback: false });
  if (!page) {
    notFound();
  }

  const sections = Object.entries(page.sections).map(([key, section]) => ({
    sectionKey: key,
    type: section.type,
    title: section.title,
    content: section.content,
  }));

  return (
    <main className="pt-24">
      <SectionRenderer sections={sections} />
      <Footer />
    </main>
  );
}
