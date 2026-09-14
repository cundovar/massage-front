export function getPublicPagePath(slug: string): string {
  if (slug === "home") {
    return "/";
  }

  if (slug === "about") {
    return "/a-propos";
  }

  return `/${slug}`;
}
