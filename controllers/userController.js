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
        //console.log(req.session.userLogged.id)
        res.render('profile', { user: req.session.userLogged });
    },

    loginProcess: async (req, res) => {
        try {
            const { email, pass } = req.body;
            if (!email || !pass) {
                return res.status(400).send('Por favor, ingrese email y contraseña');
            }
            const userFound = await Users.findOne({
                where: { email }
            });
            if (!userFound) {
                return res.status(404).send('Usuario no encontrado');
            }
            const userPassword = userFound.password
            const passwordMatches = bcrypt.compareSync(pass, userPassword);
            if (passwordMatches) {
                delete userFound.password;
                req.session.userLogged = userFound;
                res.redirect('/');
            } else {
                res.status(401).send('Contraseña incorrecta');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            res.status(500).send('Error en el proceso de inicio de sesión');
        }
    },

    create: (req, res) => {
        const errors = validationResult(req);
        const randomNumber = Math.floor(Math.random() * 3);
        let imagenPerfil = '';

        if (req.body.genero === 'mujer') {
            imagenPerfil = `/images/users/women${randomNumber}.jpg`;
        } else if (req.body.genero === 'hombre') {
            imagenPerfil = `/images/users/man${randomNumber}.jpg`;
        } else {
            imagenPerfil = `/images/users/cat${randomNumber}.jpg`;
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
    },

    edit: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await Users.findByPk(userId);

            if (!user) {
                return res.send('Usuario no encontrado');
            }
            res.render('editProfile', { user });
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
            res.send('Error al obtener los datos del usuario');
        }
    },

    update: async (req, res) => {
        try {
            let userFound = await Users.findOne({
                where: {
                    id: req.params.id
                }
            });

            if (!userFound) {
                return res.status(404).send('Usuario no encontrado');
            }

            const updateData = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                alias: req.body.alias,
            };

            if (req.body.password) {
                const hashedPassword = bcrypt.hashSync(req.body.password, 10);
                updateData.password = hashedPassword;
            }

            await Users.update(updateData, {
                where: {
                    id: req.params.id
                }
            });

            let updatedUser = await Users.findOne({
                where: {
                    id: req.params.id
                }
            });

            req.session.userLogged = updatedUser;
            res.redirect('/usuario/profile');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).send('Error al actualizar usuario');
        }
    }
}

module.exports = userController;