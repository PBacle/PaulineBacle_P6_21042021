const Joi = require('joi'); /* package that will assure validation of data before modifying database */

module.exports = {
    validators : { /* two validateur Joi objects will be created, one for each model : sauce and user */
      sauceValidator : Joi.object().keys({
        name: Joi.string() /* here follow different requirement and error messages associated for this data */
                .min(3).message('The name of the sauce should be at least 3 characters.')
                .max(60).message('The name of the sauce should not exceed 60 characters.')
                .regex(/^[a-z\u00C0-\u017F\d\-_\s]+$/i).message('The name of the sauce should contain only letters or digits.'),
        manufacturer: Joi.string()
                .min(3).message('The name of the manufacturer should be at least 3 characters.')
                .max(40).message('The name of the manufacturer should not exceed 40 characters.')
                .regex(/^[a-z\u00C0-\u017F\d\-_\s]+$/i).message('The name of the manufacturer should contain only letters or digits.'),
        description: Joi.string()
                .min(5).message('Be a little more specific : at least 10 characters to describe the sauce please :)')
                .max(150).message('The description should not exceed 40 characters.')
                .regex(/^[a-z\u00C0-\u017F\d\-_\s\.,\?!;]+$/i).message('The description should contain only letters or digits and basic punctuation.'),
        mainPepper: Joi.string()
                .min(3).message('The name of the main ingredient should be at least 3 characters.')
                .max(20).message('The name of the main ingredient should not exceed 20 characters.')
                .regex(/^[a-z\u00C0-\u017F\d\-_\s]+$/i).message('The name of the main ingredient should contain only letters or digits.'),
        heat: Joi.number()
            .min(1).message('The heat level should be between 1 and 10.')
            .max(10).message('The heat level should be between 1 and 10.'),
        }).unknown(true).options({abortEarly : false}), /* this option enables to have all errors and not stop at the first one encountered */
      userValidator : Joi.object().keys({
        password: Joi.string()
              .min(8).message('The password should be at least 8 characters.')
              .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){2})[a-zA-Z\d]+$/).message('The password must contain at least one uppercase character, one lowercase character and one digit, but no special character.')
              .invalid('Passw0rd', 'Password123'),
        email: Joi.string()
              .regex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/).message('Please give a correct email address.'),
      }).unknown(true).options({abortEarly : false})
    },
  
    validateBody : (validator, model) => {
        return (req, res, next) => {
        const { error } =  model ? validator.validate(JSON.parse(req.body[model])) : validator.validate(req.body) ; 
        const valid = error == null; /* boolean that checks if error contains anything : if not, data is valid */
        
        if (valid) { 
          next(); 
        } else { /* error messages will be displayed in console and error 422 for request will be thrown */
          const { details } = error; 
          const message = details.map(i => i.message).join("\r\n");       
          console.log("VALIDATION ERROR(s):\r\n", message); 
          res.status(422).json({ error: message }) } 
      }
    }  
  }

