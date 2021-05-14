const multer = require('multer');

const MIME_TYPES = { /* library that will be used to define image file extension in storage */
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ /* creation of an object that tells where the files are stored and their names */
  destination: (req, file, callback) => {
    callback(null, 'images'); /* directory created in backend for images storage */
  },
  filename: (req, file, callback) => {
    let name = file.originalname.split(' ').join('_'); /* remove any space in file name */
    let extension = MIME_TYPES[file.mimetype]; /* get extension based on library created earlier from file.mimetype*/
    name = name.replace("." + extension, "_"); 
    callback(null, name + Date.now() + '.' + extension); /* adding a timestamp before extension makes sure we don't have issues with files with the same name */
  }
});

module.exports = multer({storage: storage}).single('image'); /* method single is used to tell that the file is unique and it's an image  */
