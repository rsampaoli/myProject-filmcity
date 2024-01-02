const db = require('../database/models');
const { Op } = require('sequelize');
const { Peliculas, Genero } = db;

let moviesController = {
    list: (req, res) => {
        db.Peliculas.findAll({
            include: [{ association: "genero" }]
        })
            .then((peliculas) => {
                res.render("listado", { peliculas });
            })
            .catch((error) => {
                console.error('Error al obtener películas:', error);
                res.status(500).send('Error al obtener películas');
            });
    },

    filterByGenre: (req, res) => {

        const genreId = req.params.id;

        db.Peliculas.findAll({
            include: [{ association: "genero" }],
            where: { genero_id: genreId }
        })
            .then((peliculas) => {
                res.render('listado', { peliculas });
            })
            .catch((error) => {
                console.error('Error al obtener películas por género:', error);
                res.status(500).send('Error al obtener películas por género');
            });
    },

    detail: (req, res) => {
        const { userLogged } = req.session;

        if (userLogged) {
            db.Peliculas.findByPk(req.params.id, {
                include: [{ association: "genero" }]
            })
                .then((pelicula) => {
                    res.render("detalle_pelicula", { pelicula, user: userLogged });
                })
                .catch((error) => {
                    console.error('Error al obtener la película:', error);
                    res.status(500).send('Error al obtener la película');
                });
        } else {
            res.render('index');
        }
    },

    add: function (req, res) {
        let user = req.session.userLogged;
        if (user.admin == true) {
            res.render('crearPelicula');
        } else {
            res.send('no eres admin para acceder en este sitio')
        }
    },

    create: (req, res) => {
        if (!req.body.nombre || !req.body.description || !req.body.rating || !req.body.genero || !req.file || !req.body.url_video) {
            return res.status(400).send('Todos los campos son requeridos');
        }

        let url = req.body.url_video;
        let final_url = url.substring(32, 43);

        Peliculas.create({
            nombre: req.body.nombre,
            description: req.body.description,
            rating: Number(req.body.rating),
            genero_id: req.body.genero,
            image: '/images/movies/' + req.file.filename,
            video_url: 'https://www.youtube.com/embed/' + final_url + '?autoplay=1'
        })
            .then(() => {
                res.redirect("/peliculas/listado");
            })
            .catch(error => {
                console.error('Error al crear la película:', error);
                res.status(500).send('Error al crear la película, por favor intenta nuevamente');
            });
    },

    edit: (req, res) => {
        let user = req.session.userLogged; // se carga el usuario logueado en la variablo
        if (user.admin == true) {           // pregunta de seguridad si es admin
            const peliculaId = req.params.id;
            db.Peliculas.findByPk(peliculaId, {
                include: [{ association: "genero" }]
            })
                .then((pelicula) => {
                    if (!pelicula) {
                        // Si la película no se encuentra, renderiza una página de error o redirige a una vista predeterminada
                        return res.status(404).send('La película no fue encontrada');
                    }

                    // Renderiza la vista de edición con los datos de la película
                    res.render("editar_pelicula", { pelicula: pelicula });
                })
                .catch((error) => {
                    console.error('Error al obtener la película para editar:', error);
                    res.status(500).send('Error al obtener la película para editar');
                });
        } else {
            res.send('no eres admin para acceder en este sitio')
        }
    },

    update: async (req, res) => {
        try {
            let updateData = {
                nombre: req.body.nombre,
                description: req.body.description,
                rating: Number(req.body.rating),
                genero_id: req.body.genero
            };

            if (req.file !== undefined) {
                updateData.image = '/images/movies/' + req.file.filename;
            }

            await Peliculas.update(updateData, {
                where: {
                    id: req.params.id
                }
            });

            res.redirect('/peliculas/listado/id/' + req.params.id);
        } catch (error) {
            console.error('Error al actualizar la película:', error);
            res.status(500).send('Error al actualizar la película');
        }
    },

    delete: async (req, res) => {
        let user = req.session.userLogged; // se carga el usuario logueado en la variablo
        if (user.admin == true) {           // pregunta de seguridad si es admin
            try {
                const pelicula = await Peliculas.findByPk(req.params.id, {
                    include: [{ association: "genero" }]
                });

                if (!pelicula) {
                    return res.status(404).send('Pelicula no encontrada');
                }

                res.render("borrar_pelicula", { pelicula });
            } catch (error) {
                console.error('Error al buscar la película:', error);
                res.status(500).send('Error al buscar la película');
            }
        } else {
            res.send('no eres admin para acceder en este sitio')
        }
    },

    destroy: async (req, res) => {
        try {
            const deletedRowCount = await Peliculas.destroy({
                where: {
                    id: req.params.id
                }
            });

            /*Se verifica el número de filas eliminadas (deletedRowCount). 
            Si es mayor que cero, se redirige a la página de listado de películas.
            Si es cero, significa que no se encontró una película con el ID proporcionado.*/

            if (deletedRowCount > 0) {
                res.redirect('/peliculas/listado');
            } else {
                res.status(404).send('Pelicula no encontrada');
            }
        } catch (error) {
            console.error('Error al eliminar la película:', error);
            res.status(500).send('Error al eliminar la película');
        }
    }
}

module.exports = moviesController;  