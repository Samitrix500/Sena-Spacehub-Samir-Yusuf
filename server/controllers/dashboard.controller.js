// controllers/dashboard.controller.js
const { equipos } = require('../data/equipos');
const { prestamos } = require('../data/prestamos');

function getStats(req, res) {
  const totalEquipos = equipos.length;
  const equiposOperativos = equipos.filter((e) => e.estado === 'Operativo').length;
  const equiposMantenimiento = equipos.filter((e) => e.estado === 'En Mantenimiento').length;
  const prestamosActivos = prestamos.filter((p) => p.estado === 'Activo').length;

  const tasaOcupacion = totalEquipos > 0 ? Math.round((prestamosActivos / totalEquipos) * 100) : 0;

  // Ocupación por ambiente: % de equipos de ese ambiente actualmente prestados.
  const ambientes = [...new Set(equipos.map((e) => e.ambiente))];
  const laboratoriosOcupacion = ambientes.map((ambiente) => {
    const equiposDelAmbiente = equipos.filter((e) => e.ambiente === ambiente);
    const placasDelAmbiente = equiposDelAmbiente.map((e) => e.placaSena);
    const prestadosDelAmbiente = prestamos.filter(
      (p) => p.estado === 'Activo' && placasDelAmbiente.includes(p.equipoPlaca)
    ).length;
    const porcentaje = equiposDelAmbiente.length > 0
      ? Math.round((prestadosDelAmbiente / equiposDelAmbiente.length) * 100)
      : 0;
    return {
      nombre: ambiente,
      porcentaje,
      activo: prestadosDelAmbiente > 0,
    };
  });

  const equiposEnMantenimiento = equipos.filter((e) => e.estado === 'En Mantenimiento').length;
  const incidencias = {
    total: equiposEnMantenimiento,
    alta: Math.ceil(equiposEnMantenimiento / 2),
    media: Math.floor(equiposEnMantenimiento / 2),
  };

  return res.json({
    totalEquipos,
    equiposOperativos,
    equiposMantenimiento,
    prestamosActivos,
    tasaOcupacionGlobal: `${tasaOcupacion}%`,
    incidencias,
    laboratoriosOcupacion,
  });
}

module.exports = { getStats };
