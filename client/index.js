'use strict';

const {default: api} = require('./api');
const {promisify} = require('es6-promisify');
const currify = require('currify/legacy');
const {js: loadJS} = require('load.js');
const monaco = require('monaco-editor');
//import * as monaco from 'monaco-editor';
console.log(monaco);

const loadSocket = promisify(_loadSocket);
const loadLoader = currify(_loadLoader);

const transformName = currify((prefix, name) => {
    return `${prefix}/monaco/${name}`;
});

const noArg = (fn) => () => fn(null);

module.exports = (el, options, callback = options) => {
    if (typeof options === 'function')
        options = {};
    
    const prefix = options.prefix || '/deepword';
    
    /*eslint no-console: ["error", { allow: ["error"] }] */
    const log = (e) => console.error(e);
    
    const getElement = () => el;
    const getPrefix = () => prefix;
    const deepword = api(parseElement(el), options);
    
    loadSocket(prefix)
        .then(getPrefix)
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

function init(el) {
    window.MonacoEnvironment = {
        getWorkerUrl: (moduleId, label) => {
            if (label === 'json') {
                return './json.worker.bundle.js';
            }
            if (label === 'css') {
                return './css.worker.bundle.js';
            }
            if (label === 'html') {
                return './html.worker.bundle.js';
            }
            if (label === 'typescript' || label === 'javascript') {
                return './ts.worker.bundle.js';
            }
            return './editor.worker.bundle.js';
        }
    }
    
    return monaco.editor.create(el, {
        minimap: {
            enabled: false,
        },
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

