'use strict';

import Story from './story';
import deepword from './deepword';
import loadScript from './load-script';
import pify from 'pify';


const story = Story();

/*
story.loadHash((a) => {
    console.log(a);
});
*/

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
        require.config({ paths: { 'vs': '/deepword/node_modules/monaco-editor/min/vs' }});
        require(['vs/editor/editor.main'], (/* no need in args */) => {
            fn();
        });
    });
}

function init(el) {
    return monaco.editor.create(el, {
        value: [
            'function x() {',
            '\tconsole.log("Hello world!");',
            '}'
        ].join('\n'),
        language: 'javascript',
        scrollBeyondLastLine: false
    });
}

function element(el) {
    if (typeof el === 'string')
        return document.querySelector(element);
   
   return el;
}

