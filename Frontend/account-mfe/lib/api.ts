const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Account {
  id: number;
  userId: number;
  accountNumber: string;
  accountName: string;
  accountType: "SAVING" | "CHECKING" | "BUSINESS" | "FIXED_DEPOSIT";
  balance: number;
  interestRate: number;
  status: "ACTIVE" | "DORMANT" | "CLOSED";
  openedAt: string;
}

export interface CreateAccountRequest {
  accountName: string;
  accountType: "SAVING" | "CHECKING" | "BUSINESS" | "FIXED_DEPOSIT";
  balance: number;
  status: "ACTIVE" | "DORMANT" | "CLOSED";
}

import { ApiError, handleApiError } from "./errors";

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    // Check for tokens from various MFEs
    const token =
      typeof window !== "undefined" 
        ? localStorage.getItem("nigus_token") || localStorage.getItem("account_token") || localStorage.getItem("token")
        : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }

        throw new ApiError(errorMessage, response.status);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw handleApiError(error);
    }
  }

  // Account endpoints
  async getAccounts(): Promise<Account[]> {
    return this.request<Account[]>("/accounts");
  }

  async getAccount(id: number): Promise<Account> {
    return this.request<Account>(`/accounts/${id}`);
  }

  async createAccount(request: CreateAccountRequest): Promise<Account> {
    return this.request<Account>("/accounts", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getAccountBalance(id: number): Promise<number> {
    return this.request<number>(`/accounts/${id}/balance`);
  }

  async downloadAccountReport(): Promise<Blob> {
    // Use Next.js API route as a proxy to avoid CORS issues and keep token handling consistent
    const headers: Record<string, string> = {
      ...this.getAuthHeaders(),
    } as Record<string, string>;

    try {
      const response = await fetch("/api/reports/accounts", {
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.text();
          errorMessage = errorData || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }

        throw new ApiError(errorMessage, response.status);
      }

      return await response.blob();
    } catch (error) {
      console.error("PDF download failed:", error);
      throw handleApiError(error);
    }
  }
}

export const apiClient = new ApiClient();
