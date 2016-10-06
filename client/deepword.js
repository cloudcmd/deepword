'use strict';

import currify from 'currify';
import loadScript from './load-script';
import goToLine from './api/go-to-line';
import _initSocket from './api/_init-socket';

export default currify(Deepword);

function Deepword(options, monaco) {
    if (!(this instanceof Deepword))
        return new Deepword(options, monaco);
    
    this._monaco = monaco;
    this._TITLE = 'Deepword';
    
    const {prefix, socketPath} = options;
    
    this._initSocket(prefix, socketPath);
};

Deepword.prototype.goToLine = goToLine;
Deepword.prototype._initSocket = _initSocket;

Deepword.prototype.setValue = function(value) {
    this._monaco.setValue(value);
    
    return this;
};

Deepword.prototype.getValue = function(value) {
    return this._monaco.getValue(value);
};

Deepword.prototype.getCursor = function() {
    const {column, lineNumber } = this._monaco.getPosition();
    
    return {
        column,
        row: lineNumber
    }
}

