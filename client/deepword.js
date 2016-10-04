'use strict';

import loadScript from './load-script';
import goToLine from './api/go-to-line';

export default Deepword;

function Deepword(monaco) {
    if (!(this instanceof Deepword))
        return new Deepword(monaco);
    
    this._monaco = monaco;
    this._TITLE = 'Deepword';
};

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

Deepword.prototype.goToLine = goToLine;

