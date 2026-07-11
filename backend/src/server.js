// src/server.js
// Punto de entrada del backend

const express = require('express');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que Express entienda JSON en el cuerpo de las peticiones
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const productosRoutes = require('./routes/productosRoutes');
app.use('/api/productos', productosRoutes);

// Ruta de prueba simple, para confirmar que el servidor responde
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de ZoltCode - Catalogo y Pedidos funcionando' });
});

// Ruta de prueba para confirmar que la base de datos responde
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ conexion: 'exitosa', hora_servidor: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fallo la conexion a la base de datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});