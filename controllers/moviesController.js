const db = require('../database/models');
const { Op } = require('sequelize');
const { Peliculas } = db;

let listaPelis = function () {
    db.Peliculas.findAll()
    return listaPelis;
};


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
    },

    add: function (req, res) {
        res.render('crearPelicula');
    },

    create: function (req, res) {
        Peliculas.create({
            nombre: req.body.nombre,
            description: req.body.description,
            rating: Number(req.body.rating)
        }).then(() => {
            res.redirect("/peliculas/listado")
        });
    }
}

module.exports = moviesController;  