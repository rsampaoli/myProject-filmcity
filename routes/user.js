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

//validation
router.get('/validate/:id', userController.validation)
router.post('/validate/:id', userController.validate)

//profile
router.get('/profile', userController.profile);
router.get('/edit/:id', userController.edit);
router.post('/edit/:id', userController.update);

module.exports = router;