// src/middleware/authMiddleware.js
// Verifica que la peticion tenga un token JWT valido antes de continuar

const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  // El token se espera en el header: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'No se proporciono un token de autenticacion' });
  }

  const token = authHeader.split(' ')[1]; // separamos "Bearer" del token real

  if (!token) {
    return res.status(401).json({ error: 'Formato de token invalido' });
  }

  try {
    // Verifica la firma del token con nuestro secreto, y que no haya expirado
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // dejamos disponible { id, rol } para el resto de la peticion
    next(); // todo bien, dejamos continuar hacia el controlador
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }
}

// Middleware adicional: solo permite continuar si el usuario es admin
// Se usa DESPUES de verificarToken, ya que necesita req.usuario
function soloAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };