import type { PortfolioContent } from "../types/portfolio";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

interface ApiError {
  detail?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Une erreur est survenue.";
    try {
      const payload = (await response.json()) as ApiError;
      if (payload.detail) {
        message = payload.detail;
      }
    } catch {
      message = response.statusText;
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

function resolveBackendUrl(path: string): string {
  if (!path.startsWith("/") || API_BASE_URL.startsWith("/")) return path;
  try {
    return new URL(API_BASE_URL).origin + path;
  } catch {
    return path;
  }
}

export async function fetchPublicContent(): Promise<PortfolioContent> {
  const content = await request<PortfolioContent>("/public/content");
  if (content.profile.cv_url) {
    content.profile.cv_url = resolveBackendUrl(content.profile.cv_url);
  }
  return content;
}

export async function fetchAdminContent(token?: string | null): Promise<PortfolioContent> {
  return request<PortfolioContent>("/admin/content", {}, token);
}

export async function saveAdminContent(
  token: string | null,
  content: PortfolioContent
): Promise<PortfolioContent> {
  return request<PortfolioContent>(
    "/admin/content",
    {
      method: "PUT",
      body: JSON.stringify(content),
    },
    token
  );
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function loginAdmin(email: string, password: string): Promise<string> {
  const payload = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return payload.access_token;
}

export async function uploadCV(token: string | null, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/admin/cv`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    let message = "Erreur lors de l'upload du CV.";
    try {
      const payload = (await response.json()) as { detail?: string };
      if (payload.detail) message = payload.detail;
    } catch {
      message = response.statusText;
    }
    throw new Error(message);
  }

  const data = (await response.json()) as { cv_url: string };
  return data.cv_url;
}

