const db = require('../database/models');
const { Op } = require('sequelize');
const { Users } = db;


const userController = {

    register: function (req, res) {
        res.render('register')
    },
    login: function (req, res) {
        res.render('login')
    },

    loginProcess: async (req, res) => {
        const userFound = await Users.findOne({ // buscar el email del usuario en la base de datos
            where: {
                email: req.body.email
            }

        });
        console.log(userFound)
        if (!userFound) { // validar si el usuario no existe en la base de datos
            return res.send('no se encuentra el usuario');
        } else {
            if (req.body.pass === userFound.password) {
                req.session.usuarioLogueado = {
                    id: userFound.id,
                    first_name: userFound.first_name,
                    last_name: userFound.last_name,
                    email: userFound.email,
                    avatar_id: userFound.avatar_id,
                    alias: userFound.alias
                }
                res.redirect('/')
            };
        }
        res.send('inicio incorrecto')
    },

    create: (req, res) => {
        Users.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            alias: req.body.alias,
            email: req.body.email,
            password: req.body.password,
            avatar_id: req.body.genero
        }).then(() => {
            res.redirect("/")
        })
    }
}


module.exports = userController;