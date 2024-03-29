'use strict'

const { waterfall } = require('async')
const semver = require('semver')

function _switch (nodeVersion) {
  const createSwitcher = require('./switcher')

  const tasks = [
    require('./config'),
    function getSwitcher (nodeVersions, next) {
      const currentVersion = process.versions.node
      const maxSatisfyVersion = semver.maxSatisfying(nodeVersions, nodeVersion)

      // If the cache of nodes versions is corrupted (e.g. with an HTML error
      // page) or empty, we'll have a `null` version here. So instad of
      // displaying the not so clear error message of N/NVM, we'll output a more
      // explicit one.
      if (maxSatisfyVersion === null) {
        return next(
          new Error(`No maximum satisfying version found for "${nodeVersion}"`)
        )
      }

      const switcher = createSwitcher(maxSatisfyVersion, currentVersion)
      switcher.getBin((err, bin) => next(err, switcher, bin))
    }
  ]

  waterfall(tasks, (err, switcher, bin) => {
    if (err) throw err
    if (bin) return switcher.spawn(bin)
  })
}

module.exports = _switch
