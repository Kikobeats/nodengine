# nodengine

<p align="center">
  <br>
  <img src="http://g.recordit.co/pMGKmq4ycR.gif" alt="demo">
  <br>
  <br>
</p>

![Last version](https://img.shields.io/github/tag/Kikobeats/nodengine.svg?style=flat-square)
[![Build Status](http://img.shields.io/travis/Kikobeats/nodengine/master.svg?style=flat-square)](https://travis-ci.org/Kikobeats/nodengine)
[![Dependency status](http://img.shields.io/david/Kikobeats/nodengine.svg?style=flat-square)](https://david-dm.org/Kikobeats/nodengine)
[![Dev Dependencies Status](http://img.shields.io/david/dev/Kikobeats/nodengine.svg?style=flat-square)](https://david-dm.org/Kikobeats/nodengine#info=devDependencies)
[![NPM Status](http://img.shields.io/npm/dm/nodengine.svg?style=flat-square)](https://www.npmjs.org/package/nodengine)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/Kikobeats)

> NodeJS switcher based on node version declared in `package.json`.

It needs a global version manager as [n](https://www.npmjs.com/package/n) or [nvm](https://www.npmjs.com/package/nvm).

## Install

```bash
$ npm install nodengine --global --production
```

## Usage
Set the desired version range in the `package.json`

```json
"engines": {
  "node": ">= 0.10"
}
```

Then just run `nodengine` to change the current node version to version declared into `package.json`.

It will use the highest version that satisfies the range.

## Automatic switching
Manual switching can be avoided.  Add the following below to your environment depending on your shell choice.

### Zsh

```bash
echo "\nchpwd () {\n nodengine\n}" >> ~/.zshrc
```
### Bash (with other version manager than NVM)

```bash
# Enable nodengine autoswitching
cd () { builtin cd "$@" && chpwd; }
pushd () { builtin pushd "$@" && chpwd; }
popd () { builtin popd "$@" && chpwd; }
chpwd () {
  FILE=$PWD/package.json

  if [ -f $FILE ];
  then
     nodengine
  fi
}
``` 

### Bash and NVM

There is a problem when using NVM and bash where your current shell isn't updated when a new version is selected/installed.
You should do the following to fix this problem:

```bash
# Enable nodengine autoswitching
cd () { builtin cd "$@" && chpwd; }
pushd () { builtin pushd "$@" && chpwd; }
popd () { builtin popd "$@" && chpwd; }
chpwd () {
  FILE=$PWD/package.json

  if [ -f $FILE ];
  then
    # With NVM, nodengine returns the selected/installed version so that we can use it
    # to force select the version to use in the current shell
    installedVersion=$(nodengine | tail -n 1) && [ -n "$installedVersion" ] && nvm use $installedVersion
  fi
}
``` 

## License

MIT © [Kiko Beats](http://kikobeats.com)
