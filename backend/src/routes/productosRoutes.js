// src/routes/productosRoutes.js
// Rutas del catalogo de productos

const express = require('express');
const router = express.Router();
const {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productosController');
const { verificarToken, soloAdmin } = require('../middleware/authMiddleware');

// Rutas publicas - cualquiera puede ver el catalogo
router.get('/', listarProductos);
router.get('/:id', obtenerProducto);

// Rutas protegidas - solo admin autenticado puede modificar el catalogo
router.post('/', verificarToken, soloAdmin, crearProducto);
router.put('/:id', verificarToken, soloAdmin, actualizarProducto);
router.delete('/:id', verificarToken, soloAdmin, eliminarProducto);

module.exports = router;