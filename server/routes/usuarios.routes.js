// routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const { listarAprendices } = require('../controllers/usuarios.controller');
const authenticateToken = require('../middlewares/authenticateToken');
const requireRole = require('../middlewares/requireRole');

router.use(authenticateToken);
router.get('/aprendices', requireRole('Administrador'), listarAprendices);

module.exports = router;
