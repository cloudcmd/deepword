'use strict';

import Story from './story';
import deepword from './deepword';
import loadScript from './load-script';
import pify from 'pify';

const story = Story();
const noArg = (fn) => () => fn(null);

function callWith(fn, arg) {
    return () => {
        fn(arg);
    }
}

export default function(el, options = {}, callback = options) {
    const prefix = options.prefix || '/deepword';
    const log = (e) => console.error(e);
    
    pify(load)(prefix)
        .then(() => el)
        .then(element)
        .then(init)
        .then(deepword)
        .then(callback)
        .catch(log)
}

function load(prefix, fn) {
    loadScript(`${prefix}/node_modules/monaco-editor/min/vs/loader.js`, () => {
        const {require} = window;
        const local = '/deepword/node_modules/monaco-editor/min/vs';
        
        require.config({
            paths: {
                vs: local
            }
        });
        
        require(['vs/editor/editor.main'], noArg(fn));
    });
}

function init(el) {
    return monaco.editor.create(el, {
        value: '',
        language: 'javascript',
        scrollBeyondLastLine: false
    });
}

function element(el) {
    if (typeof el === 'string')
        return document.querySelector(element);
   
   return el;
}

