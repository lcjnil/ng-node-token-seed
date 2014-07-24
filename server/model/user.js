'use strict';

var mongoose = require('./mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
}, {
  collection: 'users'
});

var User = mongoose.model('users', UserSchema);

module.exports = User;