let express = require('express');
let moviesController = require("../controllers/moviesController");
const router = express.Router();


router.get('/listado', moviesController.list);
router.get('/listado/id/:id', moviesController.detail)
router.get('/crearPelicula', moviesController.add);


router.post('/crearPelicula', moviesController.create)


module.exports = router;