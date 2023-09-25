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