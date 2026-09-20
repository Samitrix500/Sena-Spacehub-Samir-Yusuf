// routes/prestamos.routes.js
const express = require('express');
const router = express.Router();
const {
  listarPrestamos,
  crearPrestamo,
  registrarDevolucion,
} = require('../controllers/prestamos.controller');
const authenticateToken = require('../middlewares/authenticateToken');
const requireRole = require('../middlewares/requireRole');

router.use(authenticateToken);

router.get('/', listarPrestamos); // filtrado por rol dentro del controlador
router.post('/', crearPrestamo); // Aprendiz (autoservicio) y Administrador; Instructor bloqueado en el controlador
router.put('/:id/devolver', requireRole('Administrador'), registrarDevolucion);

module.exports = router;
