'use strict';

import io from 'socket.io-client/socket.io.js';
import smalltalk from 'smalltalk/legacy';
import modeForPath from '../mode-for-path';

const getHost = () => {
    const l = location;
    const href = l.origin || l.protocol + '//' + l.host;
    
    return href;
};

export default function _initSocket(prefix = '/deepword', socketPath = '') {
    const href = `${getHost()}${prefix}`;
    const FIVE_SECONDS = 5000;
    const patch = (name, data) => {
        socket.emit('patch', name, data);
    };
    
    const socket = io.connect(href, {
        'max reconnection attempts' : Math.pow(2, 32),
        'reconnection limit'        : FIVE_SECONDS,
        path                        : socketPath + '/socket.io'
    });
    
    socket.on('reject', () => {
        this.emit('reject');
    });
    
    socket.on('connect', () => {
        this._patch = patch;
    });
    
    socket.on('message', (msg) => {
        this._onSave(null, msg);
    });
    
    socket.on('file', (name, data) => {
        this.setValue(data);
        const {languages} = this._monaco;
        const mode = modeForPath(name, languages.getLanguages());
        const {_editor} = this;
        const oldModel = _editor.getModel();
        
        if (mode) {
            const model = this._monaco.editor.createModel(this._value, mode.id);
            _editor.setModel(model);
            oldModel.dispose();
        }
        
        /*
        this.setModeForPath(name)
            .setValueFirst(name, data)
            .moveCursorTo(0, 0);
            */
    });
    
    socket.on('err', (error) => {
        smalltalk.alert(this._TITLE, error);
    });
};
