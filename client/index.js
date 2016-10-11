'use strict';

import api from './api';
import pify from 'pify';
import currify from 'currify';
import {parallel} from 'load.js';

const loadParallel = pify(parallel);

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
    const monaco = pify(loadMonaco);
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

function loadAll(prefix) {
    return loadParallel([
        transformName(prefix, 'min/vs/loader.js')
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
        // when slow use editor.layout
        // automaticLayout: true
    });
}

function parseElement(el) {
    if (typeof el === 'string')
        return document.querySelector(el);
    
    return el;
}

