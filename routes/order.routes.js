const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const secure = require('../middlewares/secure.middleware');

router.post('/new', 
    secure.checkRole('USER'),
    orderController.newOrder);

router.get('/list',
    secure.checkRole('PRODUCER'),
    orderController.listOrders);

router.put('/:id/edit',
    orderController.editOrder);

router.get('/:id',
    secure.checkRole('USER'),
    orderController.getOrder);

router.delete('/:id/delete', 
    secure.checkRole('USER'),
    orderController.deleteOrder);

router.put('/:id/send',
    secure.checkRole('USER'),
    orderController.sendOrder);


module.exports = router;