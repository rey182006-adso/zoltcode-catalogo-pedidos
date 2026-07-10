// src/controllers/authController.js
// Logica de registro de usuarios

const bcrypt = require('bcrypt');
const pool = require('../config/db');

const SALT_ROUNDS = 10; // costo del hashing: mas alto = mas seguro pero mas lento

async function registrar(req, res) {
  try {
    const { nombre, email, password } = req.body;

    // Validacion basica: nunca confiar en que el frontend ya valido esto
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    // Verificamos si el email ya existe, para dar un mensaje claro
    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
    }

    // Hasheamos la contraseña - nunca guardamos la contraseña real
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Importante: el rol SIEMPRE es 'cliente' aqui, nunca viene del request del usuario
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, 'cliente')
       RETURNING id, nombre, email, rol, fecha_creacion`,
      [nombre, email, passwordHash]
    );

    const nuevoUsuario = resultado.rows[0];

    // Nunca devolvemos el password_hash en la respuesta
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario,
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno al registrar el usuario' });
  }
}

module.exports = { registrar };