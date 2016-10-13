'use strict';

import smalltalk from 'smalltalk/legacy';
import {connect} from 'socket.io-client';
import {patch} from 'restafary/lib/client';

const getHost = () => {
    const l = location;
    const href = l.origin || l.protocol + '//' + l.host;
    
    return href;
};

export default async function _initSocket(prefix = '', socketPath = '') {
    const href = `${getHost()}${prefix}`;
    const FIVE_SECONDS = 5000;
    const socketPatch = (name, data) => {
        socket.emit('patch', name, data);
    };
    
    const socket = connect(href, {
        'max reconnection attempts' : Math.pow(2, 32),
        'reconnection limit'        : FIVE_SECONDS,
        path                        : socketPath + '/socket.io'
    });
    
    socket.on('reject', () => {
        this.emit('reject');
    });
    
    socket.on('connect', () => {
        this._patch = socketPatch;
    });
    
    socket.on('disconnect', () => {
        this._patch = patch;
    });
    
    socket.on('message', (msg) => {
        this._onSave(null, msg);
    });
    
    socket.on('file', (filename, value) => {
        this._filename = filename;
        this._value = value;
        
        this.setValue(value);
        this.setModeForPath(filename);
    });
    
    socket.on('err', (error) => {
        smalltalk.alert(this._TITLE, error);
    });
}

