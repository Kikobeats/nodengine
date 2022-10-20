'use strict'

const get = require('simple-get')
const URL = 'https://nodejs.org/dist/index.json'

module.exports = cb =>
  get.concat(URL, (err, res, data) => {
    if (err) return cb(err)
    const payload = JSON.parse(data)
    const nodeVersions = payload.map(({ version }) => version.replace(/^v/, ''))
    return cb(null, nodeVersions)
  })
