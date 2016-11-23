'use strict';

import api from './api';
import promisify from 'es6-promisify';
import currify from 'currify/legacy';
import {js as loadJS} from 'load.js';
import series from 'async/series';

const _series = promisify(series);
const loadSocket = currify(_loadSocket);
const loadLoader = currify(_loadLoader);

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

function _loadSocket(prefix, fn) {
    if (window.io)
        return fn();
     
    return loadJS(`${prefix}/dist/socket.io.js`, fn);
}

function _loadLoader(prefix, fn) {
    loadJS(transformName(prefix, 'min/vs/loader.js'), fn)
}

function loadAll(prefix) {
    return _series([
        loadSocket(prefix),
        loadLoader(prefix)
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

