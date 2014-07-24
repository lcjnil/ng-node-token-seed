'use strict';

var paths = {
  js: ['*.js', 'client/**/*.js', '!client/bower_components/**', 'server/**/*.js', 'bin/**/*.js'],
  html: ['packages/**/client/**/views/**', 'packages/**/server/views/**'],
  css: ['!bower_components/**', 'packages/**/client/**/css/*.css']
};

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: true
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['jshint']);
};