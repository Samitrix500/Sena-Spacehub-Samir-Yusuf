// pages/DetalleEquipoPage/DetalleEquipoPage.tsx
// Formulario de edición, precargado con los datos actuales del equipo.
import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as equiposService from '../../services/equiposService';
import type { Equipo } from '../../types';

export default function DetalleEquipoPage() {
  const { placaSena } = useParams<{ placaSena: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Omit<Equipo, 'id' | 'placaSena'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placaSena) return;
    equiposService
      .listarEquipos()
      .then((equipos) => {
        const equipo = equipos.find((e) => e.placaSena === placaSena);
        if (!equipo) {
          setError('No se encontró el equipo solicitado.');
          return;
        }
        setForm({
          marcaModelo: equipo.marcaModelo,
          ram: equipo.ram,
          ambiente: equipo.ambiente,
          estado: equipo.estado,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el equipo.'))
      .finally(() => setLoading(false));
  }, [placaSena]);

  function handleChange(field: keyof NonNullable<typeof form>, value: string) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!placaSena || !form) return;
    setError(null);
    setSubmitting(true);
    try {
      await equiposService.actualizarEquipo(placaSena, form);
      await Swal.fire({ title: 'Cambios guardados', icon: 'success', timer: 1500, showConfirmButton: false });
      navigate('/equipos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el equipo.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-ink/50">Cargando equipo…</p>;
  if (error || !form) return <p className="text-signal-red">{error || 'Equipo no disponible.'}</p>;

  return (
    <div className="max-w-lg">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Editar equipo</h1>
        <p className="text-ink/50 text-sm mt-1">Placa SENA: {placaSena}</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-surface rounded border border-line p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Marca / Modelo</label>
          <input
            required
            className="input-field"
            value={form.marcaModelo}
            onChange={(e) => handleChange('marcaModelo', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">RAM</label>
          <input
            required
            className="input-field"
            value={form.ram}
            onChange={(e) => handleChange('ram', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Ambiente</label>
          <input
            required
            className="input-field"
            value={form.ambiente}
            onChange={(e) => handleChange('ambiente', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Estado</label>
          <select
            className="input-field"
            value={form.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
          >
            <option value="Operativo">Operativo</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
          </select>
        </div>

        {error && <p className="text-sm text-signal-red">{error}</p>}

        <div className="flex justify-end gap-3 mt-2">
          <Link to="/equipos" className="btn-secondary">Cancelar</Link>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
