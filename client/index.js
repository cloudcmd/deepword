'use strict';

const {default: api} = require('./api');
const {promisify} = require('es6-promisify');
const currify = require('currify/legacy');
const _load = require('load.js');
const load = promisify(_load);

const {js: loadJS} = _load;

const loadSocket = promisify(_loadSocket);
const loadLoader = promisify(_loadLoader);

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

async function loadAll(prefix) {
    await loadSocket(prefix),
    await loadLoader(prefix)
}

function loadMonaco(prefix, fn) {
    const {require} = window;
    const vs = transformName(prefix, 'min/vs');
    
    require.config({
        paths: { vs }
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

