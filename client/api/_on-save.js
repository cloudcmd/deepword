'use strict';

import {confirm} from 'smalltalk/legacy';
import {write} from 'restafary/legacy/client';

const empty = () => {};

export default function _onSave(error, text) {
    let msg = 'Try again?';
    
    const onSave = this._onSave.bind(this);
    const {_value, _filename} = this;
    
    if (error) {
        if (error.message)
            msg = error.message + '\n' + msg;
        else
            msg = 'Can\'t save.' + msg;
        
        confirm(this._TITLE, msg).then(() => {
            write(_filename, _value, onSave);
        }).catch(empty).then(() => {
            this.focus();
        });
    } else {
        this.showMessage(text);
        
        this._story.setData(_filename, _value)
            .setHash(_filename, this.sha());
        
        this.emit('save', _value.length);
    }
}

