// src/migrations/migrate.js
// Ejecuta los archivos .sql de esta carpeta contra la base de datos, en orden

const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runMigrations() {
  try {
    const archivo = path.join(__dirname, '001_create_usuarios.sql');
    const sql = fs.readFileSync(archivo, 'utf8');

    console.log('Ejecutando migracion: 001_create_usuarios.sql');
    await pool.query(sql);
    console.log('Migracion completada: tabla usuarios lista');
  } catch (error) {
    console.error('Error al ejecutar la migracion:', error.message);
  } finally {
    await pool.end(); // cerramos el pool porque este script termina aqui
    process.exit();
  }
}

runMigrations();