var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const auth = require('../config/constants/USER_CONSTANTS').ROLE;
var UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: { type: String, unique: true},
  userId: String,
  email: { type: String, unique: true},
  password: String,
  updated_at: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: [auth.User, auth.Contributor, auth.PlaceOwner,auth.Admin],
    default: auth.User  
  }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);