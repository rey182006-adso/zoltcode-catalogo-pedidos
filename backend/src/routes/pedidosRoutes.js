// src/routes/pedidosRoutes.js

const express = require('express');
const router = express.Router();
const { crearPedido, misPedidos } = require('../controllers/pedidosController');
const { verificarToken } = require('../middleware/authMiddleware');

// Todas las rutas de pedidos requieren estar autenticado
router.post('/', verificarToken, crearPedido);
router.get('/', verificarToken, misPedidos);

module.exports = router;