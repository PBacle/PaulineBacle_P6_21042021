const Sauce = require('../models/sauce');
const fs = require('fs'); /* 'file system' package used for download and storage of file, here images */

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({
      message: 'Sauce enregistrée !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};

exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file ? ( /* first case : image file in modification request */
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`) /* deleting old image file */
    }),
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    }
  ) : ( /* second case : image file is not modified */
    sauceObject = {
      ...req.body
    }
  )
  Sauce.updateOne(
      {
        _id: req.params.id
      }, {
        ...sauceObject,
        _id: req.params.id
      }
    )
    .then(() => res.status(200).json({
      message: 'Sauce modifiée !'
    }))
    .catch((error) => res.status(400).json({
      error
    }))
}

exports.deleteSauce = (req, res, next) => { 
  /* before deleting sauce from db, image file should be deleted */
  Sauce.findOne({ /* find the sauce based on id to get image url */
      _id: req.params.id
    })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      /* Delete the file with unlink method and then delete data */
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({
            _id: req.params.id
          })
          .then(() => res.status(200).json({
            message: 'Sauce supprimée !'
          }))
          .catch(error => res.status(400).json({
            error
          }));
      });
    })
    .catch(error => res.status(500).json({
      error
    }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({
      error
    }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({
      error
    }));
};

exports.likeDislike = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id

  if (like === 1) {  /* user adds a like */
    Sauce.updateOne({
        _id: sauceId
      }, {
        /* the user id is added to the array with push */
        $push: {
          usersLiked: userId
        },
        /* nb of likes is increased of 1 */
        $inc: {
          likes: +1
        }, 
      })
      .then(() => res.status(200).json({
        message: 'j\'aime ajouté !'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }else if (like === -1) { /* user adds a dislinke */
    Sauce.updateOne( 
        {
          _id: sauceId
        }, {
        /* the user id is added to the array with push */
        $push: {
            usersDisliked: userId
          },
        /* nb of dislikes is increased of 1 */
        $inc: {
            dislikes: +1
          }, 
        }
      )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté !'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }else if (like === 0) { /* user cancels a like or a dislike  */
    Sauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { /* cancelling a like */
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: { /* removed user id from the array */
                usersLiked: userId
              },
              $inc: { /* decreased nb of like */
                likes: -1
              }, 
            })
            .then(() => res.status(200).json({
              message: 'Like retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }else if (sauce.usersDisliked.includes(userId)) {  /* cancelling a dislike */
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {  /* removed user id from the array */
                usersDisliked: userId
              },
              $inc: { /* decreased nb of dislike */
                dislikes: -1
              }, 
            })
            .then(() => res.status(200).json({
              message: 'Dislike retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
      })
      .catch((error) => res.status(404).json({
        error
      }))
  }
}
