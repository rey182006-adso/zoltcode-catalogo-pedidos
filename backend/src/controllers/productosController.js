// src/controllers/productosController.js
// Logica del catalogo de productos

const pool = require('../config/db');

// GET /api/productos - publico, solo muestra productos activos
async function listarProductos(req, res) {
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, descripcion, precio, stock, imagen_url FROM productos WHERE activo = true ORDER BY fecha_creacion DESC'
    );
    res.json({ productos: resultado.rows });
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).json({ error: 'Error interno al obtener los productos' });
  }
}

// GET /api/productos/:id - publico
async function obtenerProducto(req, res) {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      'SELECT id, nombre, descripcion, precio, stock, imagen_url FROM productos WHERE id = $1 AND activo = true',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ producto: resultado.rows[0] });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno al obtener el producto' });
  }
}

// POST /api/productos - solo admin
async function crearProducto(req, res) {
  try {
    const { nombre, descripcion, precio, stock, imagen_url } = req.body;

    if (!nombre || precio === undefined) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    if (precio < 0) {
      return res.status(400).json({ error: 'El precio no puede ser negativo' });
    }

    const resultado = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, descripcion || null, precio, stock || 0, imagen_url || null]
    );

    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto: resultado.rows[0],
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno al crear el producto' });
  }
}

// PUT /api/productos/:id - solo admin
async function actualizarProducto(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen_url } = req.body;

    const productoExistente = await pool.query('SELECT id FROM productos WHERE id = $1', [id]);
    if (productoExistente.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const resultado = await pool.query(
      `UPDATE productos
       SET nombre = COALESCE($1, nombre),
           descripcion = COALESCE($2, descripcion),
           precio = COALESCE($3, precio),
           stock = COALESCE($4, stock),
           imagen_url = COALESCE($5, imagen_url)
       WHERE id = $6
       RETURNING *`,
      [nombre, descripcion, precio, stock, imagen_url, id]
    );

    res.json({
      mensaje: 'Producto actualizado exitosamente',
      producto: resultado.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno al actualizar el producto' });
  }
}

// DELETE /api/productos/:id - solo admin (soft delete)
async function eliminarProducto(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      'UPDATE productos SET activo = false WHERE id = $1 RETURNING id',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno al eliminar el producto' });
  }
}

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};