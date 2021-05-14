const express = require('express'); 
const bodyParser = require('body-parser'); /* package to be able to access frontend data as JSON in requests */
const mongoose = require('mongoose');
const path = require('path'); /* will be useful when dealing with storage of files */

const helmet = require("helmet");/* safety package that protects API from weaknesses and prevents some issues like cross-site scripting, MIME sniffing et clickjacking */
const nocache = require('nocache'); /* disables cache to make sure that user gets the more updated version */
require('dotenv').config(); /* file .env will contain sensitive data like connection login/password for db, key used to generate token or to encrypt data, ... in environment variables */

/* Routes */
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect(process.env.DB_URL,{ /* connecting to MongoDB */
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express(); 

/* Middleware Header to avoid issues regarding CORS security system and make sure the user can send requests from his browser */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); /* resources can be shared from any origin */
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); /* methods allowed in HTTP requests */
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

app.use(helmet());
app.use(nocache());

app.use(bodyParser.urlencoded({ extended: true })); /* requests send by user will be accessible as req.body */
app.use(bodyParser.json()); /* transform data from post request in usable JSON */

app.use('/images', express.static(path.join(__dirname, 'images'))); /* loads files that are in '/images' directory */
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
