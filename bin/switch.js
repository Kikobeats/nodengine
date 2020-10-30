'use strict'

const waterfall = require('async').waterfall
const semver = require('semver')

function _switch (nodeVersion) {
  const createSwitcher = require('./switcher')
  const config = require('./config')

  const tasks = [
    function loadConfig (next) {
      return config(next)
    },
    function getSwitcher (versions, next) {
      const currentVersion = process.versions.node
      const maxSatisfyVersion = semver.maxSatisfying(versions, nodeVersion)
      const switcher = createSwitcher(maxSatisfyVersion, currentVersion)

      switcher.getBin(function (err, bin) {
        return next(err, switcher, bin)
      })
    }
  ]

  waterfall(tasks, function (err, switcher, bin) {
    if (err) throw err
    if (bin) return switcher.spawn(bin)
  })
}

module.exports = _switch
