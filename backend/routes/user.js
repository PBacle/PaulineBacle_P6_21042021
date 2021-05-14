const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const {validateBody, validators} = require('../middleware/validator'); /* import the validation middleware that will be used to validate the password when signup route is called */
const rateLimit = require("express-rate-limit"); /* package to limit repeated requests */

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes delay
    max: 3, // limit each IP to 3 requests per windowMs
    message: "too much abusive request, wait 3 minutes",
}); 

router.post('/signup', validateBody(validators.userValidator), userCtrl.signup); /* formats of password and email are validated before the creation of a new entry in the db */
router.post('/login',  limiter, userCtrl.login); /* call to limiter to limit repeated login requests */

module.exports = router;
