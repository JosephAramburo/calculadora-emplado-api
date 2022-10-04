var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: `Calculadora API modo: ${process.env.PRODUCTION == 'true' ? 'Producción' : 'Desarrollo' }` });
});

module.exports = router;
