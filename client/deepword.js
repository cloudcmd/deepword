'use strict';

import currify from 'currify';
import loadScript from './load-script';
import goToLine from './api/go-to-line';
import _initSocket from './api/_init-socket';

export default currify(Deepword);

function Deepword(options, editor) {
    if (!(this instanceof Deepword))
        return new Deepword(options, editor);
    
    this._monaco = monaco;
    this._TITLE = 'Deepword';
    
    this._editor = editor;
    this._value = '';
    
    const {prefix, socketPath} = options;
    
    this._initSocket(prefix, socketPath);
};

Deepword.prototype.goToLine = goToLine;
Deepword.prototype._initSocket = _initSocket;

Deepword.prototype.setValue = function(value) {
    this._editor.setValue(value);
    this._value = value;
    
    return this;
};

Deepword.prototype.getValue = function(value) {
    return this._editor.getValue(value);
};

Deepword.prototype.getCursor = function() {
    const {column, lineNumber } = this._monaco.getPosition();
    
    return {
        column,
        row: lineNumber
    }
}

