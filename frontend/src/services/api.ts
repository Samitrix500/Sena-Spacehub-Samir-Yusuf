// services/api.ts
// Helper centralizado de fetch. Inyecta automáticamente el token JWT
// (guardado en sessionStorage) en cada petición y normaliza el manejo de errores.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

interface ApiFetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { skipAuth, headers, ...rest } = options;

  const token = sessionStorage.getItem('sena_spacehub_token');

  const finalHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = body?.message || `Error ${response.status} al consultar ${path}`;
    throw new ApiError(message, response.status);
  }

  return body as T;
}
