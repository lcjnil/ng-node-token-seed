'use strict';

var jwt = require('jwt-simple');
var User = require('../model/user');
var authConfig = require('../config/auth');

module.exports = function(req, res, next) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  if (token) {
    try {
      var decoded = jwt.decode(token, authConfig.screct);
      if (decoded.exp <= Date.now()) {
        res.end('Access token has expired', 400);
      }
      User.findOne({ username: decoded.iss }, function(err, user) {
        req.user = user;
        return next();
      });

    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};