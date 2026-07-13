// src/server.js
// Punto de entrada del backend

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Headers de seguridad HTTP (protege contra varios ataques comunes)
app.use(helmet());

// CORS: solo permitimos que el frontend autorizado consuma esta API
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// Permite que Express entienda JSON en el cuerpo de las peticiones
app.use(express.json());

// Limite de intentos: evita fuerza bruta en login/registro
// Maximo 20 intentos cada 15 minutos por IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authLimiter, authRoutes);

const productosRoutes = require('./routes/productosRoutes');
app.use('/api/productos', productosRoutes);

const pedidosRoutes = require('./routes/pedidosRoutes');
app.use('/api/pedidos', pedidosRoutes);

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