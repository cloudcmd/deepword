'use strict';

import loadScript from './load-script';

export default Deepword;

function Deepword(monaco) {
    if (!(this instanceof Deepword))
        return new Deepword(monaco);
    
    this._monaco = monaco;
};

Deepword.prototype.setValue = function(value) {
    this._monaco.setValue(value);
    
    return this;
};

Deepword.prototype.getValue = function(value) {
    return this._monaco.getValue(value);
};

