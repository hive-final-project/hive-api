const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const uploader = require('../configs/storage.config');
const secure = require('../middlewares/secure.middleware');

router.post('/new', 
    secure.checkRole('PRODUCER'),
    productController.newProduct);
router.put('/edit',
    secure.checkRole('PRODUCER'),
    uploader.single('attachment'), 
    productController.editProduct);
router.delete('/:id', 
    secure.checkRole('PRODUCER'),
    productController.delete);


module.exports = router;