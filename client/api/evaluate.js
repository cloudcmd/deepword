'use strict';

import {alert} from 'smalltalk/legacy';
import tryCatch from 'try-catch';

export default function evaluate () {
    const isJS = /\.js$/.test(this._filename);
    
    const getValue = this.getValue.bind(this);
    const focus = this.focus.bind(this);
    
    let msg;
    
    if (!isJS) {
        msg = 'Evaluation supported for JavaScript only';
    } else {
        msg = tryCatch(Function(getValue()));
    }
    
    if (!msg)
        return;
    
    alert(this._TITLE, msg)
        .then(focus);
};

