const db = require('../database/models');
const { Op } = require('sequelize');

let moviesController = {
    list: function (req, res) {
        db.Peliculas.findAll()
            .then(function (peliculas) {
                res.render("listado", { peliculas: peliculas })
            })
    },

    detail: function (req, res) {
        db.Peliculas.findByPk(req.params.id)
            .then((pelicula) => {
                res.render("detalle_pelicula", { pelicula: pelicula });
            })
    }
}

module.exports = moviesController;  