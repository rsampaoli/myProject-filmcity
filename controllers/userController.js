const db = require('../database/models');
const { Op } = require('sequelize');
const { Users } = db;
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')


const userController = {

    register: function (req, res) {
        res.render('register')
    },

    login: function (req, res) {
        res.render('login')
    },

    profile: function (req, res) {
        res.render('profile', { user: req.session.userLogged });
    },

    loginProcess: async (req, res) => {
        try {
            let userFound = await Users.findOne({
                where: {
                    email: req.body.email
                }
            });
    
            if (!userFound) {
                return res.send('Usuario no encontrado');
            }
    
            const sonPassIguales = bcrypt.compare(req.body.pass, userFound.password);
    
            if (sonPassIguales) {
                delete userFound.password;
                req.session.userLogged = userFound;
                res.redirect('/');
            } else {
                res.send('Contraseña incorrecta');
            }
        } catch (error) {
            // Manejo de errores
            console.error(error);
            res.send('Error en el proceso de inicio de sesión');
        }
    },

    create: (req, res) => {
        const errors = validationResult(req);
        const randomNumber = Math.floor(Math.random() * 3);
        let imagenPerfil = '';

        if (req.body.genero === 'mujer') {
            imagenPerfil = `/images/users/women${randomNumber}.jpg`;
        } else {
            imagenPerfil = `/images/users/man${randomNumber}.jpg`;
        }

        if (errors.isEmpty()) {
            const isAdmin = req.body.soy_admin === 'opa';
            Users.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                alias: req.body.alias,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                avatar_id: isAdmin ? '/images/users/admin.jpg' : imagenPerfil,
                admin: isAdmin,
            })
                .then(() => {
                    res.redirect('/');
                })
                .catch((error) => {
                    res.render('register', { errors: error, old: req.body });
                });
        } else {
            res.render('register', { errors: errors.mapped(), old: req.body });
        }
    }
}

module.exports = userController;