'use strict';

const {default: api} = require('./api');
const {promisify} = require('es6-promisify');
const currify = require('currify');
const load = require('load.js');

const transformName = currify((prefix, name) => {
    return `${prefix}/monaco/${name}`;
});

const noArg = (fn) => () => fn(null);

module.exports = (el, options, callback = options) => {
    if (typeof options === 'function')
        options = {};
    
    if (typeof el === 'string')
        el = document.querySelector(el);
    
    const {
        prefix = '/deepword',
    } = options;
    
    /*eslint no-console: ["error", { allow: ["error"] }] */
    const log = (e) => console.error(e);
    
    createStatus(el);
    
    const getElement = () => el;
    const getPrefix = () => prefix;
    const monaco = promisify(loadMonaco);
    const deepword = api(parseElement(el), options);
    
    loadAll(prefix)
        .then(getPrefix)
        .then(monaco)
        .then(getElement)
        .then(parseElement)
        .then(init(prefix))
        .then(deepword)
        .then(callback)
        .catch(log);
};

function createStatus(parent) {
    const el = document.createElement('div');
    el.id = 'deepword-vim';
    
    parent.appendChild(el);
}

async function loadSocket(prefix) {
    if (window.io)
        return;
    
    await load.js(`${prefix}/dist/socket.io.js`);
}

async function loadLoader(prefix) {
    await load(transformName(prefix, 'min/vs/loader.js'));
}

async function loadAll(prefix) {
    await loadSocket(prefix);
    await loadLoader(prefix);
}

function loadMonaco(prefix, fn) {
    const {require} = window;
    const vs = transformName(prefix, 'min/vs');
    
    require.config({
        paths: {vs},
    });
    
    require(['vs/editor/editor.main'], noArg(fn));
}

const init = currify(async (prefix, el) => {
    const {monaco} = window;
    
    const {
        theme = 'vs',
        ...options
    } = await load(`${prefix}/edit.json`);
    
    const editor = monaco.editor.create(el, {
        minimap: {
            enabled: false,
        },
        value: '',
        scrollBeyondLastLine: false,
        renderWhitespace: 'all',
        contextmenu: false,
        folding: true,
        // when slow use editor.layout
        automaticLayout: true,
        theme,
    });
    
    editor.updateOptions(options);
    
    return editor;
});

function parseElement(el) {
    if (typeof el === 'string')
        return document.querySelector(el);
    
    return el;
}

