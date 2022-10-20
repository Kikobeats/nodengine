'use strict'

const _which = require('which')
const NVM_DIR = process.env.NVM_DIR

function which (bin, cb) {
  const binaries = {
    n: () => _which(bin, cb),
    nvm: () => cb(NVM_DIR ? null : 'nope')
  }
  return binaries[bin]()
}

module.exports = which
