'use strict';

import currify from 'currify';
import goToLine from './go-to-line';
import _initSocket from './_init-socket';

import {patch, write} from 'restafary/lib/client';

export default currify(Deepword);

function Deepword(options, eddy) {
    if (!(this instanceof Deepword))
        return new Deepword(options, eddy);
    
    const {monaco} = window;
    
    this._monaco = monaco;
    this._TITLE = 'Deepword';
    
    this._eddy = eddy;
    
    const {prefix, socketPath} = options;
    
    this._initSocket(prefix, socketPath);
}

Deepword.prototype.goToLine = goToLine;
Deepword.prototype._initSocket = _initSocket;

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

