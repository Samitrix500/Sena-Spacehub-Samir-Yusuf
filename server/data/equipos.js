// data/equipos.js
// Persistencia en memoria (array). En una migración a BD real, esto se
// convertiría en un modelo (ej. Sequelize/Mongoose) sin tocar los controladores.
const equipos = [
  { id: 1, placaSena: 'SENA-1001', marcaModelo: 'Dell Latitude 5420', ram: '16GB DDR4', ambiente: 'Ambiente 301 - Desarrollo Web (ADSO)', estado: 'Operativo' },
  { id: 2, placaSena: 'SENA-1002', marcaModelo: 'HP ProBook 440 G8', ram: '8GB DDR4', ambiente: 'Ambiente 301 - Desarrollo Web (ADSO)', estado: 'Operativo' },
  { id: 3, placaSena: 'SENA-1003', marcaModelo: 'Lenovo ThinkPad E14', ram: '16GB DDR4', ambiente: 'Ambiente 302 - Redes y Bases de Datos', estado: 'Operativo' },
  { id: 4, placaSena: 'SENA-1004', marcaModelo: 'Dell Vostro 3510', ram: '8GB DDR4', ambiente: 'Ambiente 302 - Redes y Bases de Datos', estado: 'En Mantenimiento' },
  { id: 5, placaSena: 'SENA-1005', marcaModelo: 'Acer Aspire 5', ram: '8GB DDR4', ambiente: 'Ambiente 303 - Mantenimiento Hardware', estado: 'Operativo' },
  { id: 6, placaSena: 'SENA-1006', marcaModelo: 'HP EliteBook 840 G7', ram: '16GB DDR4', ambiente: 'Ambiente 303 - Mantenimiento Hardware', estado: 'En Mantenimiento' },
  { id: 7, placaSena: 'SENA-1007', marcaModelo: 'Dell Latitude 3420', ram: '8GB DDR4', ambiente: 'Ambiente 301 - Desarrollo Web (ADSO)', estado: 'Operativo' },
  { id: 8, placaSena: 'SENA-1008', marcaModelo: 'Lenovo IdeaPad 3', ram: '8GB DDR4', ambiente: 'Ambiente 302 - Redes y Bases de Datos', estado: 'Operativo' },
];

let nextId = equipos.length + 1;
const getNextId = () => nextId++;

module.exports = { equipos, getNextId };
