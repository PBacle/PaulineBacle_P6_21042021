const Joi = require('joi');

module.exports = {
    validators : {
      sauceValidator : Joi.object({
        name: Joi.string()
                .min(3).message('name should be at least 3 characters.')
                .max(30).message('name should not be more than 30 characters.'),
        manufacturer: Joi.string()
            .min(3).message('manufacturer should be at least 3 characters.')
            .max(30).message('manufacturer should not be more than 30 characters.'),
        description: Joi.string()
            .min(3).message('description should be at least 3 characters.')
            .max(30).message('description should not be more than 30 characters.'),
        mainPepper: Joi.string()
            .min(3).message('mainPepper should be at least 3 characters.')
            .max(30).message('mainPepper should not be more than 30 characters.'),
        heat: Joi.number()
            .min(3).message('heat should be at least 3 characters.')
            .max(30).message('heat should not be more than 30 characters.'),
/*		username: Joi.types.String().min(6).max(30).required(),
		password: Joi.types.String().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/).required(),
		email: Joi.types.String().email().required(),
    created: Joi.types.Date(),*/
        }).options({abortEarly : false})
    },
  
    validateBody : (validator) => {
      return (req, res, next) => {
        console.log(req.body);
        const result  = validator.validate(req.body);
/*        res.send(result);*/

        if( result.error ) {
console.log(result.error.details);
          return res.status(400).json({
            message : result.error.details
          })
        }else {
          if(!req.value) {
            req.value = {}
          }
          req.value['body'] = result.value;
          next();
        }
      }
    }  
  }

/*module.exports = (validator) => {
    console.log(validator);
    return (req, res, next) => {
      const { error } = validator(req.body)
      console.log('error: ', error)
      if (error) {
        return res.status(400).send(error.details[0].message)
      }
      next()
    }
  }
 */
