import type { AuthResponse, ErrorResponse, HealthResponse, HistoryResponse, JobResponse, JobStatusResponse, OkResponse, RunResponse } from "./types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const SESSION_TOKEN_KEY = "mathsolve_session_token";

function resolvedApiBaseUrl() {
  if (!API_BASE_URL) return "";
  const url = new URL(API_BASE_URL);
  const browserHost = window.location.hostname;
  const isLoopbackApi = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  const isLoopbackBrowser = browserHost === "127.0.0.1" || browserHost === "localhost";
  if (isLoopbackApi && !isLoopbackBrowser) url.hostname = browserHost;
  return url.toString().replace(/\/$/, "");
}

export function backendUrl(path: string) {
  const apiBaseUrl = resolvedApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("Missing VITE_API_BASE_URL. Set it in frontend/.env.local.");
  }
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(backendUrl(path), { ...options, credentials: "include", headers });
  const data = (await response.json().catch(() => ({}))) as Partial<ErrorResponse>;
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem(SESSION_TOKEN_KEY);
    throw new Error(data.error || validationMessage(data.detail) || "Request failed");
  }
  return data as T;
}

function validationMessage(detail: unknown) {
  if (!Array.isArray(detail)) return "";
  return detail
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const message = "msg" in item && typeof item.msg === "string" ? item.msg : "";
      const loc = "loc" in item && Array.isArray(item.loc) ? item.loc.filter((part: unknown) => part !== "body").join(".") : "";
      return loc && message ? `${loc}: ${message}` : message;
    })
    .filter(Boolean)
    .join("; ");
}

export function getHealth() {
  return request<HealthResponse>("/api/health");
}

export function getCurrentUser() {
  return request<AuthResponse>("/api/auth/me");
}

export function loginUser(accountIdentifier: string, password: string) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_identifier: accountIdentifier, password }),
  }).then(saveAuthToken);
}

export function registerUser(accountIdentifier: string, password: string, passwordConfirmation: string, displayName: string) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_identifier: accountIdentifier, password, password_confirmation: passwordConfirmation, display_name: displayName }),
  }).then(saveAuthToken);
}

export function startGuestSession() {
  return request<AuthResponse>("/api/auth/guest", { method: "POST" }).then(saveAuthToken);
}

export function logoutUser() {
  return request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }).finally(() => localStorage.removeItem(SESSION_TOKEN_KEY));
}

export function requestPasswordReset(accountIdentifier: string) {
  return request<OkResponse>("/api/auth/password-reset/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_identifier: accountIdentifier }),
  });
}

export function resetPassword(token: string, password: string, passwordConfirmation: string) {
  return request<OkResponse>("/api/auth/password-reset/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password, password_confirmation: passwordConfirmation }),
  });
}

export function requestEmailConfirmation() {
  return request<OkResponse>("/api/auth/email-confirmation/request", { method: "POST" });
}

export function confirmEmail(token: string) {
  return request<AuthResponse>("/api/auth/email-confirmation/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

export function getHistory() {
  return request<HistoryResponse>("/api/history");
}

export function uploadWorksheet(files: File[]) {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));
  return request<RunResponse>("/api/upload", { method: "POST", body: form });
}

export function getRun(runId: string) {
  return request<RunResponse>(`/api/runs/${encodeURIComponent(runId)}`);
}

export function convertRun(runId: string) {
  return request<RunResponse>(`/api/runs/${encodeURIComponent(runId)}/convert`, { method: "POST" });
}

export function solveRun(runId: string, problemIds: string[]) {
  return request<RunResponse>(`/api/runs/${encodeURIComponent(runId)}/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem_ids: problemIds }),
  });
}

export function getJobStatuses(jobIds: string[]) {
  return request<JobStatusResponse>("/api/jobs/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_ids: jobIds }),
  });
}

export function retryJob(runId: string, jobId: string) {
  return request<JobResponse>(`/api/runs/${encodeURIComponent(runId)}/jobs/${encodeURIComponent(jobId)}/retry`, { method: "POST" });
}

export function inputImageUrl(path?: string | null) {
  if (path?.startsWith("blob:") || path?.startsWith("data:") || path?.startsWith("http://") || path?.startsWith("https://")) return path;
  return path ? authenticatedImageUrl(backendUrl(path)) : "";
}

export function problemImageUrl(runId: string, name: string) {
  return authenticatedImageUrl(backendUrl(`/api/runs/${encodeURIComponent(runId)}/images/${encodeURIComponent(name)}`));
}

export function imageRefUrl(path?: string | null) {
  return path ? authenticatedImageUrl(backendUrl(path)) : "";
}

function saveAuthToken(data: AuthResponse) {
  if (data.session_token) localStorage.setItem(SESSION_TOKEN_KEY, data.session_token);
  return data;
}

function authenticatedImageUrl(url: string) {
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) return url;
  const parsed = new URL(url);
  parsed.searchParams.set("session_token", token);
  return parsed.toString();
}
