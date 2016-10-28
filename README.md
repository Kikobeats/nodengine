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

### Zsh and Bash

```shell
# Enable nodengine autoswitching
if hash nodengine 2>/dev/null; then
  function cd () { builtin cd "$@" && chpwd; }
  pushd () { builtin pushd "$@" && chpwd; }
  popd () { builtin popd "$@" && chpwd; }
  function chpwd () {
    FILE=$PWD/package.json

    if [ -f $FILE ] && [ "$LAST_NODENGINE_DIR" != "$PWD" ]; then
      nodengine
      builtin echo "changed to node $(node --version)"
      LAST_NODENGINE_DIR="$PWD"
    fi
  }
fi
```

## License

MIT © [Kiko Beats](http://kikobeats.com)
