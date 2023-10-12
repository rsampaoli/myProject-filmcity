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
        if (req.session.userLogged) {
            db.Peliculas.findByPk(req.params.id, {
                include: [{ association: "genero" }]
            })
                .then((pelicula) => {
                    res.render("detalle_pelicula", { pelicula: pelicula, user: req.session.userLogged });
                })
        } else {
            res.render('index');
        }
    },

    add: function (req, res) {
        res.render('crearPelicula');
        let url = ('https://www.youtube.com/watch?v=vCA0lZqw0Pg&ab_channel=WarnerBros.PicturesLatinoam%C3%A9rica')
        let final = url.substring(32, 43)
        console.log(final)
    },

    create: function (req, res) {
        let url = (req.body.url_video);
        let final_url = url.substring(32, 43)
        Peliculas.create({
            nombre: req.body.nombre,
            description: req.body.description,
            rating: Number(req.body.rating),
            genero_id: req.body.genero,
            image: '/images/movies/' + req.file.filename,
            video_url: 'https://www.youtube.com/embed/' + final_url + '?autoplay=1'
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