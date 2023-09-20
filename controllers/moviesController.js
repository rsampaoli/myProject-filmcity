const db = require('../database/models');
const { Op } = require('sequelize');

let moviesController = {
    list: function (req, res) {
        db.Peliculas.findAll()
            .then(function (peliculas) {
                res.render("listado", { peliculas: peliculas })
            })
    },
}

module.exports = moviesController;  