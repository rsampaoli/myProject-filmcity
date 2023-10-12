const express = require('express');
const userController = require('../controllers/userController');
const { registerValidation } = require('../validations/userValidations')
const router = express.Router();

//register
router.get('/registro', userController.register);
router.post('/registro', registerValidation, userController.create);


//login
router.get('/login', userController.login);
router.post('/login', userController.loginProcess);

//profile
router.get('/profile', userController.profile);


module.exports = router;