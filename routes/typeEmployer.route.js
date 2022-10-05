var express     = require('express');
var router      = express.Router();
var controller  = require('../controllers/typeEmployer.controller');

router.get('', controller.get);

module.exports = router;