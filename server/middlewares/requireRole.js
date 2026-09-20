// middlewares/requireRole.js
// Middleware "factory": recibe la lista de roles permitidos y devuelve un
// middleware que corta la petición con 403 si el rol del usuario no está en la lista.
// Este chequeo SIEMPRE vive en el backend; el frontend solo oculta botones,
// nunca es la fuente real de autorización.
function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado.' });
    }
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}.`,
      });
    }
    next();
  };
}

module.exports = requireRole;
