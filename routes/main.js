let express = require('express');

let router = express.Router();

router.get('/', function (req, res) {
    //res.send('pagina principal del sitio');
    res.render('index')
})

module.exports = router;