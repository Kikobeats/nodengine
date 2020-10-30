'use strict'

const get = require('simple-get')
const URL = 'https://semver.io/node/versions'

function fetch (cb) {
  get.concat(URL, function (err, res, data) {
    if (err) return cb(err)
    const nodeVersions = data.toString().split('\n')
    return cb(null, nodeVersions)
  })
}

module.exports = fetch
