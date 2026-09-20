// services/authService.ts
import { apiFetch } from './api';
import type { LoginResponse } from '../types';

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return apiFetch<{ message: string }>('/auth/logout', { method: 'POST' });
}
