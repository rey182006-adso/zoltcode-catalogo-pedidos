// src/controllers/pedidosController.js
// Logica de creacion y consulta de pedidos

const pool = require('../config/db');

// POST /api/pedidos - crea un pedido a partir de una lista de items
// Body esperado: { items: [{ producto_id, cantidad }, ...] }
async function crearPedido(req, res) {
  const client = await pool.connect();
  try {
    const { items } = req.body;
    const usuarioId = req.usuario.id; // viene del token, nunca del body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto en el pedido' });
    }

    await client.query('BEGIN'); // iniciamos una transaccion

    let total = 0;
    const itemsValidados = [];

    // Validamos cada producto: que exista, este activo, y tenga stock suficiente
    for (const item of items) {
      const { producto_id, cantidad } = item;

      if (!producto_id || !cantidad || cantidad <= 0) {
        throw { status: 400, mensaje: 'Cada item debe tener producto_id y cantidad valida' };
      }

      const productoResult = await client.query(
        'SELECT id, precio, stock FROM productos WHERE id = $1 AND activo = true',
        [producto_id]
      );

      if (productoResult.rows.length === 0) {
        throw { status: 404, mensaje: `Producto ${producto_id} no encontrado` };
      }

      const producto = productoResult.rows[0];

      if (producto.stock < cantidad) {
        throw { status: 400, mensaje: `Stock insuficiente para el producto ${producto_id}` };
      }

      const precioUnitario = parseFloat(producto.precio);
      total += precioUnitario * cantidad;

      itemsValidados.push({ producto_id, cantidad, precioUnitario });
    }

    // Creamos el pedido
    const pedidoResult = await client.query(
      `INSERT INTO pedidos (usuario_id, total) VALUES ($1, $2) RETURNING *`,
      [usuarioId, total]
    );
    const pedido = pedidoResult.rows[0];

    // Creamos cada item y descontamos el stock
    for (const item of itemsValidados) {
      await client.query(
        `INSERT INTO items_pedido (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedido.id, item.producto_id, item.cantidad, item.precioUnitario]
      );

      await client.query(
        `UPDATE productos SET stock = stock - $1 WHERE id = $2`,
        [item.cantidad, item.producto_id]
      );
    }

    await client.query('COMMIT'); // confirmamos todo junto

    res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido });

  } catch (error) {
    await client.query('ROLLBACK');

    // Log completo para vos como dev: siempre con el detalle real de Postgres
    console.error('Error al crear pedido:', {
      mensaje: error.message,
      code: error.code,
      detail: error.detail,
    });

    // Si el error ya viene con status/mensaje definidos por nuestras validaciones
    // (producto no encontrado, stock insuficiente, etc), respetamos eso
    if (error.status) {
      return res.status(error.status).json({ error: error.mensaje });
    }

    // Cualquier otro error (Postgres, conexión, etc) es un fallo interno real:
    // no exponemos detalles de la base de datos al cliente, por seguridad
    res.status(500).json({ error: 'Error interno al crear el pedido' });
  } finally {
    client.release();
  }
}

// GET /api/pedidos - historial del usuario autenticado
async function misPedidos(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const resultado = await pool.query(
      'SELECT id, estado_pago, total, fecha_creacion FROM pedidos WHERE usuario_id = $1 ORDER BY fecha_creacion DESC',
      [usuarioId]
    );

    res.json({ pedidos: resultado.rows });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error interno al obtener los pedidos' });
  }
}

module.exports = { crearPedido, misPedidos };