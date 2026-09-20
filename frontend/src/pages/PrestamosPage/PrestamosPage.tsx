// pages/PrestamosPage/PrestamosPage.tsx
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import type { Equipo, Prestamo } from '../../types';
import * as prestamosService from '../../services/prestamosService';
import * as equiposService from '../../services/equiposService';
import PrestamoModal from '../../components/PrestamoModal';

const estadoBadge: Record<Prestamo['estado'], string> = {
  Activo: 'bg-brand-100 text-brand-700',
  Devuelto: 'bg-line text-ink/60',
};

export default function PrestamosPage() {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'Administrador';
  const puedeSolicitar = user?.rol === 'Aprendiz' || isAdmin;

  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  function cargarDatos() {
    setLoading(true);
    Promise.all([prestamosService.listarPrestamos(), equiposService.listarEquipos()])
      .then(([prestamosData, equiposData]) => {
        setPrestamos(prestamosData);
        setEquipos(equiposData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar la información.'))
      .finally(() => setLoading(false));
  }

  useEffect(cargarDatos, []);

  const equiposDisponibles = equipos.filter((eq) => {
    if (eq.estado !== 'Operativo') return false;
    const tienePrestamoActivo = prestamos.some((p) => p.equipoPlaca === eq.placaSena && p.estado === 'Activo');
    return !tienePrestamoActivo;
  });

  async function handleDevolver(prestamo: Prestamo) {
    const confirmacion = await Swal.fire({
      title: `¿Registrar devolución?`,
      text: `Equipo ${prestamo.equipoPlaca} — ${prestamo.aprendiz}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, devolver',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2F8F3B',
    });
    if (!confirmacion.isConfirmed) return;

    try {
      await prestamosService.registrarDevolucion(prestamo.id);
      await Swal.fire({ title: 'Devolución registrada', icon: 'success', timer: 1500, showConfirmButton: false });
      cargarDatos();
    } catch (err) {
      Swal.fire('Error', err instanceof Error ? err.message : 'No se pudo registrar la devolución.', 'error');
    }
  }

  function formatearHora(iso: string) {
    return new Date(iso).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Préstamos</h1>
          <p className="text-ink/50 text-sm mt-1">
            {user?.rol === 'Aprendiz' ? 'Tu historial de préstamos' : 'Historial completo de préstamos'}
          </p>
        </div>
        {puedeSolicitar && (
          <button className="btn-primary" onClick={() => setModalAbierto(true)}>
            + Nuevo préstamo
          </button>
        )}
      </header>

      {loading && <p className="text-ink/50">Cargando préstamos…</p>}
      {error && <p className="text-signal-red">{error}</p>}

      {!loading && !error && (
        <div className="bg-surface rounded border border-line overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-canvas text-ink/50 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Aprendiz / Ficha</th>
                <th className="text-left px-4 py-3">Equipo</th>
                <th className="text-left px-4 py-3">Hora de salida</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.aprendiz}</p>
                    <p className="text-ink/40 text-xs">Ficha {p.ficha}</p>
                  </td>
                  <td className="px-4 py-3">{p.equipoPlaca}</td>
                  <td className="px-4 py-3">{formatearHora(p.horaInicio)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${estadoBadge[p.estado]}`}>{p.estado}</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.estado === 'Activo' && isAdmin ? (
                      <button
                        className="text-brand-600 hover:underline text-sm font-medium"
                        onClick={() => handleDevolver(p)}
                      >
                        Devolver
                      </button>
                    ) : (
                      <span className="text-ink/30 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {prestamos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink/40">
                    No hay préstamos registrados todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalAbierto && (
        <PrestamoModal
          equiposDisponibles={equiposDisponibles}
          onClose={() => setModalAbierto(false)}
          onSuccess={() => {
            setModalAbierto(false);
            cargarDatos();
          }}
        />
      )}
    </div>
  );
}
