// pages/DashboardPage/DashboardPage.tsx
import { useEffect, useState } from 'react';
import type { DashboardStats } from '../../types';
import * as dashboardService from '../../services/dashboardService';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-ink/50">Cargando estadísticas…</p>;
  }

  if (error || !stats) {
    return <p className="text-signal-red">{error || 'No hay datos disponibles.'}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-ink/50 text-sm mt-1">Estado general del inventario en tiempo real</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card border-brand-500">
          <span className="text-xs uppercase tracking-wide text-ink/40 font-medium">Total de equipos</span>
          <span className="font-display text-3xl font-semibold">{stats.totalEquipos}</span>
          <span className="text-xs text-ink/50">
            {stats.equiposOperativos} operativos · {stats.equiposMantenimiento} en mantenimiento
          </span>
        </div>
        <div className="stat-card border-signal-orange">
          <span className="text-xs uppercase tracking-wide text-ink/40 font-medium">Préstamos activos</span>
          <span className="font-display text-3xl font-semibold">{stats.prestamosActivos}</span>
        </div>
        <div className="stat-card border-signal-amber">
          <span className="text-xs uppercase tracking-wide text-ink/40 font-medium">Ocupación global</span>
          <span className="font-display text-3xl font-semibold">{stats.tasaOcupacionGlobal}</span>
        </div>
        <div className="stat-card border-signal-red">
          <span className="text-xs uppercase tracking-wide text-ink/40 font-medium">Incidencias</span>
          <span className="font-display text-3xl font-semibold">{stats.incidencias.total}</span>
          <span className="text-xs text-ink/50">
            {stats.incidencias.alta} alta · {stats.incidencias.media} media
          </span>
        </div>
      </section>

      <section className="bg-surface rounded p-6 border border-line">
        <h2 className="font-display text-lg font-semibold mb-4">Ocupación por ambiente</h2>
        <div className="flex flex-col gap-4">
          {stats.laboratoriosOcupacion.map((lab) => (
            <div key={lab.nombre}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{lab.nombre}</span>
                <span className="text-ink/50">{lab.porcentaje}%</span>
              </div>
              <div className="w-full bg-canvas rounded-full h-3 border border-line">
                <div
                  className={`h-3 rounded-full ${lab.activo ? 'bg-brand-500' : 'bg-line'}`}
                  style={{ width: `${lab.porcentaje}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
