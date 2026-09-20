// pages/ForbiddenPage/ForbiddenPage.tsx
// Pantalla clara de error 403, en lugar de un crash, cuando un usuario
// autenticado intenta entrar a una ruta que no le corresponde por rol.
import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-6xl font-semibold text-brand-500">403</p>
        <h1 className="font-display text-xl font-semibold mt-3">No tienes acceso a esta sección</h1>
        <p className="text-ink/60 mt-2">
          Tu rol actual no tiene permisos para ver esta página. Si crees que es un error,
          contacta a un Administrador.
        </p>
        <Link to="/dashboard" className="btn-primary inline-block mt-6">
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
