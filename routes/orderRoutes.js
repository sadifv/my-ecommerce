const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, orderController.crearPedido);
router.get('/', authMiddleware, orderController.getPedidos);
router.get('/:id', authMiddleware, orderController.getPedidoById);

module.exports = router;