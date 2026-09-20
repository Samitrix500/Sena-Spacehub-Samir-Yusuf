// types/index.ts — interfaces compartidas por todo el frontend

export type Rol = 'Aprendiz' | 'Instructor' | 'Administrador';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  ficha: string;
}

export interface Equipo {
  id: number;
  placaSena: string;
  marcaModelo: string;
  ram: string;
  ambiente: string;
  estado: 'Operativo' | 'En Mantenimiento';
}

export interface Prestamo {
  id: number;
  userId: number;
  aprendiz: string;
  ficha: string;
  equipoPlaca: string;
  horaInicio: string;
  estado: 'Activo' | 'Devuelto';
  creadoPorRol: Rol;
}

export interface LaboratorioOcupacion {
  nombre: string;
  porcentaje: number;
  activo: boolean;
}

export interface DashboardStats {
  totalEquipos: number;
  equiposOperativos: number;
  equiposMantenimiento: number;
  prestamosActivos: number;
  tasaOcupacionGlobal: string;
  incidencias: { total: number; alta: number; media: number };
  laboratoriosOcupacion: LaboratorioOcupacion[];
}

export interface LoginResponse {
  accessToken: string;
  user: Usuario;
}
