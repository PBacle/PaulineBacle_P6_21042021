const bcrypt = require('bcrypt')
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const MaskData = require('maskdata');
/*const passwordValidator = require('password-validator');*/

const emailMask2Options = {
  maskWith: "*", 
  unmaskedStartCharactersBeforeAt: 1,
  unmaskedEndCharactersAfterAt: 1,
  maskAtTheRate: false
};

exports.signup = (req, res, next) => {
/*  const schema = new passwordValidator();
  schema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(2)                                // Must have at least 2 digits
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values  

  if(schema.validate(req.body.password) == false ){ return res.status(400).json({error : 'Mot de passe invalide'}) ; }*/

  const maskedEmail = MaskData.maskEmail2(req.body.email, emailMask2Options);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: maskedEmail, 
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({
          message: 'Utilisateur créé !'
        }))
        .catch(error => res.status(400).json({
          error
        })); 
    })
    .catch(error => res.status(500).json({
      error
    }));

};

exports.login = (req, res, next) => {
  const maskedEmail = MaskData.maskEmail2(req.body.email, emailMask2Options);
  User.findOne({
      email: maskedEmail
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            });
          }
          res.status(200).json({ 
            userId: user._id,
            token: jwt.sign( 
              {
                userId: user._id
              }, 
              process.env.TOKEN, 
              {
                expiresIn: '24h'
              }
            )
          });
        })
        .catch(error => res.status(500).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};
