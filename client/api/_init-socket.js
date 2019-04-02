/* global io*/
import {alert} from 'smalltalk';
import {applyPatch} from 'daffy';

import {promisify} from 'es6-promisify';

const getHost = () => {
    const l = location;
    const href = l.origin || l.protocol + '//' + l.host;
    
    return href;
};

export default function _initSocket(prefix = '', socketPath = '') {
    const href = `${getHost()}${prefix}`;
    const FIVE_SECONDS = 5000;
    const socketPatch = promisify((name, data, fn) => {
        socket.emit('patch', name, data);
        fn();
    });
    
    this.on('auth', (username, password) => {
        socket.emit('auth', username, password);
    });
    
    const socket = io.connect(href, {
        'max reconnection attempts' : 2 ** 32,
        'reconnection limit'        : FIVE_SECONDS,
        path                        : socketPath + '/socket.io',
    });
    
    socket.on('reject', () => {
        this.emit('reject');
    });
    
    socket.on('connect', () => {
        this._patch = socketPatch;
    });
    
    socket.on('disconnect', () => {
        this._patch = this._patchHTTP;
    });
    
    socket.on('message', (msg) => {
        this._onSave(null, msg);
    });
    
    socket.on('patch', (name, patch, hash) => {
        const wrongFile = name !== _filename;
        const wrongHash = hash !== _story.getHash(name);
        
        if (wrongFile || wrongHash)
            return;
        
        const {
            _filename,
            _story,
            getValue,
            setValue,
            getCursor,
            moveCursorTo,
            sha,
        } = this;
        
        const value = applyPatch(getValue(), patch);
        
        setValue(value);
        
        _story
            .setData(name, value)
            .setHash(name, sha());
        
        const {row, column} = getCursor();
        moveCursorTo(row, column);
    });
    
    socket.on('file', (filename, value) => {
        this._filename = filename;
        this._value = value;
        
        this.setValue(value);
        this.setModeForPath(filename);
    });
    
    socket.on('err', (error) => {
        alert(this._TITLE, error);
    });
}

