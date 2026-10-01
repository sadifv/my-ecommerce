const adminMiddleware = (req, res, next) => {
  if (req.usuarioRol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado, requiere rol de admin' });
  }
  next();
};

module.exports = adminMiddleware;