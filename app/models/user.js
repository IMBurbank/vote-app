'use strict';

const bcrypt = require('bcrypt'),
      mongoose = require('mongoose');

const saltRounds = 12,
      Schema = mongoose.Schema;
      

const User = new Schema({
  loginAuth: String,
  github: {
  	id: String,
  	displayName: String,
  	username: String,
    publicRepos: Number
  },
  google: { //placeholder
  	id: String,
  	displayName: String
  },
  local: {
    id: String,
    displayName: String,
    displayNameLower: String,
    email: String,
    password: String
  },
  nbrClicks: {
    clicks: Number
  }
});


User.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, saltRounds);
}

User.methods.validPassword = function(password) { 
  return bcrypt.compareSync(password, this.local.password);
}


module.exports = mongoose.model('User', User);