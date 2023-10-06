let express = require('express');
let moviesController = require("../controllers/moviesController");
const router = express.Router();
const upload = require('../utils/multer');



router.get('/listado', moviesController.list);
router.get('/listado/id/:id', moviesController.detail);
router.get('/crearPelicula', moviesController.add);
router.get('/editar/id/:id', moviesController.edit);
router.get('/borrar/id/:id', moviesController.delete)


router.post('/crearPelicula', upload.single('image'), moviesController.create);
router.post('/editar/id/:id', upload.single('image'), moviesController.update);
router.post('/borrar/id/:id', moviesController.destroy);


module.exports = router;