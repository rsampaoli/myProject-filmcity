const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

//register
router.get('/registro', userController.register);
router.post('/registro', userController.create);


//login
router.get('/login', userController.login);

module.exports = router;