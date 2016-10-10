'use strict';

import pify from 'pify';
import {patch, write} from 'restafary/lib/client';
import zipio from 'zipio';
import {json} from 'load.js';
import currify from 'currify';

import goToLine from './go-to-line';
import _initSocket from './_init-socket';
import showMessage from './show-message';

const loadJson = pify(json);

export default currify(Deepword);

function Deepword(element, options, eddy) {
    if (!(this instanceof Deepword))
        return new Deepword(element, options, eddy);
    
    const {monaco} = window;
    
    this._monaco = monaco;
    this._TITLE = 'Deepword';
    this._element = element;
    
    this._eddy = eddy;
    
    const {prefix, socketPath} = options;
    
    this._prefix = prefix || '/deepword';
    this._initSocket(this._prefix, socketPath);
}

Deepword.prototype.goToLine = goToLine;
Deepword.prototype._initSocket = _initSocket;
Deepword.prototype.showMessage = showMessage;

Deepword.prototype.setValue = function(value) {
    this._eddy.setValue(value);
    
    return this;
};

Deepword.prototype.getValue = function(value) {
    return this._eddy.getValue(value);
};

Deepword.prototype.getCursor = function() {
    const {column, lineNumber } = this._monaco.getPosition();
    
    return {
        column,
        row: lineNumber
    }
};

Deepword.prototype._patchHTTP = function(path, patch) {
    const onSave = this._onSave.bind(this);
    patch(path, patch, onSave);
};

Deepword.prototype._writeHTTP = function(path, data) {
    const onSave = this._onSave.bind(this);
    write(path, data, onSave);
};

Deepword.prototype._zip = function(value, callback) {
    return pify(zipio)(value);
}

Deepword.prototype._loadOptions = async function() {
    const {_prefix, _options} = this;
    
    this._options = _options || await loadJson(`${_prefix}/options.json`);
    
    return _options;
}

