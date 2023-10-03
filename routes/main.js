let express = require('express');
const mainController = require('../controllers/mainController');
let router = express.Router();


router.get('/', mainController.logged);

module.exports = router;