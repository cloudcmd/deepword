'use strict';

import {inherits} from 'util';

import {promisify} from 'es6-promisify';
import {patch, read, write, prefix} from 'restafary/legacy/client';
import zipio from 'zipio';
import {json as loadJson} from 'load.js';
import Emitify from 'emitify/legacy'
import {createPatch} from 'daffy';
import jssha from 'jssha';
import currify from 'currify/legacy';
import {alert} from 'smalltalk';

import goToLine from './go-to-line';
import _initSocket from './_init-socket';
import showMessage from './show-message';
import setMode from './set-mode';
import setModeForPath from './set-mode-for-path';
import save from './save';
import _onSave from './_on-save';
import _addCommands from './_add-commands';
import evaluate from './evaluate';
import {
    copyToClipboard,
    cutToClipboard,
    pastFromClipboard,
} from './clipboard';

import story from './story';

const loadJson_ = promisify(loadJson);
const read_ = promisify(read);
const zipio_ = promisify(zipio);

const _alert = currify(alert);

export default currify(Deepword);

inherits(Deepword, Emitify);

function Deepword(element, options, eddy) {
    if (!(this instanceof Deepword))
        return new Deepword(element, options, eddy);
    
    Emitify.call(this);
    
    const {monaco} = window;
    
    this._monaco = monaco;
    this._TITLE = 'Deepword';
    this._element = element;
    
    /* monaco editor bigger then element */
    this._element.style.overflow = 'hidden';
    
    this._eddy = eddy;
    
    const {maxSize, socketPath} = options;
   
    this._maxSize = maxSize || 512000;
    this._prefix = options.prefix || '/deepword';
    
    prefix(`${this._prefix}/api/v1/fs`);
    
    this._initSocket(this._prefix, socketPath);
    this._addCommands();
    this._story = story();
    
    this._isKey = true;
    
    this._write = this._writeHTTP;
    this._patch = this._patchHTTP;
}

Deepword.prototype.goToLine = goToLine;
Deepword.prototype._initSocket = _initSocket;
Deepword.prototype.showMessage = showMessage;
Deepword.prototype.setMode = setMode;
Deepword.prototype.setModeForPath = setModeForPath;
Deepword.prototype.save = save;
Deepword.prototype._onSave = _onSave;
Deepword.prototype._addCommands = _addCommands;
Deepword.prototype.evaluate = evaluate;

Deepword.prototype.copyToClipboard = copyToClipboard;
Deepword.prototype.cutToClipboard = cutToClipboard;
Deepword.prototype.pastFromClipboard = pastFromClipboard;

Deepword.prototype.isKey = function() {
    return this._isKey;
};

Deepword.prototype.enableKey = function() {
    this._isKey = true;
    return this;
};

Deepword.prototype.disableKey = function() {
    this._isKey = false;
    return this;
};

Deepword.prototype.setValue = function(value) {
    this._eddy.setValue(value);
    
    return this;
};

Deepword.prototype.setValueFirst = function(name, value) {
    this.setValue(value);
    
    this._filename = name;
    this._value = value;
    
    return this;
};

Deepword.prototype.getValue = function() {
    return this._eddy.getValue();
};

Deepword.prototype.getCursor = function() {
    const {column, lineNumber } = this._eddy.getPosition();
    
    return {
        column,
        row: lineNumber
    }
};

Deepword.prototype.moveCursorTo = function(lineNumber, column) {
    this._eddy.setPosition({
        column,
        lineNumber
    });
    
    return this;
};

Deepword.prototype.focus = function() {
    this._eddy.focus();
    return this;
}

Deepword.prototype._patchHTTP = function(path, value) {
    const onSave = this._onSave.bind(this);
    patch(path, value, onSave);
};

Deepword.prototype._writeHTTP = function(path, data) {
    const onSave = this._onSave.bind(this);
    write(path, data, onSave);
};

Deepword.prototype._zip = function(value) {
    return zipio_(value);
}

Deepword.prototype._loadOptions = async function() {
    const {_prefix, _options} = this;
    
    this._options = _options || await loadJson_(`${_prefix}/options.json`);
    
    return Promise.resolve(this._options);
}

Deepword.prototype.setOption = function(name, value) {
    const options = {};
    
    options[name] = value;
    
    if (name === 'keyMap' && value === 'vim') {
        this.showMessage('Vim mode not supported');
        return this;
    }
    
    this._eddy.updateOptions(options);
    
    return this;
}

Deepword.prototype.setOptions = function(options) {
    Object.keys(options).forEach((name) => {
        this.setOption(name, options[name]);
    });
    
    return this;
}

Deepword.prototype.isChanged = function() {
    return this._value !== this.getValue();
}

Deepword.prototype.sha = function() {
    const value = this.getValue();
    const sha = new jssha('SHA-1', 'TEXT');
    
    sha.update(value);
    
    return sha.getHash('HEX');
};

Deepword.prototype._diff = function(value) {
    return createPatch(value, this.getValue());
};

Deepword.prototype._doDiff = async function(path) {
    const {
        _value,
        _story,
    } = this;
    const ifEqual = (equal) => {
        return !equal ? '' : this._diff(_value);
    }
    
    return _story.checkHash(path)
        .then(ifEqual)
        .catch(ifEqual);
}

Deepword.prototype._readWithFlag = function(flag) {
    const {_filename, _TITLE} = this;
    
    const filename = _filename + '?' + flag;
    const setValue = (value) => {
        this.setValue(value)
            .moveCursorTo(0, 0);
    };
    
    return read_(filename)
        .then(setValue)
        .catch(_alert(_TITLE));
};

Deepword.prototype.minify = function() {
    this._readWithFlag('minify');
    return this;
};

Deepword.prototype.beautify = function() {
    this._readWithFlag('beautify');
    return this;
};

Deepword.prototype.selectAll = function() {
    const {_eddy} = this;
    const {model} = _eddy;
    const getLinesCount = model.getLineCount.bind(model);
    
    _eddy.setSelection({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: getLinesCount(),
        endColumn: Infinity
    });
    
    return this;
};

Deepword.prototype.remove = function() {
    this.showMessage('remove: Not implemented');
};

Deepword.prototype._getSelected = function() {
    const {_eddy} = this;
    const selection = _eddy.getSelection();
    
    return _eddy.model.getValueInRange(selection);
};

Deepword.prototype._showMessageOnce = function(msg) {
    if (this._showedOnce)
        return;
    
    this.showMessage(msg);
    this._showedOnce = true;
};

