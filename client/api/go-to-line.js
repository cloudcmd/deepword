'use strict';

import smalltalk from 'smalltalk/dist/smalltalk.min';

module.exports = function goToLine() {
    const empty = () => {};
    const msg = 'Enter line number:';
    const {lineNumber} = this._monaco.getPosition();
        
    smalltalk
        .prompt(this._TITLE, msg, lineNumber)
        .then((line) => {
            const lineNumber = Number(line);
            const column = 0;
            
            const reveal = true;
            const revealVerticalInCenter = true;
            
            this._monaco.setPosition({
                lineNumber,
                column
            }, reveal, revealVerticalInCenter);
        })
        .catch(empty)
        .then(() => {
            this._monaco.focus();
        });
    
    return this;
};

