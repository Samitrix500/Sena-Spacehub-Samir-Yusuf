// controllers/equipos.controller.js
const { equipos, getNextId } = require('../data/equipos');

function listarEquipos(req, res) {
  return res.json(equipos);
}

function crearEquipo(req, res) {
  const { placaSena, marcaModelo, ram, ambiente, estado } = req.body;

  if (!placaSena || !marcaModelo || !ram || !ambiente) {
    return res.status(400).json({ message: 'placaSena, marcaModelo, ram y ambiente son obligatorios.' });
  }

  const yaExiste = equipos.some((e) => e.placaSena.toLowerCase() === String(placaSena).toLowerCase());
  if (yaExiste) {
    return res.status(409).json({ message: `Ya existe un equipo con la placa ${placaSena}.` });
  }

  const nuevoEquipo = {
    id: getNextId(),
    placaSena,
    marcaModelo,
    ram,
    ambiente,
    estado: estado === 'En Mantenimiento' ? 'En Mantenimiento' : 'Operativo',
  };

  equipos.push(nuevoEquipo);
  return res.status(201).json(nuevoEquipo);
}

function actualizarEquipo(req, res) {
  const { placaSena } = req.params;
  const equipo = equipos.find((e) => e.placaSena === placaSena);

  if (!equipo) {
    return res.status(404).json({ message: `No se encontró un equipo con la placa ${placaSena}.` });
  }

  const { marcaModelo, ram, ambiente, estado } = req.body;
  if (marcaModelo !== undefined) equipo.marcaModelo = marcaModelo;
  if (ram !== undefined) equipo.ram = ram;
  if (ambiente !== undefined) equipo.ambiente = ambiente;
  if (estado !== undefined) {
    if (!['Operativo', 'En Mantenimiento'].includes(estado)) {
      return res.status(400).json({ message: "estado debe ser 'Operativo' o 'En Mantenimiento'." });
    }
    equipo.estado = estado;
  }

  return res.json(equipo);
}

function eliminarEquipo(req, res) {
  const { placaSena } = req.params;
  const index = equipos.findIndex((e) => e.placaSena === placaSena);

  if (index === -1) {
    return res.status(404).json({ message: `No se encontró un equipo con la placa ${placaSena}.` });
  }

  const [eliminado] = equipos.splice(index, 1);
  return res.json({ message: 'Equipo eliminado correctamente.', equipo: eliminado });
}

module.exports = { listarEquipos, crearEquipo, actualizarEquipo, eliminarEquipo };
