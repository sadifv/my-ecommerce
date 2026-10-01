const Pedido = require('../models/Pedido');

const crearPedido = async (req, res) => {
  try {
    const { productos, total, direccion } = req.body;
    const usuario = req.usuarioId;
    
    const pedido = new Pedido({
      usuario,
      productos,
      total,
      direccion,
    });
    
    await pedido.save();
    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('usuario', 'nombre email').populate('productos.producto', 'nombre precio');
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate('usuario', 'nombre email').populate('productos.producto', 'nombre precio');
    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido no encontrado' });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { crearPedido, getPedidos, getPedidoById };