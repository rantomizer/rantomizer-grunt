/*
 * grunt-rantomizer
 * https://github.com/johnny/rantomizer-grunt
 *
 * Copyright (c) 2016 Johnny
 * Licensed under the MIT license.
 */

'use strict'

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    // Configuration to be run (and then tested).
    rantomizer: {
      production: {
	      urls: ['http://localhost/wsj?env=prod', 'http://localhost/wsj?env=prod2']
      },
      staging: {
        urls: ['http://localhost/wsj?env=stage']
      },
      development: {
        urls: ['http://localhost/wsj?env=dev']
      }
    }

  })

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks')

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-nodeunit')

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'rantomizer', 'nodeunit'])

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test'])
}
