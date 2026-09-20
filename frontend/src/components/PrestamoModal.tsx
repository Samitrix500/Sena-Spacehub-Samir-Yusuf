// components/PrestamoModal.tsx
// Modal para "Solicitar préstamo". Si quien solicita es Aprendiz, sus datos
// vienen fijos del token (campos deshabilitados). Si es Administrador, puede
// elegir a qué aprendiz se le asigna el equipo.
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Equipo, Usuario } from '../types';
import * as prestamosService from '../services/prestamosService';

interface PrestamoModalProps {
  equiposDisponibles: Equipo[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function PrestamoModal({ equiposDisponibles, onClose, onSuccess }: PrestamoModalProps) {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'Administrador';

  const [equipoPlaca, setEquipoPlaca] = useState('');
  const [aprendices, setAprendices] = useState<Usuario[]>([]);
  const [aprendizId, setAprendizId] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      prestamosService
        .listarAprendices()
        .then(setAprendices)
        .catch(() => setError('No se pudo cargar la lista de aprendices.'));
    }
  }, [isAdmin]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!equipoPlaca) {
      setError('Selecciona un equipo.');
      return;
    }
    if (isAdmin && !aprendizId) {
      setError('Selecciona el aprendiz que recibirá el equipo.');
      return;
    }

    setSubmitting(true);
    try {
      await prestamosService.solicitarPrestamo({
        equipoPlaca,
        ...(isAdmin ? { userId: Number(aprendizId) } : {}),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el préstamo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded shadow-lg w-full max-w-md p-6">
        <h2 className="font-display text-xl font-semibold mb-4">Nuevo préstamo</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Aprendiz</label>
            {isAdmin ? (
              <select
                className="input-field"
                value={aprendizId}
                onChange={(e) => setAprendizId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Selecciona un aprendiz…</option>
                {aprendices.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre} — Ficha {a.ficha}
                  </option>
                ))}
              </select>
            ) : (
              <input className="input-field" value={user?.nombre || ''} disabled readOnly />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Ficha</label>
            <input
              className="input-field"
              value={
                isAdmin
                  ? aprendices.find((a) => a.id === aprendizId)?.ficha || ''
                  : user?.ficha || ''
              }
              disabled
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Equipo</label>
            <select
              className="input-field"
              value={equipoPlaca}
              onChange={(e) => setEquipoPlaca(e.target.value)}
            >
              <option value="">Selecciona un equipo operativo…</option>
              {equiposDisponibles.map((eq) => (
                <option key={eq.id} value={eq.placaSena}>
                  {eq.placaSena} — {eq.marcaModelo}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-signal-red">{error}</p>}

          <div className="flex justify-end gap-3 mt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Guardando…' : 'Confirmar préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
