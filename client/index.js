'use strict';

import api from './api';
import Promise from 'es6-promise';
import promisify from 'es6-promisify';
import currify from 'currify';
import {js} from 'load.js';
import series from 'async/series';

const loadJS = currify(js);
const _series = promisify(series);

const transformName = currify((prefix, name) => {
    return `${prefix}/monaco/${name}`;
});

const noArg = (fn) => () => fn(null);

export default (el, options, callback = options) => {
    if (typeof options === 'function')
        options = {};
    
    const prefix = options.prefix || '/deepword';
    
    /*eslint no-console: ["error", { allow: ["error"] }] */
    const log = (e) => console.error(e);
    
    const getElement = () => el;
    const getPrefix = () => prefix;
    const monaco = promisify(loadMonaco);
    const deepword = api(parseElement(el), options);
    
    loadAll(prefix)
        .then(getPrefix)
        .then(monaco)
        .then(getElement)
        .then(parseElement)
        .then(init)
        .then(deepword)
        .then(callback)
        .catch(log)
}

function loadSocket(prefix) {
    if (window.io)
        return Promise.resolve();
        
    return _loadJS(`${prefix}/dist/socket.io.js`);
}

function loadLoader(prefix) {
    return _loadJS(transformName(prefix, 'min/vs/loader.js'))
}

function loadAll(prefix) {
    return _series([
        loadJS(`${prefix}/dist/socket.io.js`),
        loadJS(transformName(prefix, 'min/vs/loader.js'))
    ]);
}

function loadMonaco(prefix, fn) {
    const {require} = window;
    const vs = transformName(prefix, 'min/vs');
    
    require.config({
        paths: { vs }
    });
    
    require(['vs/editor/editor.main'], noArg(fn));
}

function init(el) {
    const {monaco} = window;
    
    return monaco.editor.create(el, {
        value: '',
        scrollBeyondLastLine: false,
        renderWhitespace: 'all',
        contextmenu: false,
        folding: true,
        // when slow use editor.layout
        automaticLayout: true
    });
}

function parseElement(el) {
    if (typeof el === 'string')
        return document.querySelector(el);
    
    return el;
}

