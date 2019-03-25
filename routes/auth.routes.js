const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register/user', authController.registerUser);
router.post('/register/producer', authController.registerProducer);
router.post('/authenticate/user',authController.authenticateUser);
router.post('/authenticate/producer',authController.authenticateProducer);
router.get('/profile', authController.getUser);
router.get('/logout', authController.logout);

module.exports = router;