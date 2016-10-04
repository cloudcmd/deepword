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
    
    const getElement = () => el;
    const getPrefix = () => prefix;
    
    const loadAllMonaco = Promise
        .resolve(prefix)
        .then(pify(loadMonacoLoader))
        .then(getPrefix)
        .then(pify(loadMonaco))
    
    const loadAll = pify(loadAllScripts)(prefix);
    
    Promise.all([
        loadAllMonaco,
        loadAll
    ]).then(getElement)
        .then(parseElement)
        .then(init)
        .then(deepword)
        .then(callback)
        .catch(log)
}

function loadAllScripts(prefix, fn) {
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
    const vs = `${prefix}/node_modules/monaco-editor/min/vs`;
    
    require.config({
        paths: { vs }
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

