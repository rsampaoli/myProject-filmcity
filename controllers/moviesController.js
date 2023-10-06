const db = require('../database/models');
const { Op } = require('sequelize');
const { Peliculas, Genero } = db;

let moviesController = {
    list: function (req, res) {
        db.Peliculas.findAll({
            include: [{ association: "genero" }]
        })
            .then(function (peliculas) {
                res.render("listado", { peliculas: peliculas })
            })
    },

    detail: function (req, res) {
        db.Peliculas.findByPk(req.params.id, {
            include: [{ association: "genero" }]
        })
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
            rating: Number(req.body.rating),
            genero_id: req.body.genero,
            image: '/images/movies/' + req.file.filename,
        }).then(() => {
            res.redirect("/peliculas/listado")
        }).catch(error => res.send(error))
    },

    edit: (req, res) => {
        db.Peliculas.findByPk(req.params.id, {
            include: [{ association: "genero" }]
        })
            .then((pelicula) => {
                res.render("editar_pelicula", { pelicula: pelicula });
            })
    },

    update: (req, res) => {
        Peliculas.update({
            nombre: req.body.nombre,
            description: req.body.description,
            rating: Number(req.body.rating),
            genero_id: req.body.genero,
            image: '/images/movies/' + req.file.filename,
        }, {
            where: {
                id: req.params.id
            }
        });
        res.redirect('/peliculas/listado/id/' + req.params.id)
    },

    delete: (req, res) => {
        Peliculas.findByPk(req.params.id, {
            include: [{ association: "genero" }]
        })
            .then((pelicula) => {
                res.render("borrar_pelicula", { pelicula: pelicula });
            })
    },

    destroy: (req, res) => {
        Peliculas.destroy({
            where: {
                id: req.params.id
            }
        })
        res.redirect('/peliculas/listado');
    },
}

module.exports = moviesController;  