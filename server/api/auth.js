'use strict';

var express = require('express');
var router = express.Router();
var authMiddleware = require('../middleware/jwt-auth');
var User = require('../model/user');
var jwt = require('jwt-simple');
var moment = require('moment');
var authConfig = require('../config/auth');

router.post('/', function(req, res) {
  var username = req.body.username, password = req.body.password;
  User.findOne({username: username}, function(err, doc) {
    if (err||!doc) {
      res.json(400, {message: 'Error'});
    }
    if (password !== doc.password) {
      res.json(400, {message: 'Wrong password'});
    }

    var token = jwt.encode({
      iss: username,
      exp: moment().add('days', 7).valueOf()
    }, authConfig.screct);

    res.json(200, {
      token: token,
      message: 'Success'
    });

  });
});

router.get('/', authMiddleware);
router.get('/', function(req, res) {
  if (req.user) {
    return res.json(200, {message: 'Success!'});
  }
  res.json(400, {message: 'No Token'});
});

module.exports = router;