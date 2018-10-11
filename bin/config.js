'use strict'

var pkg = require('../package.json')
var FIVE_DAYS = 1000 * 60 * 60 * 24 * 5

require('update-notifier')({ pkg: pkg }).notify()

var Configstore = require('configstore')
var configName = 'update-notifier-' + pkg.name
var config = new Configstore(configName, { nodeVersions: [] })
var fetchCheckInterval = process.env.NODENGINE_INTERVAL || FIVE_DAYS

var waterfall = require('async').waterfall
var fetch = require('./fetch')

function loadConfig (cb) {
  var tasks = [
    function checkCache (next) {
      var currentNodeVersions = config.get('nodeVersions')
      var lastFetchCheck = config.get('lastFetchCheck')
      var hasVersions = currentNodeVersions.length
      var now = Date.now()
      var isCacheValid = now - lastFetchCheck < fetchCheckInterval

      if (hasVersions && isCacheValid) return next(null, currentNodeVersions)

      fetch(function (err, nodeVersions) {
        if (err) {
          // no internet!
          if (err.code === 'ENOTFOUND') return next(null, currentNodeVersions)
          return next(err)
        }

        config.set('nodeVersions', nodeVersions)
        config.set('lastFetchCheck', now)
        return next(null, nodeVersions)
      })
    }
  ]

  return waterfall(tasks, cb)
}

module.exports = loadConfig
