'use strict'
var request = require('request')
const TunnelClient = require('../../sel/tunnelclient')

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerTask('rantomizer', 'description', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    })
    var done = this.async()
    const client = new TunnelClient('ws://scan.rantomizer.com', '80', () => {
      client.scan('wsj', (blocks) => {
        if (blocks.length == 0) {
          grunt.log.writeln('wsj PASSED')
        } else {
          grunt.log.error(`wsj FAILED (${blocks.length})`)
          blocks.forEach(function (block) {
            grunt.log.error(`Type: ${block.type} Filter: ${block.filter} Domain: ${block.docDomain} Request: ${block.url}`)
          })
          grunt.warn(`wsj FAILED (${blocks.length})`)
        }
        done()
      })
    })
  })
}
