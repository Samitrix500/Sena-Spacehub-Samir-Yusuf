// controllers/prestamos.controller.js
const { prestamos, getNextId } = require('../data/prestamos');
const { equipos } = require('../data/equipos');
const usuarios = require('../data/usuarios');

function listarPrestamos(req, res) {
  const { id, rol } = req.user;

  if (rol === 'Aprendiz') {
    const propios = prestamos.filter((p) => p.userId === id);
    return res.json(propios);
  }

  // Instructor y Administrador ven el listado completo
  return res.json(prestamos);
}

function crearPrestamo(req, res) {
  const solicitante = req.user; // { id, nombre, rol, ficha, ... }
  const { equipoPlaca } = req.body;

  if (!equipoPlaca) {
    return res.status(400).json({ message: 'equipoPlaca es obligatorio.' });
  }

  const equipo = equipos.find((e) => e.placaSena === equipoPlaca);
  if (!equipo) {
    return res.status(404).json({ message: `No se encontró un equipo con la placa ${equipoPlaca}.` });
  }
  if (equipo.estado !== 'Operativo') {
    return res.status(409).json({ message: 'El equipo no está operativo y no puede prestarse.' });
  }

  const yaPrestado = prestamos.some((p) => p.equipoPlaca === equipoPlaca && p.estado === 'Activo');
  if (yaPrestado) {
    return res.status(409).json({ message: 'El equipo ya tiene un préstamo activo.' });
  }

  let userId, aprendiz, ficha;

  if (solicitante.rol === 'Aprendiz') {
    // Autoservicio: los datos se toman del token, nunca del body.
    userId = solicitante.id;
    aprendiz = solicitante.nombre;
    ficha = solicitante.ficha;
  } else if (solicitante.rol === 'Administrador') {
    // El administrador puede prestar a nombre de cualquier aprendiz.
    const { userId: userIdBody } = req.body;
    if (!userIdBody) {
      return res.status(400).json({ message: 'userId es obligatorio cuando el Administrador registra el préstamo.' });
    }
    const aprendizObjetivo = usuarios.find((u) => u.id === Number(userIdBody));
    if (!aprendizObjetivo) {
      return res.status(404).json({ message: 'No se encontró el usuario indicado.' });
    }
    userId = aprendizObjetivo.id;
    aprendiz = aprendizObjetivo.nombre;
    ficha = aprendizObjetivo.ficha;
  } else {
    // Instructor: solo lectura de préstamos, no puede solicitar.
    return res.status(403).json({ message: 'El rol Instructor no puede solicitar préstamos.' });
  }

  const nuevoPrestamo = {
    id: getNextId(),
    userId,
    aprendiz,
    ficha,
    equipoPlaca,
    horaInicio: new Date().toISOString(),
    estado: 'Activo',
    creadoPorRol: solicitante.rol,
  };

  prestamos.push(nuevoPrestamo);
  return res.status(201).json(nuevoPrestamo);
}

function registrarDevolucion(req, res) {
  const { id } = req.params;
  const prestamo = prestamos.find((p) => p.id === Number(id));

  if (!prestamo) {
    return res.status(404).json({ message: `No se encontró el préstamo #${id}.` });
  }
  if (prestamo.estado === 'Devuelto') {
    return res.status(409).json({ message: 'Este préstamo ya fue devuelto.' });
  }

  prestamo.estado = 'Devuelto';
  return res.json(prestamo);
}

module.exports = { listarPrestamos, crearPrestamo, registrarDevolucion };
