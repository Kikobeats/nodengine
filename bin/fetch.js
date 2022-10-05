'use strict'

const get = require('simple-get')
const URL = 'https://nodejs.org/dist/index.json'

function fetch(cb) {
  get.concat(URL, function (err, res, data) {
    if (err) return cb(err)
    const nodeVersions = JSON.parse(data.toString()).map(function (versionItem) {
      return versionItem.version.replace(/^v/, '')
    })

    // When the nodejs.org service is down, it returns an HTML error page.
    // For example, when in maintenance mode, we get a Heroku maintenance page.
    if (nodeVersions[0].includes('html')) {
      return cb(
        new Error(
          `Unable to fetch NodeJS versions from "${URL}" (maybe it's down or under maintenance)`
        )
      )
    }

    return cb(null, nodeVersions)
  })
}

module.exports = fetch
