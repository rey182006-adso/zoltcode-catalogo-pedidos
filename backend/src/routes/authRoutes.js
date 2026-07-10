// src/routes/authRoutes.js
// Rutas relacionadas con autenticacion (registro, login)

const express = require('express');
const router = express.Router();
const { registrar } = require('../controllers/authController');

router.post('/registro', registrar);

module.exports = router;