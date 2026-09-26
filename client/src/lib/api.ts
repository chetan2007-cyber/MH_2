// Centralized HTTP API Client for Kaushal Platform
// Reads backend URL from VITE_API_URL environment variable with fallback

import type { ApiResponse } from '../types/api';

const API_BASE = (import.meta.env.VITE_API_URL as string) || '/api';

let memoryToken: string | null = null;

// Initialize token from storage if present (pure auth token, not mock data)
try {
  memoryToken = localStorage.getItem('kaushal_auth_token');
} catch {
  // Ignore storage restrictions
}

export function setMemoryToken(token: string | null) {
  memoryToken = token;
  try {
    if (token) {
      localStorage.setItem('kaushal_auth_token', token);
    } else {
      localStorage.removeItem('kaushal_auth_token');
    }
  } catch {
    // Ignore
  }
}

export function getMemoryToken(): string | null {
  return memoryToken;
}

export class ApiClientError extends Error {
  status?: number;
  code?: string;
  details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function mapStatusToMessage(status: number): string {
  switch (status) {
    case 400: return 'Bad Request: The server could not understand the request.';
    case 401: return 'Unauthorized: Please log in to continue.';
    case 403: return 'Forbidden: You do not have permission to access this resource.';
    case 404: return 'Not Found: The requested resource could not be found.';
    case 409: return 'Conflict: A resource with these details already exists.';
    case 422: return 'Validation Error: Please check your input parameters.';
    case 429: return 'Too Many Requests: Rate limit exceeded. Please wait a moment.';
    case 500: return 'Internal Server Error: Backend encountered an issue. Please try again.';
    case 502:
    case 503:
    case 504: return 'Service Unavailable: Backend is temporarily offline or unreachable.';
    default: return `Request failed with HTTP status ${status}.`;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (memoryToken) {
    headers['Authorization'] = `Bearer ${memoryToken}`;
  }

  // Request timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
      credentials: 'include', // Automatically attaches HttpOnly cookies
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || data?.message || mapStatusToMessage(res.status);
      return {
        success: false,
        error: errorMsg,
        status: res.status,
      };
    }

    return {
      success: true,
      data: data?.data !== undefined ? data.data : data,
      message: data?.message,
      status: res.status,
      ...data,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timed out after 15 seconds. Please try again.',
        status: 408,
      };
    }
    return {
      success: false,
      error: err.message || 'Network connection failed. Please check if the server is running.',
    };
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export const api = apiClient;

