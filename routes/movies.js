let express = require('express');
let moviesController = require("../controllers/moviesController");
const router = express.Router();


router.get('/listado', moviesController.list);


module.exports = router;