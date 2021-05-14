const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); /* import the middleware that will assure correct authentification of user and authorization of add/delete/modify a sauce using JsonWebToken*/
const multer = require('../middleware/multer_config'); /* import the middleware that will help with accessing and storage of image files */

const sauceCtrl = require('../controllers/sauce');
const {validateBody, validators} = require('../middleware/validator');

/* warning : auth middleware should be called first */
router.post('/', auth, multer, validateBody(validators.sauceValidator, 'sauce'), sauceCtrl.createSauce); /* content of new sauce scheme is checked and validated by middleware before creating a new entry */
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislike)

module.exports = router;
