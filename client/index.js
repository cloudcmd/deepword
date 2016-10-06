'use strict';

import Story from './story';
import deepword from './deepword';
import pify from 'pify';
import loadScript from './load-script';
import currify from 'currify';

const transformName = currify((prefix, name) => {
    return `${prefix}/node_modules/${name}`;
});

const story = Story();
const noArg = (fn) => () => fn(null);

export default (el, options, callback = options) => {
    options = options || {};
    
    const prefix = options.prefix || '/deepword';
    const log = (e) => console.error(e);
    
    const getElement = () => el;
    const getPrefix = () => prefix;
    const monacoLoader = pify(loadMonacoLoader);
    const monaco = pify(loadMonaco);
    
    Promise.resolve(prefix)
        .then(monacoLoader)
        .then(getPrefix)
        .then(monaco)
        .then(getElement)
        .then(parseElement)
        .then(init)
        .then(deepword)
        .then(callback)
        .catch(log)
}

function loadMonacoLoader(prefix, fn) {
    const name = 'monaco-editor/min/vs/loader.js';
    loadScript(transformName(prefix, name), fn);
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
