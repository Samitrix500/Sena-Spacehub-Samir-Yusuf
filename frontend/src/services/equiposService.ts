// services/equiposService.ts
import { apiFetch } from './api';
import type { Equipo } from '../types';

export function listarEquipos() {
  return apiFetch<Equipo[]>('/equipos');
}

export function crearEquipo(data: Omit<Equipo, 'id'>) {
  return apiFetch<Equipo>('/equipos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function actualizarEquipo(placaSena: string, data: Partial<Omit<Equipo, 'id' | 'placaSena'>>) {
  return apiFetch<Equipo>(`/equipos/${placaSena}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function eliminarEquipo(placaSena: string) {
  return apiFetch<{ message: string }>(`/equipos/${placaSena}`, {
    method: 'DELETE',
  });
}
