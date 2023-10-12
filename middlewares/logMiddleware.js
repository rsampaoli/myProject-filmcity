const fs = require('fs');


function loggMiddleware(req, res, next) {
    fs.writeFileSync('log.txt', 'Se ingresó en la página ' + req.url);
    next();
}

module.exports = loggMiddleware;