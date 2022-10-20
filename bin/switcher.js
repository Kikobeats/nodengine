'use strict'

const { spawn } = require('child_process')
const { doWhilst } = require('async')
const which = require('./which')

function nvmCommand (maxSatisfyVersion, currentVersion) {
  let cmd = ''
  cmd += 'nvm install '
  cmd += maxSatisfyVersion
  if (currentVersion !== maxSatisfyVersion) {
    cmd += ' --reinstall-packages-from='
    cmd += currentVersion
  }
  return cmd
}

function createSwitcher (maxSatisfyVersion, currentVersion) {
  const binaries = {
    n: {
      cmd: 'n',
      args: [maxSatisfyVersion]
    },
    nvm: {
      cmd: process.env.SHELL,
      args: [
        '-c',
        'source $NVM_DIR/nvm.sh; ' +
          nvmCommand(maxSatisfyVersion, currentVersion)
      ]
    }
  }

  return {
    getBin: cb => {
      const binariesNames = Object.keys(binaries)
      let index = 0
      let bin

      function getBin (cb) {
        const binName = binariesNames[index++]
        which(binName, err => {
          if (!err) bin = binName
          return cb()
        })
      }

      function test (cb) {
        return cb(null, !bin && index < binariesNames.length)
      }

      doWhilst(getBin, test, err => cb(err, bin))
    },

    spawn: bin => {
      bin = binaries[bin]
      return spawn(bin.cmd, bin.args, { stdio: 'inherit' })
    }
  }
}

module.exports = createSwitcher
