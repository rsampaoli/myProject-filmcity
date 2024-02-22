const db = require('../database/models');
const session = require('express-session');
const { Op } = require('sequelize');
const { Users } = db;
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')

const transporter = require('../config/mailer');
const { generarStringAleatorio, obtenerRutaImagenPerfil } = require('../utils/funciones');



const userController = {

    register: function (req, res) {
        res.render('register')
    },

    login: function (req, res) {
        res.render('login')
    },

    profile: function (req, res) {
        //console.log(req.session.userLogged.id)
        let user = req.session.userLogged
        if (user && user.validated) {
            res.render('profile', { user: user });
        } else {
            res.render('index');
        }
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
                if (userFound.validated == false) {
                    res.write('<script>alert("Tu email no esta validado");</script>');
                    res.end(`<script>window.location.href ="/usuario/validate/${userFound.id}";</script>`);
                }
                res.write('<script>alert("Usuario Logueado Exitosamente");</script>');
                res.end('<script>window.location.href = "/";</script>');
            } else {
                res.status(401).send('Contraseña incorrecta');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            res.status(500).send('Error en el proceso de inicio de sesión');
        }
    },

    create: async (req, res) => {
        try {
            const errors = validationResult(req);
            const randomNumber = Math.floor(Math.random() * 3);
            const imagenPerfil = obtenerRutaImagenPerfil(req.body.genero, randomNumber)

            if (errors.isEmpty()) {
                const isAdmin = req.body.soy_admin === 'opa';
                const userMail = req.body.email;
                const userAlias = req.body.alias;
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const stringAleatorio = generarStringAleatorio();
                let sessData = req.session;
                sessData.token = stringAleatorio;

                await transporter.sendMail({
                    from: " 👻👻👻👻👻👻👻👻 ",
                    to: userMail,
                    subject: "Bienvenido " + userAlias,
                    html: `<b>Tu clave es ${stringAleatorio}</b>`,
                });

                await Users.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    alias: userAlias,
                    email: userMail,
                    password: hashedPassword,
                    avatar_id: isAdmin ? '/images/users/admin.jpg' : imagenPerfil,
                    admin: isAdmin,
                    validated: false,
                });

                res.send(`<script>alert("Usuario Creado Exitosamente");</script><script>window.location.href = "/usuario/login";</script>`);
            } else {
                res.render('register', { errors: errors.array(), old: req.body });
            }
        } catch (error) {
            console.error('Error en la creación de usuario:', error);
            res.render('register', { errors: [{ msg: 'Error en el proceso de registro' }], old: req.body });
        }
    },

    validation: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await Users.findByPk(userId);

            if (!user) {
                return res.send('Usuario no encontrado');
            }
            if (user.validated) {
                res.write('<script>alert("Tu email ya se encuentra validado");</script>');
                res.end('<script>window.location.href = "/usuario/login";</script>');
            }
            res.render('user_validation', { user });
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
            req.send('Error al obtener los datos del usuario');
        }
    },

    validate: async (req, res) => {
        try {
            if (req.body.token == req.session.token) {
                const updateData = {
                    validated: true,
                };

                await Users.update(updateData, {
                    where: {
                        id: req.params.id
                    }
                });

                const updatedUser = await Users.findOne({
                    where: {
                        id: req.params.id
                    }
                });

                delete req.session.token;
                req.session.userLogged = updatedUser;

                res.write('<script>alert("Mail validado correctamente");</script>');
                res.end('<script>window.location.href = "/usuario/login";</script>');
            } else {
                res.write('<script>alert("Token de validación incorrecto")</script>');
                res.end(`<script>window.location.href = "/usuario/login";</script>`);
            }
        } catch (error) {
            console.error('Error al validar el usuario:', error);
            res.write('<script>alert("Error al validar el usuario")</script>');
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