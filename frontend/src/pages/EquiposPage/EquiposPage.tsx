// pages/EquiposPage/EquiposPage.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import type { Equipo } from '../../types';
import * as equiposService from '../../services/equiposService';

const estadoBadge: Record<Equipo['estado'], string> = {
  Operativo: 'bg-brand-100 text-brand-700',
  'En Mantenimiento': 'bg-signal-amber/20 text-signal-amber',
};

export default function EquiposPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.rol === 'Administrador';

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function cargarEquipos() {
    setLoading(true);
    equiposService
      .listarEquipos()
      .then(setEquipos)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el inventario.'))
      .finally(() => setLoading(false));
  }

  useEffect(cargarEquipos, []);

  async function handleEliminar(equipo: Equipo) {
    const confirmacion = await Swal.fire({
      title: `¿Eliminar ${equipo.placaSena}?`,
      text: `Esta acción quitará "${equipo.marcaModelo}" del inventario.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#C4462B',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await equiposService.eliminarEquipo(equipo.placaSena);
      await Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false });
      cargarEquipos();
    } catch (err) {
      Swal.fire('Error', err instanceof Error ? err.message : 'No se pudo eliminar el equipo.', 'error');
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Equipos</h1>
          <p className="text-ink/50 text-sm mt-1">Inventario de equipos de cómputo</p>
        </div>
        {isAdmin && (
          <Link to="/equipos/nuevo" className="btn-primary">
            + Registrar equipo
          </Link>
        )}
      </header>

      {loading && <p className="text-ink/50">Cargando inventario…</p>}
      {error && <p className="text-signal-red">{error}</p>}

      {!loading && !error && (
        <div className="bg-surface rounded border border-line overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-canvas text-ink/50 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Placa SENA</th>
                <th className="text-left px-4 py-3">Marca / Modelo</th>
                <th className="text-left px-4 py-3">RAM</th>
                <th className="text-left px-4 py-3">Ambiente</th>
                <th className="text-left px-4 py-3">Estado</th>
                {isAdmin && <th className="text-left px-4 py-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {equipos.map((eq) => (
                <tr key={eq.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{eq.placaSena}</td>
                  <td className="px-4 py-3">{eq.marcaModelo}</td>
                  <td className="px-4 py-3">{eq.ram}</td>
                  <td className="px-4 py-3">{eq.ambiente}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${estadoBadge[eq.estado]}`}>{eq.estado}</span>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="text-brand-600 hover:underline text-sm font-medium"
                          onClick={() => navigate(`/equipos/${eq.placaSena}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="text-signal-red hover:underline text-sm font-medium"
                          onClick={() => handleEliminar(eq)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {equipos.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-4 py-6 text-center text-ink/40">
                    No hay equipos registrados todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
