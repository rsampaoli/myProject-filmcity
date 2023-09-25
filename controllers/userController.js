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

    profile: function (req, res) {
        res.render('profile', { user: req.session.userLogged });
    },

    loginProcess: async (req, res) => {
        let userFound = await Users.findOne({ // buscar el email del usuario en la base de datos
            where: {
                email: req.body.email
            }
        });
        console.log(userFound)
        if (!userFound) { // validar si el usuario no existe en la base de datos
            return res.send('no se encuentra el usuario');
        } else {
            if (userFound.password === req.body.pass) {  //pregunto si la pass coincide, la que pone en la pag, con la BD
                delete userFound.password;               //en caso de positivo, borro la pass para no enviarla con el req
                req.session.userLogged = userFound;      //asigno a req.session el usuario encontrado   
                res.redirect('/usuario/profile')
            } else {
                res.send('esa no es la pass')
            }
        };
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