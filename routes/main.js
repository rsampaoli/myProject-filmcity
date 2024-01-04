let express = require('express');
const mainController = require('../controllers/mainController');
let router = express.Router();


router.get('/', mainController.logged);
router.get ('/logout', mainController.logout)

module.exports = router;