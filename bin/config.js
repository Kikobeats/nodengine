'use strict'

const pkg = require('../package.json')
const FIVE_DAYS = 1000 * 60 * 60 * 24 * 5

const Configstore = require('configstore')
const configName = 'update-notifier-' + pkg.name
const config = new Configstore(configName, { nodeVersions: [] })
const fetchCheckInterval = process.env.NODENGINE_INTERVAL || FIVE_DAYS

const waterfall = require('async').waterfall
const fetch = require('./fetch')

function loadConfig (cb) {
  const tasks = [
    function checkCache (next) {
      const currentNodeVersions = config.get('nodeVersions')
      const lastFetchCheck = config.get('lastFetchCheck')
      const hasVersions =
        // Ignore corrupted cached versions (due to HTML error page).
        currentNodeVersions.length && !currentNodeVersions[0].includes("html");
      const now = Date.now()
      const isCacheValid = now - lastFetchCheck < fetchCheckInterval

      if (hasVersions && isCacheValid) return next(null, currentNodeVersions)

      fetch(function (err, nodeVersions) {
        if (err) {
          // no internet!
          if (err.code === 'ENOTFOUND') return next(null, currentNodeVersions)
          return next(err)
        }
        
        if (!nodeVersions || nodeVersions.length === 0) {
          return next(new Error('No NodeJS versions found!'))
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
