const Sauce = require('../models/sauce');
const Joi = require('joi');

const validateSauce = (Sauce) => {
	const schema = Joi.object( {
/*		username: Joi.types.String().min(6).max(30).required(),
		password: Joi.types.String().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/).required(),
		email: Joi.types.String().email().required(),
    created: Joi.types.Date(),*/
    name: Joi.string().min(3).max(30),
    manufacturer: Joi.string().min(3).max(30),
    description: Joi.string().min(3).max(30),
    mainPepper: Joi.string().min(3).max(30),
    heat: Joi.number().min(1).max(10),
	}).options({abortEarly : false})
	return schema.validate(Sauce);
}

module.exports = {Sauce, validateSauce} ;