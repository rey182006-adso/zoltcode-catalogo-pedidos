// src/routes/authRoutes.js
// Rutas relacionadas con autenticacion (registro, login)

const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/authController');

router.post('/login', login);

module.exports = router;