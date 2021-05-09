const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); 
const multer = require('../middleware/multer_config');

const sauceCtrl = require('../controllers/sauce');
const {validateBody, validators} = require('../middleware/sauceValidator');

router.post('/', auth, multer, validateBody(validators.sauceValidator), sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislike)

module.exports = router;
