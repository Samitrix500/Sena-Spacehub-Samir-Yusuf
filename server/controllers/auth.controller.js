// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarios = require('../data/usuarios');

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
  }

  const usuario = usuarios.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!usuario) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  const passwordValida = bcrypt.compareSync(password, usuario.password);
  if (!passwordValida) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  const payload = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    ficha: usuario.ficha,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

  return res.json({ accessToken, user: payload });
}

function logout(req, res) {
  // Con JWT sin estado no hay "sesión" que borrar en el servidor;
  // este endpoint existe para cumplir el contrato pedido y como punto
  // de extensión futuro (ej. lista negra de tokens, logging de auditoría).
  return res.json({ message: 'Sesión cerrada correctamente.' });
}

function register(req, res) {
  const { nombre, email, password, rol, ficha } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ message: 'nombre, email, password y rol son obligatorios.' });
  }

  const rolesValidos = ['Aprendiz', 'Instructor', 'Administrador'];
  if (!rolesValidos.includes(rol)) {
    return res.status(400).json({ message: `Rol inválido. Debe ser uno de: ${rolesValidos.join(', ')}.` });
  }

  const yaExiste = usuarios.some((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (yaExiste) {
    return res.status(409).json({ message: 'Ya existe un usuario con ese email.' });
  }

  const nuevoUsuario = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1,
    nombre,
    email,
    password: bcrypt.hashSync(password, 10),
    rol,
    ficha: ficha || 'N/A',
  };

  usuarios.push(nuevoUsuario);

  const { password: _omit, ...usuarioSinPassword } = nuevoUsuario;
  return res.status(201).json({ user: usuarioSinPassword });
}

module.exports = { login, logout, register };
