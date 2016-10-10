'use strict';

import api from './api';
import pify from 'pify';
import currify from 'currify';
import {parallel} from 'load.js';

const loadParallel = pify(parallel);

const transformName = currify((prefix, name) => {
    return `${prefix}/node_modules/${name}`;
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
    const monaco = pify(loadMonaco);
    
    loadAll(prefix)
        .then(getPrefix)
        .then(monaco)
        .then(getElement)
        .then(parseElement)
        .then(init)
        .then(api(options))
        .then(callback)
        .catch(log)
}

function loadAll(prefix) {
    return loadParallel([
        transformName(prefix, 'monaco-editor/min/vs/loader.js')
    ]);
}

function loadMonaco(prefix, fn) {
    const {require} = window;
    const vs = `${prefix}/node_modules/monaco-editor/min/vs`;
    
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
        // when slow use editor.layout insted
        automaticLayout: true
    });
}

function parseElement(el) {
    if (typeof el === 'string')
        return document.querySelector(el);
    
    return el;
}

