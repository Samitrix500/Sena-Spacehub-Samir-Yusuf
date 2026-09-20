// data/usuarios.js
// Usuarios semilla. Las contraseñas están hasheadas con bcrypt ("123456" para los 3).
// Puedes generar nuevos hashes con: node -e "console.log(require('bcryptjs').hashSync('123456', 10))"
const bcrypt = require('bcryptjs');

const passwordHash = bcrypt.hashSync('123456', 10);

const usuarios = [
  {
    id: 1,
    nombre: 'Carlos Andrés Ramírez',
    email: 'admin@sena.edu.co',
    password: passwordHash,
    rol: 'Administrador',
    ficha: 'N/A',
  },
  {
    id: 2,
    nombre: 'Sandra Yanneth Rueda',
    email: 'instructor@sena.edu.co',
    password: passwordHash,
    rol: 'Instructor',
    ficha: 'N/A',
  },
  {
    id: 3,
    nombre: 'Samir Yusuf Hernández',
    email: 'aprendiz@sena.edu.co',
    password: passwordHash,
    rol: 'Aprendiz',
    ficha: '3407169',
  },
  {
    id: 4,
    nombre: 'Laura Camila Torres',
    email: 'aprendiz2@sena.edu.co',
    password: passwordHash,
    rol: 'Aprendiz',
    ficha: '3407169',
  },
];

module.exports = usuarios;
