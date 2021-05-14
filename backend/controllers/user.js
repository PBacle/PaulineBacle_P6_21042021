const bcrypt = require('bcrypt'); /* package to encrypt password */
const User = require('../models/user');
const jwt = require('jsonwebtoken'); /* generation of a token on user login. Will be used to give authentification rights for adding/modifying/deleting data in db */
const MaskData = require('maskdata'); /* package to mask email in db */

const emailMask2Options = {
  maskWith: "*", 
  unmaskedStartCharactersBeforeAt: 1,
  unmaskedEndCharactersAfterAt: 1,
  maskAtTheRate: false
};

exports.signup = (req, res, next) => {
  const maskedEmail = MaskData.maskEmail2(req.body.email, emailMask2Options); /* email will be stored in a masked form to ensure safety */
  bcrypt.hash(req.body.password, 10) /* calling the hash method to encrypt password with salt of 10, the greater the salt the more secure the hash is but the longer it is to create */
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
  User.findOne({ /* checks if this email is in the db in its masked form */
      email: maskedEmail
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }
      bcrypt.compare(req.body.password, user.password) /* comparison of password using bcrypt */
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            });
          }
          res.status(200).json({ 
            userId: user._id,
            token: jwt.sign( /* a token is generated from userId to ensure authentificated requests afterwards */
              {
                userId: user._id 
              }, 
              process.env.TOKEN, 
              {
                expiresIn: '24h' /* generated token will expire afterwards */
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
