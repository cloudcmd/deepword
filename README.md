Deepword [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

=======

Web editor used in [Cloud Commander](http://cloudcmd.io) based on [Monaco](https://microsoft.github.io/monaco-editor/ "Monaco").

![Deepword](https://raw.githubusercontent.com/cloudcmd/deepword/master/img/deepword.png "Deepword")

## Features
- Syntax highlighting based on extension of file for over 30 languages.
- Built-in [beautifier][beautifile] (with options in [json/beautify.json][beautify.json], could be overriden by `~/.beautify.json`)

## Install

```
npm i deepword -g
```

![NPM_INFO][NPM_INFO_IMG]

## Command line parameters

Usage: `deepword [filename]`

|Parameter              |Operation
|:----------------------|:--------------------------------------------
| `-h, --help`          | display help and exit
| `-v, --version`       | output version information and exit

## Hot keys
|Key                    |Operation
|:----------------------|:--------------------------------------------
| `Ctrl + s`            | save
| `Ctrl + f`            | find
| `Ctrl + h`            | replace
| `Ctrl + g`            | go to line
| `Ctrl + b`            | beautify js, css or html
| `Ctrl + m`            | minify js, css or html
| `Ctrl + e`            | evaluate (JavaScript only supported)

For more details see [Ace keyboard shortcuts](https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts "Ace keyboard shortcuts").

## API
Deepword could be used as middleware for [express](http://expressjs.com "Express").
For this purpuse API could be used.

### Server

#### deepword(options)
Middleware of `deepword`. Options could be omitted.

```js
var deepword  = require('deepword'),
    express = require('express'),
    app     = express();

app.use(deepword({
    minify  : true,  /* default */
    online  : true,  /* default */
    diff    : true,  /* default */
    zip     : true,  /* default */
    authCheck: function(socket, success) { /* optional */
    }
}));

app.listen(31337);
```

#### deepword.listen(socket)
Could be used with [socket.io](http://socket.io "Socket.io") to handle editor events with.

```js
var io      = require('socket.io'),
    socket  = io.listen(server);

deepword.listen(socket);
```

### Client
Deepword uses [Monaco](https://microsoft.github.io/monaco-editor/ "Monaco") on client side, so API is similar.
All you need is put minimal `html`, `css`, and `js` into your page.

Minimal html:

```html
<div class="edit" data-name="js-edit"></div>
<script src="/deepword/deepword.js"></script>
```

Minimal css:

```css
html, body, .edit {
    height: 100%;
    width: 100%;
}

body {
    margin: 0;
}

.edit {
    overflow: hidden;
}

```

Minimal js:

```js
deepword('[data-name="js-edit"]', function(editor) {
    editor.setValue('Hello deepword!');
});
```
For more information you could always look into `html` and `bin` directory.

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/deepword.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/gemnasium/cloudcmd/deepword.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPM_INFO_IMG]:             https://nodei.co/npm/deepword.png?downloads=true&&stars&&downloadRank "npm install deepword"
[NPMURL]:                   https://npmjs.org/package/deepword "npm"
[DependencyStatusURL]:      https://gemnasium.com/cloudcmd/deepword "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

[beautifile]:               https://github.com/coderaiser/node-beautifile "Beautifile"
[beautify.json]:            https://github.com/coderaiser/node-beautifile/tree/master/json/beautify.json "beautify.json"

[CoverageURL]:              https://coveralls.io/github/cloudcdmd/deepword?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/cloudcmd/deepword/badge.svg?branch=master&service=github

[BuildStatusIMGURL]:        https://img.shields.io/travis/cloudcmd/deepword/master.svg?style=flat
[BuildStatusURL]:           https://travis-ci.org/cloudcmd/deepword  "Build Status"

