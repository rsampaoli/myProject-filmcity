let express = require('express');

let router = express.Router();

router.get('/', function (req, res) {
    //res.send('pagina principal del sitio');
    if (req.session.userLogged) {
        res.render('indexLogged')
    } else {
        res.render('index')
    }
})

module.exports = router;