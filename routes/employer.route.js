var express     = require('express');
var router      = express.Router();
var controller  = require('../controllers/employer.controller');

router.get('/paginated',                        controller.paginated);
router.get('/:id',                              controller.getById);
router.get('',                                  controller.get);
router.post('',                                 controller.post);
router.put('/:id',                              controller.put);
router.delete('/:id',                           controller.deleted);

module.exports = router;