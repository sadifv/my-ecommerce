const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // Protege todas las rutas de productos

router.get('/', productController.getProductos);
router.get('/:id', productController.getProductoById);
router.post('/', productController.createProducto);
router.put('/:id', productController.updateProducto);
router.delete('/:id', productController.deleteProducto);

module.exports = router;