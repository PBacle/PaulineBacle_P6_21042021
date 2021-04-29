const express = require('express'); 
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const path = require('path'); 

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

/*mongoose.connect('mongodb+srv://OCP6:0p3ncl4ssr00ms@cluster0bcle.ak7el.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{*/
mongoose.connect('mongodb+srv://PBcle:.M4.p4ul1n3.m0ng0db@cluster0bcle.ak7el.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express(); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
