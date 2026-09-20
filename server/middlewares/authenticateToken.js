// middlewares/authenticateToken.js
// Verifica que la petición traiga un JWT válido en el header Authorization.
// Si es válido, adjunta el payload decodificado en req.user para que las
// siguientes capas (controladores, requireRole) sepan quién hace la petición.
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado. Inicia sesión nuevamente.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado. Inicia sesión nuevamente.' });
    }
    req.user = payload; // { id, nombre, email, rol, ficha }
    next();
  });
}

module.exports = authenticateToken;
