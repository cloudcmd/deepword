'use strict';

import {alert} from 'smalltalk/legacy';
import tryCatch from 'try-catch';

const getMsg = (isJS, value) => {
    if (!isJS)
        return 'Evaluation supported for JavaScript only';
    
    return tryCatch(Function(value));
}

export default function evaluate () {
    const isJS = /\.js$/.test(this._filename);
    
    const getValue = this.getValue.bind(this);
    const focus = this.focus.bind(this);
    
    const msg = getMsg(isJS, getValue());
    
    if (!msg)
        return;
    
    alert(this._TITLE, msg)
        .then(focus);
}

