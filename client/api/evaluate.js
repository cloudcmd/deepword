import {alert} from 'smalltalk';
import tryCatch from 'try-catch';

const getErrorMsg = (isJS, value) => {
    if (!isJS)
        return 'Evaluation supported for JavaScript only';
    
    const [error] = tryCatch(Function(value));
    
    return error;
};

export default function evaluate() {
    const isJS = /\.js$/.test(this._filename);
    
    const getValue = this.getValue.bind(this);
    const focus = this.focus.bind(this);
    
    const msg = getErrorMsg(isJS, getValue());
    
    if (!msg)
        return;
    
    alert(this._TITLE, msg)
        .then(focus);
}

