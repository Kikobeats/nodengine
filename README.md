# nodengine

<h1 align="center">
  <br>
  <img src="http://g.recordit.co/pMGKmq4ycR.gif" alt="nodengine">
  <br>
  Automatic NodeJS version switcher
  <br>
  <br>
</h1>

<p align="center"><img src="https://img.shields.io/github/tag/Kikobeats/nodengine.svg?style=flat-square" alt="Last version">
<a href="https://travis-ci.org/Kikobeats/nodengine"><img src="http://img.shields.io/travis/Kikobeats/nodengine/master.svg?style=flat-square" alt="Build Status"></a>
<a href="https://david-dm.org/Kikobeats/nodengine"><img src="http://img.shields.io/david/Kikobeats/nodengine.svg?style=flat-square" alt="Dependency status"></a>
<a href="https://david-dm.org/Kikobeats/nodengine#info=devDependencies"><img src="http://img.shields.io/david/dev/Kikobeats/nodengine.svg?style=flat-square" alt="Dev Dependencies Status"></a>
<a href="https://www.npmjs.org/package/nodengine"><img src="http://img.shields.io/npm/dm/nodengine.svg?style=flat-square" alt="NPM Status"></a>
<a href="https://paypal.me/Kikobeats"><img src="https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square" alt="Donate"></a></p>

> Psss! Follow our [@nodengine](https://twitter.com/nodengine) bot for know about the next node release

**nodengine** is an automatic NodeJS switcher based on node version declared in `package.json`.

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

Enabling automatic switching consist in a little shell script for check if `package.json` exists and then runs `nodengine`.

Add the follow snippet in a file loaded by your shell agent, for example, `.extra`.

```bash
function chpwd() {
  local PKG
  PKG=$PWD/package.json
  if [ -f "$PKG" ] && [ "$NODENGINE_LAST_DIR" != "$PWD" ]; then
    nodengine
    printf "\033[36m%s\033[0m \033[90m%s\033[0m\n" "nodengine" "$(node --version)"
    NODENGINE_LAST_DIR=$PWD
  fi
}

function cd() { builtin cd "$@" && chpwd; }
function pushd() { builtin pushd "$@" && chpwd; }
function popd() { builtin popd "$@" && chpwd; }
```

## Fetching new versions

The program use a local cache for avoid fetching versions of node all the time.

By default, new versions of node will be fetched after 5 days.

You can setup the interval using `NODENGINE_INTERVAL`

For example, if you want to fetch all versions every time that you run the program:

```bash
NODENGINE_INTERVAL=0 nodengine
```

## License

MIT © [Kiko Beats](http://kikobeats.com)
