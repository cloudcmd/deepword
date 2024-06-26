import {inherits} from 'node:util';
import {
    patch,
    write,
    prefix,
} from 'restafary/client';
import * as load from 'load.js';
import Emitify from 'emitify';
import {createPatch} from 'daffy';
import jssha from 'jssha';
import currify from 'currify';
import {enableVim, disableVim} from './vim.js';
import goToLine from './go-to-line.js';
import _initSocket from './_init-socket.js';
import showMessage from './show-message/index.js';
import setMode from './set-mode.js';
import setModeForPath from './set-mode-for-path.js';
import save from './save.js';
import _onSave from './_on-save.js';
import _addCommands from './_add-commands.js';
import evaluate from './evaluate.js';
import {
    copyToClipboard,
    cutToClipboard,
    pastFromClipboard,
} from './clipboard.js';
import story from './story.js';

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
    
    const {
        maxSize,
        socketPath,
        prefixSocket = '/deepword',
    } = options;
    
    this._maxSize = maxSize || 512_000;
    this._prefix = options.prefix || '/deepword';
    
    prefix(`${this._prefix}/api/v1/fs`);
    
    this._initSocket(prefixSocket, socketPath);
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
    const {column, lineNumber} = this._eddy.getPosition();
    
    return {
        column,
        row: lineNumber,
    };
};

Deepword.prototype.moveCursorTo = function(lineNumber, column) {
    this._eddy.setPosition({
        column,
        lineNumber,
    });
    
    return this;
};

Deepword.prototype.focus = function() {
    this._eddy.focus();
    return this;
};

Deepword.prototype._patchHTTP = function(path, value) {
    const onSave = this._onSave.bind(this);
    patch(path, value, onSave);
};

Deepword.prototype._writeHTTP = function(path, data) {
    const onSave = this._onSave.bind(this);
    write(path, data, onSave);
};

Deepword.prototype._loadOptions = async function() {
    const {_prefix, _options} = this;
    
    this._options = _options || await load.json(`${_prefix}/options.json`);
    //return Promise.resolve(this._options);
    
    return this._options;
};

Deepword.prototype.setOption = function(name, value) {
    const options = {};
    
    options[name] = value;
    
    if (name === 'keyMap')
        this.setKeyMap(value);
    
    this._eddy.updateOptions(options);
    
    return this;
};

Deepword.prototype.setKeyMap = function(name) {
    if (name === 'vim')
        return enableVim(this._eddy, this._element);
    
    disableVim();
};

Deepword.prototype.setOptions = function(options) {
    for (const name of Object.keys(options)) {
        this.setOption(name, options[name]);
    }
    
    return this;
};

Deepword.prototype.isChanged = function() {
    return this._value !== this.getValue();
};

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
    const {_value, _story} = this;
    
    const ifEqual = (equal) => !equal ? '' : this._diff(_value);
    
    return _story
        .checkHash(path)
        .then(ifEqual)
        .catch(ifEqual);
};

Deepword.prototype.selectAll = function() {
    const {_eddy} = this;
    const {model} = _eddy;
    const getLinesCount = model.getLineCount.bind(model);
    
    _eddy.setSelection({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: getLinesCount(),
        endColumn: Infinity,
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
