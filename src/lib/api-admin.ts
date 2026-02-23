import type { SiteSettings } from "@/types/settings";
import type { Service, ServiceFormData } from "@/types/service";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  message?: string;
}

export interface AdminMeResponse {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

export interface CountNewResponse {
  count: number;
}

export interface MediaItem {
  id: number;
  filename: string;
  path: string;
  originalName: string;
  alt: string | null;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  uploadedAt: string;
}

export async function fetchMedia(token: string): Promise<MediaItem[]> {
  const data = await fetchAdminApi<{ items: MediaItem[] }>("/api/admin/media", token);
  return data.items;
}

export async function uploadMedia(token: string, file: File, alt?: string): Promise<MediaItem> {
  const formData = new FormData();
  formData.append("file", file);
  if (alt) formData.append("alt", alt);

  const response = await fetch(`${API_BASE_URL}/api/admin/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { errors?: { file?: string } } | null;
    throw new Error(error?.errors?.file ?? "Upload failed");
  }

  return (await response.json()) as MediaItem;
}

export async function deleteMedia(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/media/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Delete failed");
  }
}

export interface PageSection {
  key: string;
  type: SectionType;
  title: string | null;
  content: Record<string, unknown>;
  sortOrder: number;
  updatedAt: string;
}

export type SectionType = "hero" | "text" | "image" | "quote" | "presentation" | "approche" | "tarifs" | "entreprise" | string;

export interface SectionTypeOption {
  value: string;
  label: string;
  category?: string;
}

export interface AnimationOption {
  value: string;
  label: string;
}

export interface SectionTypesResponse {
  types: SectionTypeOption[];
  animations: AnimationOption[];
}

export interface PageDetail {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  showInNav: boolean;
  navOrder: number;
  navTitle: string | null;
  sections: PageSection[];
  updatedAt: string;
}

export interface PageListItem {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  showInNav: boolean;
  navOrder: number;
  updatedAt: string;
}

export async function fetchPages(token: string): Promise<PageListItem[]> {
  const data = await fetchAdminApi<{ items: PageListItem[] }>("/api/admin/pages", token);
  return data.items;
}

export interface CreatePagePayload {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
}

export async function createPage(token: string, payload: CreatePagePayload): Promise<PageListItem> {
  const response = await fetch(`${API_BASE_URL}/api/admin/pages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(error?.error ?? "Erreur lors de la creation");
  }

  return (await response.json()) as PageListItem;
}

export async function deletePage(token: string, slug: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/pages/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(error?.error ?? "Erreur lors de la suppression");
  }
}

export async function fetchServices(token: string): Promise<Service[]> {
  const data = await fetchAdminApi<{ items: Service[] }>("/api/admin/services", token);
  return data.items;
}

export async function fetchService(token: string, id: number): Promise<Service> {
  return fetchAdminApi<Service>(`/api/admin/services/${id}`, token);
}

export async function createService(token: string, payload: ServiceFormData): Promise<Service> {
  const response = await fetch(`${API_BASE_URL}/api/admin/services`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string; errors?: Record<string, string> } | null;
    const firstError = data?.errors ? Object.values(data.errors)[0] : null;
    throw new Error(firstError ?? data?.error ?? "Failed to create service");
  }

  return (await response.json()) as Service;
}

export async function updateService(token: string, id: number, payload: Partial<ServiceFormData>): Promise<Service> {
  const endpoint = `${API_BASE_URL}/api/admin/services/${id}`;
  let response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Some production reverse proxies/shared hosts reject PUT with 405.
  // Retry with POST on the same endpoint, handled server-side as an update fallback.
  if (response.status === 405) {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string; errors?: Record<string, string> } | null;
    const firstError = data?.errors ? Object.values(data.errors)[0] : null;
    throw new Error(firstError ?? data?.error ?? "Failed to update service");
  }

  return (await response.json()) as Service;
}

export async function deleteService(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/services/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Failed to delete service");
  }
}

export async function reorderServices(token: string, orderedIds: number[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) =>
      updateService(token, id, { sortOrder: index }),
    ),
  );
}

export async function fetchPage(token: string, slug: string): Promise<PageDetail> {
  return fetchAdminApi<PageDetail>(`/api/admin/pages/${slug}`, token);
}

export interface CreateSectionPayload {
  key: string;
  type: string;
  title?: string | null;
  content?: Record<string, unknown>;
  sortOrder?: number;
}

export interface UpdatePagePayload {
  title?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  showInNav?: boolean;
  navOrder?: number;
  navTitle?: string | null;
}

export async function createSection(token: string, pageSlug: string, payload: CreateSectionPayload): Promise<PageSection> {
  const response = await fetch(`${API_BASE_URL}/api/admin/pages/${pageSlug}/sections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Failed to create section");
  }

  return (await response.json()) as PageSection;
}

export async function deleteSection(token: string, pageSlug: string, sectionKey: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/pages/${pageSlug}/sections/${sectionKey}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Failed to delete section");
  }
}

export async function updatePage(token: string, pageSlug: string, payload: UpdatePagePayload): Promise<PageDetail> {
  const response = await fetch(`${API_BASE_URL}/api/admin/pages/${pageSlug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Failed to update page");
  }

  return (await response.json()) as PageDetail;
}

export async function fetchSettings(token: string): Promise<SiteSettings> {
  return fetchAdminApi<SiteSettings>("/api/admin/settings", token);
}

export async function updateSettings(token: string, payload: Partial<SiteSettings>): Promise<SiteSettings> {
  const endpoint = `${API_BASE_URL}/api/admin/settings`;
  let response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  // Some production reverse proxies/shared hosts reject PUT with 405.
  // Retry with POST on the same endpoint, handled server-side as an update fallback.
  if (response.status === 405) {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  }

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string; errors?: Record<string, string> } | null;
    const firstError = data?.errors ? Object.values(data.errors)[0] : null;
    throw new Error(firstError ?? data?.error ?? "Failed to update settings");
  }

  return (await response.json()) as SiteSettings;
}

async function uploadSettingsAsset(token: string, endpoint: "/logo" | "/favicon", file: File): Promise<{ path: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/admin/settings${endpoint}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { errors?: { file?: string } } | null;
    throw new Error(data?.errors?.file ?? "Upload failed");
  }

  return (await response.json()) as { path: string };
}

export async function uploadLogo(token: string, file: File): Promise<{ path: string }> {
  return uploadSettingsAsset(token, "/logo", file);
}

export async function uploadFavicon(token: string, file: File): Promise<{ path: string }> {
  return uploadSettingsAsset(token, "/favicon", file);
}

export async function updateSection(
  token: string,
  slug: string,
  sectionKey: string,
  data: { title?: string | null; content?: Record<string, unknown>; sortOrder?: number },
): Promise<PageSection> {
  const response = await fetch(`${API_BASE_URL}/api/admin/pages/${slug}/sections/${sectionKey}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Update failed");
  }

  return (await response.json()) as PageSection;
}

export async function syncContactPage(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/pages/contact/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.warn("Contact sync failed");
  }
}

export async function revalidateFrontend(path?: string): Promise<void> {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin;
  const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || "dev-secret";

  try {
    await fetch(`${frontendUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ path }),
    });
  } catch (error) {
    console.warn("Revalidation failed:", error);
  }
}

export async function getSectionTypes(token: string): Promise<SectionTypesResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/pages/section-types`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      types: [
        { value: "hero-home", label: "Hero accueil", category: "hero" },
        { value: "hero", label: "Hero (grand)", category: "hero" },
        { value: "hero-compact", label: "Hero (compact)", category: "hero" },
        { value: "text", label: "Texte", category: "content" },
        { value: "image", label: "Image", category: "content" },
        { value: "quote", label: "Citation", category: "content" },
        { value: "gallery", label: "Galerie", category: "content" },
        { value: "contact-form", label: "Formulaire de contact", category: "contact" },
        { value: "contact-info", label: "Infos de contact", category: "contact" },
        { value: "contact-cta", label: "Call to action", category: "contact" },
        { value: "google-map", label: "Carte Google Maps", category: "contact" },
        { value: "service-selector", label: "Selecteur de soins", category: "services" },
        { value: "services-preview", label: "Apercu des services", category: "services" },
        { value: "benefits-grid", label: "Grille avantages (2 colonnes)", category: "layout" },
        { value: "parcours", label: "Parcours", category: "about" },
        { value: "formations", label: "Formations", category: "about" },
      ],
      animations: [
        { value: "none", label: "Aucune" },
        { value: "fade-up", label: "Fondu + montee" },
        { value: "fade-down", label: "Fondu + descente" },
        { value: "slide-left", label: "Glissement gauche" },
        { value: "slide-right", label: "Glissement droite" },
        { value: "zoom-in", label: "Zoom entrant" },
        { value: "zoom-out", label: "Zoom sortant" },
        { value: "bounce", label: "Rebond" },
      ],
    };
  }

  return (await response.json()) as SectionTypesResponse;
}

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Identifiants invalides.");
  }

  return (await response.json()) as LoginResponse;
}

export async function registerAdmin(name: string, email: string, password: string): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    if (payload) {
      throw new Error(JSON.stringify(payload));
    }
    throw new Error("Erreur d'inscription.");
  }

  return (await response.json()) as RegisterResponse;
}

export async function fetchAdminApi<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    throw new Error(`API error: ${response.status}`);
  }

  return (await response.json()) as T;
}
