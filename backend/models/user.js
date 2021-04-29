const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); 

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Veuillez entrer votre adresse email"],
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez entrer une adresse email correcte"]
  },
  password: {
    type: String,
    required: [true, "Veuillez choisir un mot de passe"],
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "Le mot de passe doit contenir au moins 8 caractères dont au moins une majuscule, une minuscule et un chiffre." ] /* Modifier REGEX */
  }
});


userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
