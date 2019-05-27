'use strict'

var spawn = require('child_process').spawn
var doWhilst = require('async').doWhilst
var which = require('./which')

function nvmCommand (maxSatisfyVersion, currentVersion) {
  var cmd = ''
  cmd += 'nvm install '
  cmd += maxSatisfyVersion
  if (currentVersion !== maxSatisfyVersion) {
    cmd += ' --reinstall-packages-from='
    cmd += currentVersion
  }
  return cmd
}

function createSwitcher (maxSatisfyVersion, currentVersion) {
  var binaries = {
    n: {
      cmd: 'n',
      args: [maxSatisfyVersion]
    },
    nvm: {
      cmd: process.env.SHELL,
      args: ['-c', 'source $NVM_DIR/nvm.sh; ' + nvmCommand(maxSatisfyVersion, currentVersion)]
    }
  }

  return {
    getBin: function (cb) {
      var binariesNames = Object.keys(binaries)
      var index = 0
      var bin

      function getBin (cb) {
        var binName = binariesNames[index++]
        which(binName, function (err) {
          if (!err) bin = binName
          return cb()
        })
      }

      function test (cb) {
        return cb(null, !bin && index < binariesNames.length)
      }

      doWhilst(getBin, test, function (err) {
        return cb(err, bin)
      })
    },

    spawn: function (bin) {
      bin = binaries[bin]
      return spawn(bin.cmd, bin.args, { stdio: 'inherit' })
    }
  }
}

module.exports = createSwitcher
