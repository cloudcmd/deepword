'use strict';

import Story from './story';
import deepword from './deepword';
import loadScript from './load-script';
import pify from 'pify';
import load from 'load.js';

const story = Story();
const noArg = (fn) => () => fn(null);

export default function(el, options, callback = options) {
    options = options || {};
    
    const prefix = options.prefix || '/deepword';
    const log = (e) => console.error(e);
    const loadAllPromise = pify(loadAll);
    const loadMonacoPromise = pify(loadMonaco);
    const getElement = () => el;
    const getMonaco = () => loadMonacoPromise(prefix);
    
    loadAllPromise(prefix)
        .then(getMonaco)
        .then(getElement)
        .then(parseElement)
        .then(init)
        .then(deepword)
        .then(callback)
        .catch(log)
}

function loadAll(prefix, fn) {
    const names = [
        'monaco-editor/min/vs/loader.js',
        'smalltalk/dist/smalltalk.min.js',
        'smalltalk/dist/smalltalk.min.css'
    ].map((name) => {
        return `${prefix}/node_modules/${name}`;
    });
    
    load.parallel(names, fn);
}

function loadMonaco(prefix, fn) {
    const {require} = window;
    const local = '/deepword/node_modules/monaco-editor/min/vs';
    
    require.config({
        paths: {
            vs: local
        }
    });
    
    require(['vs/editor/editor.main'], noArg(fn));
}

function init(el) {
    return monaco.editor.create(el, {
        value: '',
        language: 'javascript',
        scrollBeyondLastLine: false
    });
}

function parseElement(el) {
    if (typeof el === 'string')
        return document.querySelector(element);
   
   return el;
}

