const db = require('../database/models');
const { Op } = require('sequelize');
const { Users, Peliculas } = db;

const mainController = {

    logged: function (req, res) {
        if (req.session.userLogged) {
            Peliculas.findAll({
                include: [{ association: "genero" }]
            }).then(function (peliculas) {
                res.render('indexLogged', { peliculas: peliculas })
            })
        } else {
            res.render('index');
        }

    }
}

module.exports = mainController;