// src/controllers/authController.js
// Logica de registro de usuarios

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    // Buscamos al usuario por email
    const resultado = await pool.query(
      'SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE email = $1',
      [email]
    );

    // Mensaje generico a proposito: no decimos si fallo el email o la contraseña,
    // para no darle pistas a un atacante sobre que emails existen en el sistema
    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const usuario = resultado.rows[0];

    // Comparamos la contraseña enviada con el hash guardado
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    // Generamos el token JWT con datos minimos (id y rol), nunca la contraseña
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // el token expira en 2 horas, por seguridad
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno al iniciar sesion' });
  }
}

module.exports = { registrar, login };