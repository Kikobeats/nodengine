'use strict'

const pkg = require('../package.json')
const FIVE_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 5

const Configstore = require('configstore')
const configName = 'update-notifier-' + pkg.name
const config = new Configstore(configName, { nodeVersions: [] })
const fetchCheckInterval = process.env.NODENGINE_INTERVAL || FIVE_DAYS_IN_MS

const { waterfall } = require('async')
const fetch = require('./fetch')

const has = array => array.length > 0

function loadConfig (cb) {
  const tasks = [
    function checkCache (next) {
      const nodeVersions = config.get('nodeVersions')
      const lastFetchCheck = config.get('lastFetchCheck')
      const hasVersions = has(nodeVersions)
      const now = Date.now()
      const isCacheValid = now - lastFetchCheck < fetchCheckInterval
      const falback = () => next(null, nodeVersions)

      if (hasVersions && isCacheValid) return falback()

      fetch((err, newNodeVersions) => {
        if (err) {
          // no internet!
          if (err.code === 'ENOTFOUND') return falback()
          return next(err)
        }

        if (has(newNodeVersions)) return falback()
        config.set('nodeVersions', newNodeVersions)
        config.set('lastFetchCheck', now)
        return next(null, newNodeVersions)
      })
    }
  ]

  return waterfall(tasks, cb)
}

module.exports = loadConfig
