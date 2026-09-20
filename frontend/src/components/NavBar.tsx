// components/NavBar.tsx
// Barra lateral de navegación: muestra el usuario logueado, su rol (badge)
// y los enlaces disponibles según ese rol, más el botón de cerrar sesión.
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const rolBadgeStyles: Record<string, string> = {
  Administrador: 'bg-brand-100 text-brand-700',
  Instructor: 'bg-signal-amber/20 text-signal-amber',
  Aprendiz: 'bg-line text-ink/70',
};

const linkBase =
  'flex items-center gap-3 px-4 py-2.5 rounded font-medium text-sm transition-colors';
const linkActive = 'bg-brand-500 text-white';
const linkInactive = 'text-ink/70 hover:bg-brand-50 hover:text-ink';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="w-64 shrink-0 bg-surface border-r border-line min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-line">
        <p className="font-display text-lg font-semibold text-brand-700 leading-tight">
          SENA SpaceHub
        </p>
        <p className="text-xs text-ink/50 mt-0.5">Gestión de inventarios</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/equipos"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          Equipos
        </NavLink>
        <NavLink
          to="/prestamos"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          Préstamos
        </NavLink>
      </nav>

      {user && (
        <div className="px-4 py-4 border-t border-line">
          <p className="text-sm font-medium text-ink truncate">{user.nombre}</p>
          <span className={`badge mt-1.5 ${rolBadgeStyles[user.rol] || 'bg-line'}`}>
            {user.rol}
          </span>
          <button onClick={handleLogout} className="btn-secondary w-full mt-3 text-sm">
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  );
}
