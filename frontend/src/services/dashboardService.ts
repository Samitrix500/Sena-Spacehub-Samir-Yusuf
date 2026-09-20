// services/dashboardService.ts
import { apiFetch } from './api';
import type { DashboardStats } from '../types';

export function getDashboardStats() {
  return apiFetch<DashboardStats>('/dashboard/stats');
}
