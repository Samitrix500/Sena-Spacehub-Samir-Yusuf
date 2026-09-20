// data/prestamos.js
const prestamos = [
  {
    id: 1,
    userId: 3,
    aprendiz: 'Samir Yusuf Hernández',
    ficha: '3407169',
    equipoPlaca: 'SENA-1002',
    horaInicio: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    estado: 'Activo',
    creadoPorRol: 'Aprendiz',
  },
  {
    id: 2,
    userId: 4,
    aprendiz: 'Laura Camila Torres',
    ficha: '3407169',
    equipoPlaca: 'SENA-1005',
    horaInicio: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    estado: 'Devuelto',
    creadoPorRol: 'Administrador',
  },
];

let nextId = prestamos.length + 1;
const getNextId = () => nextId++;

module.exports = { prestamos, getNextId };
