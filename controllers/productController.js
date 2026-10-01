const Producto = require('../models/Producto');

const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    const producto = new Producto({
      nombre,
      precio,
      stock,
    });
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre: req.body.nombre, precio: req.body.precio, stock: req.body.stock },
      { new: true }
    );
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    res.json({ msg: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };