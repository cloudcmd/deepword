'use strict';

import Story from './story';
import deepword from './deepword';
import pify from 'pify';
import load from 'load.js';
import currify from 'currify';

const transformName = currify((prefix, name) => {
    return `${prefix}/node_modules/${name}`;
});

const story = Story();
const noArg = (fn) => () => fn(null);

export default function(el, options, callback = options) {
    options = options || {};
    
    const prefix = options.prefix || '/deepword';
    const log = (e) => console.error(e);
    const loadAllPromise = pify(loadAll);
    const loadMonacoPromise = pify(loadMonaco);
    const getElement = () => el;
    const getPrefix = () => prefix;
    const loadMonacoLoaderPromise = pify(loadMonacoLoader);
    const loadAllMonaco = Promise.resolve(prefix)
        .then(loadMonacoLoaderPromise)
        .then(getPrefix)
        .then(loadMonacoPromise)
    
    Promise.all([
        loadAllMonaco,
        loadAllPromise(prefix)
    ]).then(getElement)
        .then(parseElement)
        .then(init)
        .then(deepword)
        .then(callback)
        .catch(log)
}

function loadAll(prefix, fn) {
    const names = [
        'smalltalk/dist/smalltalk.min.js',
        'smalltalk/dist/smalltalk.min.css'
    ].map(transformName(prefix));
    
    load.parallel(names, fn);
}

function loadMonacoLoader(prefix, fn) {
    const name = 'monaco-editor/min/vs/loader.js';
    load.js(transformName(prefix, name), fn);
}

function loadMonaco(prefix, fn) {
    const {require} = window;
    const local = `${prefix}/node_modules/monaco-editor/min/vs`;
    
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

