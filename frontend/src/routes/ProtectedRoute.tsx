// routes/ProtectedRoute.tsx
// Guard de rutas: exige sesión activa y, opcionalmente, un rol específico.
// Si no hay sesión -> redirige a /login. Si hay sesión pero el rol no encaja -> /403.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Rol } from '../types';

interface ProtectedRouteProps {
  requiredRole?: Rol | Rol[];
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <p className="font-display text-ink/60">Cargando sesión…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const rolesPermitidos = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user || !rolesPermitidos.includes(user.rol)) {
      return <Navigate to="/403" replace />;
    }
  }

  return <Outlet />;
}
