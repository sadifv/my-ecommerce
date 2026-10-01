const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }
    
    usuario = new Usuario({
      nombre,
      email,
      password,
      rol: rol || 'cliente',
    });
    
    await usuario.save();
    
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }
    
    const isMatch = await usuario.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { register, login };