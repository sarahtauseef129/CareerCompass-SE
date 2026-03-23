import { apiCall, setAuthToken, clearAuthToken } from './api';
import { User } from '@/types/career';

export interface AuthResponse {
  id: number;
  email: string;
  name: string;
}

/**
 * Register a new user with the backend
 */
export async function registerUserApi(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  return apiCall<AuthResponse>('/users/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

/**
 * Login user with the backend
 */
export async function loginUserApi(email: string, password: string): Promise<AuthResponse> {
  return apiCall<AuthResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Store auth response and token
 */
export function storeAuthResponse(response: AuthResponse, token?: string): User {
  if (token) {
    setAuthToken(token);
  }

  const user: User = {
    id: response.id.toString(),
    email: response.email,
    name: response.name,
  };

  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
}

/**
 * Get current user from storage
 */
export function getCurrentUserFromStorage(): User | null {
  const data = localStorage.getItem('currentUser');
  return data ? JSON.parse(data) : null;
}

/**
 * Logout user
 */
export function logoutUserApi(): void {
  clearAuthToken();
  localStorage.removeItem('currentUser');
}
