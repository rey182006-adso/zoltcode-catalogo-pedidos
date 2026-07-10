// src/routes/authRoutes.js
// Rutas relacionadas con autenticacion (registro, login, perfil)

const express = require('express');
const router = express.Router();
const { registrar, login, perfil } = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');

router.post('/registro', registrar);
router.post('/login', login);
router.get('/perfil', verificarToken, perfil);

module.exports = router;