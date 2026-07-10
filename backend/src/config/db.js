// src/config/db.js
// Configuracion de la conexion a la base de datos PostgreSQL (Neon)

const { Pool } = require('pg');
require('dotenv').config();

// Un "Pool" mantiene varias conexiones abiertas y las reutiliza,
// en vez de abrir/cerrar una conexion nueva cada vez (mas eficiente)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon requiere SSL, esto es estandar para conexiones cloud
  },
});

// Verificamos la conexion al iniciar, para saber de inmediato si algo esta mal
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.stack);
    return;
  }
  console.log('Conexion a la base de datos exitosa');
  release(); // liberamos esta conexion de prueba de vuelta al pool
});

module.exports = pool;