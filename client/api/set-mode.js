'use strict';

module.exports = function setMode(mode) {
    const {
        _monaco,
        _eddy,
    } = this;
    
    const {createModel} = _monaco.editor;
    
    const value = this.getValue();
    const model = createModel(value, mode);
    
    _eddy.setModel(model);
    _eddy.focus();
    
    return this;
}

