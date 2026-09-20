// services/prestamosService.ts
import { apiFetch } from './api';
import type { Prestamo, Usuario } from '../types';

export function listarPrestamos() {
  return apiFetch<Prestamo[]>('/prestamos');
}

export function solicitarPrestamo(data: { equipoPlaca: string; userId?: number }) {
  return apiFetch<Prestamo>('/prestamos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function registrarDevolucion(id: number) {
  return apiFetch<Prestamo>(`/prestamos/${id}/devolver`, {
    method: 'PUT',
  });
}

export function listarAprendices() {
  return apiFetch<Usuario[]>('/usuarios/aprendices');
}
