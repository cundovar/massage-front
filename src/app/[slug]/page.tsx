import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/dynamic/SectionRenderer";
import { getPage } from "@/lib/api";

const DEDICATED_ROUTES = new Set(["mentions-legales", "admin", "register"]);
const SLUG_ALIASES: Record<string, string> = {
  "a-propos": "about",
};

interface DynamicPageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicPageProps) {
  const { slug } = await Promise.resolve(params);
  const resolvedSlug = SLUG_ALIASES[slug] ?? slug;

  if (DEDICATED_ROUTES.has(resolvedSlug)) {
    return {};
  }

  const page = await getPage(resolvedSlug, { fallback: false });
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
  const resolvedSlug = SLUG_ALIASES[slug] ?? slug;

  if (DEDICATED_ROUTES.has(resolvedSlug)) {
    notFound();
  }

  const page = await getPage(resolvedSlug, { fallback: false });
  if (!page) {
    notFound();
  }

  const sections = Object.entries(page.sections)
    .map(([key, section]) => ({
      sectionKey: key,
      type: section.type,
      title: section.title,
      content: section.content,
      sortOrder: section.sortOrder ?? 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="page-transition ">
      <SectionRenderer sections={sections} />
    </main>
  );
}
