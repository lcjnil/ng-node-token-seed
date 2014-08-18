'use strict';

var myApp = angular.module('myApp', []);

myApp.controller('UserCtrl', function ($scope, $http, $window) {
  $scope.user = {username: 'test', password: 'test'};
  $scope.isAuthenticated = false;
  $scope.welcome = '';
  $scope.message = '';

  $scope.submit = function () {
    $http
      .post('/api/auth', $scope.user)
      .success(function (data, status, headers, config) {
        $window.localStorage.token = data.token;
        $scope.isAuthenticated = true;
        $scope.welcome = 'Welcome ' + data.token;
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.localStorage.token;
        $scope.isAuthenticated = false;

        // Handle login errors here
        $scope.error = 'Error: Invalid user or password';
        $scope.welcome = '';
      });
  };

  $scope.logout = function () {
    $scope.welcome = '';
    $scope.message = '';
    $scope.isAuthenticated = false;
    delete $window.localStorage.token;
  };

  $scope.callRestricted = function () {
    $http({url: '/api/auth', method: 'GET'})
      .success(function (data, status, headers, config) {
        $scope.message = $scope.message + ' ' + data.message; // Should log 'foo'
      })
      .error(function (data, status, headers, config) {
        console.log(data);
      });
  };

});

myApp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.localStorage.token) {
        config.headers['x-access-token'] = $window.localStorage.token;
      }
      return config;
    },
    responseError: function (rejection) {
      return $q.reject(rejection);
    }
  };
});

myApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});