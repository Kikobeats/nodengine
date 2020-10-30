#!/usr/bin/env node

'use strict'

const path = require('path')
const fs = require('fs')

require('meow')({
  pkg: require(path.resolve(__dirname, '../package.json')),
  help: fs.readFileSync(path.resolve(__dirname, './help.txt'), 'utf8')
})

const pkgPath = path.resolve('package.json')
const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {}
const nodeVersion = pkg.engines && pkg.engines.node

!nodeVersion ? process.exit() : require('./switch')(nodeVersion)
