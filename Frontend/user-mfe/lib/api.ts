interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Calls go to Next.js API route handlers which proxy to the backend
  const res = await fetch(`/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `API error: ${res.status}`);
  }

  return res.json();
}

// Auth API
export interface AuthResponse {
  jwt: string | null;
  message: string;
  status: boolean;
  twoFactorRequired: boolean;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address?: string;
  isPremium?: boolean;
  twoFactorEnabled?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  isPremium: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export function signup(payload: SignupPayload) {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: payload,
  });
}

export function signin(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/auth/signin", {
    method: "POST",
    body: payload,
  });
}

export function verifyOtp(payload: VerifyOtpPayload) {
  return apiRequest<AuthResponse>("/auth/verify-otp", {
    method: "POST",
    body: payload,
  });
}

export function getUserProfile(token: string) {
  // Calls Next.js route handler at /api/user/profile (single /api prefix from apiRequest)
  return apiRequest<UserProfile>("/user/profile", { token });
}

export function getAllUsers(token: string) {
  // Calls Next.js route handler at /api/user (single /api prefix from apiRequest)
  return apiRequest<UserProfile[]>("/user", { token });
}
