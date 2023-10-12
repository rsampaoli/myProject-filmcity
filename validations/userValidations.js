const { body } = require('express-validator');
const db = require('../database/models');
const { Users } = db;

module.exports = {

    registerValidation: [
        body('first_name')
            .notEmpty()
            .withMessage('*Este campo es obligatorio')
            .bail()
            .isLength({ min: 3 })
            .withMessage('*El nombre debe poseer al menos 3 caracteres'),

        body('last_name')
            .notEmpty()
            .withMessage('*Este campo es obligatorio')
            .bail()
            .isLength({ min: 3 })
            .withMessage('*El apellido debe poseer al menos 3 caracteres'),

        body('alias')
            .notEmpty()
            .withMessage('*Este campo es obligatorio')
            .bail()
            .isLength({ min: 2 })
            .withMessage('*El alias es muy corto'),

        body('email')
            .notEmpty()
            .withMessage('*Este campo es obligatorio')
            .bail()
            .isEmail()
            .withMessage('*Ingrese un mail válido')
            .custom(async function (value, { req }) {
                const usuario = await Users.findOne({
                    where: {
                        email: value
                    }
                });
                if (usuario) {
                    return Promise.reject(new Error('*Correo ya existe en la base de datos'));
                }
            }).withMessage('*Email ya registrado'),

        body('password')
            .notEmpty()
            .withMessage('*Este campo es obligatorio')
            .bail()
            .isLength({ min: 4 })
            .withMessage('*La contraseña debe tener minimo 4 caracteres')
    ]
}