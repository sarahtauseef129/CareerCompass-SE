// API Base URL - can be overridden by environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: any,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Extract error message from API response
export function getErrorMessage(error: any): string {
  if (error instanceof ApiError) {
    // Handle validation errors array (from class-validator)
    if (Array.isArray(error.data.message)) {
      return error.data.message[0]; // Return first validation error
    }
    // Handle single error message
    return error.data.message || 'API request failed';
  }
  return error instanceof Error ? error.message : 'An unknown error occurred';
}

// Check if error is an API validation error (not a network error)
export function isApiValidationError(error: any): boolean {
  return error instanceof ApiError;
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data, data.message || 'API request failed');
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function clearAuthToken(): void {
  localStorage.removeItem('authToken');
}
