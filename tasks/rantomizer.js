'use strict'
const url = require('url')
const TunnelClient = require('../../sel/tunnelclient')

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('rantomizer', 'description', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    let done = this.async()
    let clients = {}
    let requestCount = 0
    let expected = this.data.urls.length
    grunt.log.writeln(`Scanning ${this.data.urls}`)
    this.data.urls.forEach(function (urlString) {
      let parsedUrl = url.parse(urlString)
      let key = parsedUrl.hostname + parsedUrl.port
      if (!(key in clients)) {
        clients[key] = []
      }
      clients[key].push(parsedUrl)
    })
    // var done = this.async()
    for (var k in clients) {
      if (!clients.hasOwnProperty(k)) {
        // The current property is not a direct property of p
        continue
      }
      let urlArray = clients[k]
      let client = new TunnelClient('ws://scan.rantomizer.com', urlArray[0].hostname, urlArray[0].port == null ? 80 : urlArray[0].port, () => {
        urlArray.forEach(function (urlObject) {
          client.scan(urlObject.path, (blocks) => {
		requestCount++
            if (blocks.length == 0) {
              grunt.log.writeln(`${urlObject.href} PASSED`)
            } else {
              grunt.log.error(`${urlObject.href} FAILED (${blocks.length})`)
              blocks.forEach(function (block) {
                grunt.log.error(`Type: ${block.type} Filter: ${block.filter} Domain: ${block.docDomain} Request: ${block.url}`)
              })
              grunt.warn(`${urlObject.href} FAILED (${blocks.length})`)
            }
		if(requestCount == expected) {
			console.log(`Finished ${requestCount}/${expected}`)
			done();
		}
          })
        })
      })
    }
  })
}
