const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: "too much abusive request, wait 3 minutes",
}); 

router.post('/signup', userCtrl.signup); 
router.post('/login',  limiter, userCtrl.login); 


module.exports = router;
