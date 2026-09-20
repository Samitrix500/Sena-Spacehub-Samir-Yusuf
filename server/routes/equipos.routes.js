// routes/equipos.routes.js
const express = require('express');
const router = express.Router();
const {
  listarEquipos,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo,
} = require('../controllers/equipos.controller');
const authenticateToken = require('../middlewares/authenticateToken');
const requireRole = require('../middlewares/requireRole');

// Todas las rutas de equipos requieren estar autenticado.
router.use(authenticateToken);

router.get('/', listarEquipos); // cualquier usuario autenticado
router.post('/', requireRole('Administrador'), crearEquipo);
router.put('/:placaSena', requireRole('Administrador'), actualizarEquipo);
router.delete('/:placaSena', requireRole('Administrador'), eliminarEquipo);

module.exports = router;
