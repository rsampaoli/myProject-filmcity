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
        let userFound = await Users.findOne({ // buscar el email del usuario en la base de datos
            where: {
                email: req.body.email
            }
        });
        if (!userFound) { // validar si el usuario no existe en la base de datos
            return res.send('no se encuentra el usuario');
        } else {
            if (userFound.password === req.body.pass) {  //pregunto si la pass coincide, la que pone en la pag, con la BD
                delete userFound.password;               //en caso de positivo, borro la pass para no enviarla con el req
                req.session.userLogged = userFound;      //asigno a req.session el usuario encontrado   
                res.redirect('/')
            } else {
                res.send('esa no es la pass')
            }
        };
    },

    create: (req, res) => {
        const errors = validationResult(req);
        console.log(errors.mapped())
        if (errors.isEmpty() && req.body.soy_admin === 'opa') {
            Users.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                alias: req.body.alias,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                avatar_id: req.body.genero,
                admin: true,
            }).then(() => {
                res.redirect("/");
            })
        } else if (errors.isEmpty()) {
            Users.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                alias: req.body.alias,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                avatar_id: req.body.genero,
                admin: false,
            }).then(() => {
                res.redirect("/");
            })
        } else {
            res.render('register', { errors: errors.mapped(), old: req.body })
        }
    }
}

module.exports = userController;