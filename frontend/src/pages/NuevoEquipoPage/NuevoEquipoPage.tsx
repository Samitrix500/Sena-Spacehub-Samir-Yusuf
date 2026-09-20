// pages/NuevoEquipoPage/NuevoEquipoPage.tsx
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as equiposService from '../../services/equiposService';
import type { Equipo } from '../../types';

export default function NuevoEquipoPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    placaSena: '',
    marcaModelo: '',
    ram: '',
    ambiente: '',
    estado: 'Operativo' as Equipo['estado'],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await equiposService.crearEquipo(form);
      await Swal.fire({ title: 'Equipo registrado', icon: 'success', timer: 1500, showConfirmButton: false });
      navigate('/equipos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el equipo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Registrar equipo</h1>
        <p className="text-ink/50 text-sm mt-1">Añade un nuevo equipo al inventario</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-surface rounded border border-line p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Placa SENA</label>
          <input
            required
            className="input-field"
            placeholder="SENA-1009"
            value={form.placaSena}
            onChange={(e) => handleChange('placaSena', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Marca / Modelo</label>
          <input
            required
            className="input-field"
            placeholder="Dell Latitude 5420"
            value={form.marcaModelo}
            onChange={(e) => handleChange('marcaModelo', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">RAM</label>
          <input
            required
            className="input-field"
            placeholder="16GB DDR4"
            value={form.ram}
            onChange={(e) => handleChange('ram', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Ambiente</label>
          <input
            required
            className="input-field"
            placeholder="Ambiente 301 - Desarrollo Web (ADSO)"
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
            {submitting ? 'Guardando…' : 'Registrar equipo'}
          </button>
        </div>
      </form>
    </div>
  );
}
