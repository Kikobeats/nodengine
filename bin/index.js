#!/usr/bin/env node

'use strict'

var _pkg = require('../package.json')
require('meow')(_pkg)
var config = require('./config')

var path = require('path')
var async = require('async')
var semver = require('semver')
var which = require('./which')
var createSwitcher = require('./switcher')

var processExit = require('./util').processExit

var pkg

try {
  pkg = require(path.resolve('package.json'))
} catch (err) {
  processExit()
}

var rangeVersion = pkg.engines && pkg.engines.node

if (!rangeVersion) processExit()

config(function (versions) {
  var currentVersion = process.versions.node
  var maxSatisfyVersion = semver.maxSatisfying(versions, rangeVersion)
  var switcher = createSwitcher(maxSatisfyVersion, currentVersion)
  var switcherBin

  function getBin (next) {
    var bin = switcher.binaries.pop()
    which(bin, function (err) {
      if (!err) switcherBin = bin
      return next()
    })
  }

  function whileCondition () {
    return !switcherBin && switcher.binaries.length !== 0
  }

  async.doWhilst(getBin, whileCondition, function () {
    if (switcherBin) {
      var switcherProcess = switcher(switcherBin)

      switcherProcess.on('close', function (code) {
        if (code === 0) {
          console.log(maxSatisfyVersion)
        }
      })

      return switcherProcess
    }
  })
})
