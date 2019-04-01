Deepword [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]
=======

Web editor used in [Cloud Commander](http://cloudcmd.io) based on [Monaco](https://microsoft.github.io/monaco-editor/ "Monaco").

![Deepword](https://raw.githubusercontent.com/cloudcmd/deepword/master/img/deepword.png "Deepword")

## Features
- Syntax highlighting based on extension of file for over 30 languages.
- Configurable options ([edit.json](json/edit.json) could be overriden by `~/.deepword.json`) according to [monaco editor options](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html)

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
| `Ctrl + e`            | evaluate (JavaScript only supported)

For more details see [Ace keyboard shortcuts](https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts "Ace keyboard shortcuts").

## Options

You can override [monaco editor options](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html) in `~/.deepword.json`.

### Theme

To override `theme` use `theme` options in `~/.deepword.json`. Themes can be:
- `vs`
- `vs-dark`

## API
Deepword could be used as middleware for [express](http://expressjs.com "Express").
For this purpuse API could be used.

### Server

#### deepword(options)
Middleware of `deepword`. Options could be omitted.

```js
const deepword = require('deepword');
const express = require('express');
const app = express();

app.use(deepword({
    diff: true,             // default
    zip : true,             // default
    dropbox: false,         // optional
    dropboxToken: 'token',  // optional
}));

app.listen(31337);
```

#### deepword.listen(socket)
Could be used with [socket.io](http://socket.io "Socket.io") to handle editor events with.

```js
const io = require('socket.io'),
const socket = io.listen(server);

deepword.listen(socket, {
    prefixSocket: '/deepword', // optional
    auth: (accept, reject) => (username, password) => { // optional
        accept();
    }
});
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
deepword('[data-name="js-edit"]', (editor) => {
    editor.setValue('Hello deepword!');
});
```
For more information you could always look into `html` and `bin` directory.

## Related

- [Edward](https://github.com/cloudcmd/edward "Edwdard") - web editor based on [Ace](https://ace.c9.io "Ace").
- [Dword](https://github.com/cloudcmd/dword "Dword") - web editor based on [Codemirror](https://codemirror.net "Codemirror").

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/deepword.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/david/cloudcmd/deepword.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPM_INFO_IMG]:             https://nodei.co/npm/deepword.png?downloads=true&&stars&&downloadRank "npm install deepword"
[NPMURL]:                   https://npmjs.org/package/deepword "npm"
[DependencyStatusURL]:      https://david-dm.org/cloudcmd/deepword "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

[CoverageURL]:              https://coveralls.io/github/cloudcmd/deepword?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/cloudcmd/deepword/badge.svg?branch=master&service=github

[BuildStatusIMGURL]:        https://img.shields.io/travis/cloudcmd/deepword/master.svg?style=flat
[BuildStatusURL]:           https://travis-ci.org/cloudcmd/deepword  "Build Status"

