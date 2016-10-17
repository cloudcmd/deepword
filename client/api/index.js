'use strict';

import {inherits} from 'util';

import pify from 'pify';
import {patch, read, write, prefix} from 'restafary/lib/client';
import zipio from 'zipio';
import {json} from 'load.js';
import currify from 'currify';
import Emitify from 'emitify'
import {createPatch} from 'daffy';
import jssha from 'jssha';
import {alert} from 'smalltalk/legacy';

import goToLine from './go-to-line';
import _initSocket from './_init-socket';
import showMessage from './show-message';
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

const loadJson = pify(json);
const patch_ = pify(patch);
const read_ = pify(read);
const write_ = pify(write);
const zipio_ = pify(zipio);

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
    
    this._write = this._writeHTTP;
    this._patch = this._patchHTTP;
}

Deepword.prototype.goToLine = goToLine;
Deepword.prototype._initSocket = _initSocket;
Deepword.prototype.showMessage = showMessage;
Deepword.prototype.setModeForPath = setModeForPath;
Deepword.prototype.save = save;
Deepword.prototype._onSave = _onSave;
Deepword.prototype._addCommands = _addCommands;
Deepword.prototype.evaluate = evaluate;

Deepword.prototype.copyToClipboard = copyToClipboard;
Deepword.prototype.cutToClipboard = cutToClipboard;
Deepword.prototype.pastFromClipboard = pastFromClipboard;

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

Deepword.prototype.getValue = function(value) {
    return this._eddy.getValue(value);
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
    return patch_(path, value, onSave);
};

Deepword.prototype._writeHTTP = function(path, data) {
    const onSave = this._onSave.bind(this);
    return write_(path, data, onSave);
};

Deepword.prototype._zip = function(value) {
    return zipio_(value);
}

Deepword.prototype._loadOptions = async function() {
    const {_prefix, _options} = this;
    
    this._options = _options || await loadJson(`${_prefix}/options.json`);
    
    return _options;
}

Deepword.prototype.setOption = function(name, value) {
    const options = {};
    options[name] = value;
    
    this._eddy.updateOptions(options);
    
    return this;
}

Deepword.prototype.setOptions = function(options) {
    this._eddy.updateOptions(options);
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
    this._value = this._story.getData(this._filename);
    return createPatch(this._value, value);
};

Deepword.prototype._doDiff = async function(path) {
    const {_story} = this;
    const checkHash = pify(_story.checkHash);
    const value = this.getValue();
    const ifEqual = (equal) => {
        return !equal ? '' : this.diff(value);
    }
    
    return checkHash(path).then(ifEqual);
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
    this._eddy.setSelection({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: Infinity,
        endColumn: Infinity
    });
    
    return this;
};

Deepword.prototype.remove = function() {
    /*eslint no-console: ["error", { allow: ["log"] }] */
    console.log('remove: Not implemented');
};

Deepword.prototype._getSelected = function() {
    const {_eddy} = this;
    const {model} = _eddy;
    const selection = _eddy.getSelection();
    
    return _eddy.model.getValueInRange(selection);
};

