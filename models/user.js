var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String,
  userId: String,
  email: { type: String, unique: true},
  pwd: String,
  updated_at: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ['User', 'Contributer', 'PlaceOwner','Admin'],
    default: 'User'  
  }
});

module.exports = mongoose.model('User', UserSchema);