'use strict';

var request = require('request');
var eventproxy = require('eventproxy');
var clc = require('cli-color');

var ep = new eventproxy();

//test for POST /api/auth

var options = {
  url: 'http://localhost:3000/api/auth',
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'length': JSON.stringify({
      username: 'test',
      password: 'test'
    }).length
  },
  body: JSON.stringify({
    username: 'test',
    password: 'test'
  })
};

request(options, function(err, res, body) {
  if (err) {
    console.log('Error is ' + err);
  }
  console.log(body);
  if (res.statusCode === 200) {
    console.log(clc.green('Test GET TOKEN passed'));

    ep.emit('POST', JSON.parse(body).token);
  }
});

ep.all('POST', function(token) {
  options = {
    url: 'http://localhost:3000/api/auth',
    method: 'GET',
    headers: {
      'x-access-token': token
    }
  };
  console.log(options);
  request(options, function(err, res, body) {
    if (err) {
      console.log(clc.red(err));
    }
    console.log(body);
    if (res.statusCode === 200) {
      console.log(clc.green('Test AUTH TOKEN passed'));
    }
  });
});