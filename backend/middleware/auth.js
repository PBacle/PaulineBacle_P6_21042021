/* This middleware assures that the current user has the proper right to modify content or add new data in db */
/* Rights will be given based on comparison between user id send in request header and user id generated on login */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN); /* the key to decode should be the same that the one used in Controller user to generate a token when user login*/
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) { /* comparison betwen the userId send with request and the one encoded in token */
      throw 'userId non valide'; 
    } else {
      next(); 
    }
  } catch (error) { 
    res.status(401).json({
      error: error | 'Requête non authentifiée !'
    })
  }
}
