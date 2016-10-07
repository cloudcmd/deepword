'use strict';

import currify from 'currify';
import goToLine from './go-to-line';
import _initSocket from './_init-socket';

export default currify(Deepword);

function Deepword(options, eddy) {
    if (!(this instanceof Deepword))
        return new Deepword(options, editor);
    
    this._monaco = monaco;
    this._TITLE = 'Deepword';
    
    this._eddy = eddy;
    
    const {prefix, socketPath} = options;
    
    this._initSocket(prefix, socketPath);
};

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
}

