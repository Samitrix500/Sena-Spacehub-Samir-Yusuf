// controllers/usuarios.controller.js
// Endpoint de apoyo (no pedido explícitamente en el enunciado, pero necesario
// para que el Administrador pueda elegir "a nombre de qué aprendiz" presta un
// equipo desde el modal de Nuevo Préstamo).
const usuarios = require('../data/usuarios');

function listarAprendices(req, res) {
  const aprendices = usuarios
    .filter((u) => u.rol === 'Aprendiz')
    .map(({ password, ...resto }) => resto);
  return res.json(aprendices);
}

module.exports = { listarAprendices };
