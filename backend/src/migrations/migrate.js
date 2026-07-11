// src/migrations/migrate.js
// Ejecuta los archivos .sql de esta carpeta contra la base de datos, en orden

const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const archivos = [
  '001_create_usuarios.sql',
  '002_create_productos.sql',
  '003_create_pedidos.sql',
];

async function runMigrations() {
  try {
    for (const archivo of archivos) {
      const rutaArchivo = path.join(__dirname, archivo);
      const sql = fs.readFileSync(rutaArchivo, 'utf8');

      console.log(`Ejecutando migracion: ${archivo}`);
      await pool.query(sql);
    }
    console.log('Todas las migraciones se completaron correctamente');
  } catch (error) {
    console.error('Error al ejecutar la migracion:', error.message);
  } finally {
    await pool.end();
    process.exit();
  }
}

runMigrations();