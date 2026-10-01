const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    req.usuarioRol = decoded.rol;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};

module.exports = authMiddleware;