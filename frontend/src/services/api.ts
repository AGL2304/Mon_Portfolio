import type { PortfolioContent, UploadResponse } from "../types/portfolio";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

interface ApiError {
  detail?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Une erreur est survenue.";
    try {
      const payload = (await response.json()) as ApiError;
      if (payload.detail) message = payload.detail;
    } catch {
      message = response.statusText;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }
  return (await response.json()) as T;
}

/**
 * Resoud un chemin relatif renvoye par l'API ("/api/public/cv") en URL absolue
 * vers le backend si le frontend tape une URL absolue (ex: http://api.example.com/api).
 * Si l'API base est relative (/api), on renvoie tel quel.
 */
export function resolveBackendUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (API_BASE_URL.startsWith("/")) return path;
  try {
    return new URL(API_BASE_URL).origin + path;
  } catch {
    return path;
  }
}

// ===========================================================
//  CONTENT
// ===========================================================

export async function fetchPublicContent(): Promise<PortfolioContent> {
  const content = await request<PortfolioContent>("/public/content");
  // Resoud les chemins relatifs pour le rendu cross-origin
  if (content.profile.cv_url) {
    content.profile.cv_url = resolveBackendUrl(content.profile.cv_url);
  }
  if (content.profile.profile_image) {
    content.profile.profile_image = resolveBackendUrl(content.profile.profile_image);
  }
  return content;
}

export async function fetchAdminContent(
  token: string | null,
): Promise<PortfolioContent> {
  return request<PortfolioContent>("/admin/content", {}, token);
}

export async function saveAdminContent(
  token: string | null,
  content: PortfolioContent,
): Promise<PortfolioContent> {
  return request<PortfolioContent>(
    "/admin/content",
    { method: "PUT", body: JSON.stringify(content) },
    token,
  );
}

// ===========================================================
//  AUTH
// ===========================================================

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function loginAdmin(email: string, password: string): Promise<string> {
  const body: Record<string, string> = { password };
  if (email) body.email = email;
  const payload = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return payload.access_token;
}

// ===========================================================
//  UPLOADS (CV + photo)
// ===========================================================

async function uploadFile(
  endpoint: string,
  token: string | null,
  file: File,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    let message = "Erreur lors de l'upload.";
    try {
      const payload = (await response.json()) as ApiError;
      if (payload.detail) message = payload.detail;
    } catch {
      message = response.statusText;
    }
    throw new Error(message);
  }

  const data = (await response.json()) as UploadResponse;
  data.url = resolveBackendUrl(data.url);
  return data;
}

export function uploadCV(
  token: string | null,
  file: File,
): Promise<UploadResponse> {
  return uploadFile("/admin/cv", token, file);
}

export function uploadPhoto(
  token: string | null,
  file: File,
): Promise<UploadResponse> {
  return uploadFile("/admin/photo", token, file);
}

export async function deleteCV(token: string | null): Promise<void> {
  await request<void>("/admin/cv", { method: "DELETE" }, token);
}

export async function deletePhoto(token: string | null): Promise<void> {
  await request<void>("/admin/photo", { method: "DELETE" }, token);
}

// ===========================================================
//  URL helpers (cache-busting pour photo/CV)
// ===========================================================

export function bustCache(url: string): string {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}t=${Date.now()}`;
}
