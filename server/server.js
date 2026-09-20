// server.js
// Punto de entrada del backend. Monta middlewares globales y las rutas
// bajo el prefijo /api/v1, tal como exige el enunciado.
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const equiposRoutes = require('./routes/equipos.routes');
const prestamosRoutes = require('./routes/prestamos.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', servicio: 'SENA SpaceHub API', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/equipos', equiposRoutes);
app.use('/api/v1/prestamos', prestamosRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);

// 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

// Manejador de errores centralizado
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

app.listen(PORT, () => {
  console.log(`SENA SpaceHub API corriendo en http://localhost:${PORT}`);
});
