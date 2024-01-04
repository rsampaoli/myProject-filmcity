const db = require('../database/models');
const { Op } = require('sequelize');
const { Users, Peliculas } = db;

const mainController = {

    logged: function (req, res) {
        if (req.session.userLogged) {
            Peliculas.findAll({
                include: [{ association: "genero" }]
            }).then(function (peliculas) {
                res.render('indexLogged', { peliculas: peliculas, user: req.session.userLogged })
            })
        } else {
            res.render('index');
        }

    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.status(500).send('Error al cerrar sesión');
            }
            res.redirect('/');
        });
    },
}

module.exports = mainController;