const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const uploader = require('../configs/storage.config');
const secure = require('../middlewares/secure.middleware');

router.post('/register', authController.register);
router.post('/authenticate',authController.authenticate);
router.get('/profile', 
    secure.isAuthenticated,
    authController.getUser);
router.put('/profile', 
    secure.isAuthenticated,
    uploader.single('attachment'), 
    authController.editUser);
router.get('/logout', authController.logout);

module.exports = router;