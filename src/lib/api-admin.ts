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
  title: string | null;
  content: Record<string, unknown>;
  sortOrder: number;
  updatedAt: string;
}

export interface PageDetail {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  sections: PageSection[];
  updatedAt: string;
}

export interface PageListItem {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
}

export async function fetchPages(token: string): Promise<PageListItem[]> {
  const data = await fetchAdminApi<{ items: PageListItem[] }>("/api/admin/pages", token);
  return data.items;
}

export async function fetchPage(token: string, slug: string): Promise<PageDetail> {
  return fetchAdminApi<PageDetail>(`/api/admin/pages/${slug}`, token);
}

export async function updateSection(
  token: string,
  slug: string,
  sectionKey: string,
  data: { title?: string | null; content?: Record<string, unknown> },
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
