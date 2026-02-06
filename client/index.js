import {promisify} from 'es6-promisify';
import currify from 'currify';
import load from 'load.js';
import api from './api/index.js';

const isString = (a) => typeof a === 'string';
const isFn = (a) => typeof a === 'function';

const transformName = currify((prefix, name) => {
    return `${prefix}/monaco/${name}`;
});

const noArg = (fn) => () => fn(null);

export default (el, options, callback = options) => {
    if (isFn(options))
        options = {};
    
    if (isString(el))
        el = document.querySelector(el);
    
    const {prefix = '/deepword'} = options;
    
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
    if (globalThis.io)
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
    const {require} = globalThis;
    const vs = transformName(prefix, 'min/vs');
    
    require.config({
        paths: {
            vs,
        },
    });
    
    require(['vs/editor/editor.main'], noArg(fn));
}

const init = currify(async (prefix, el) => {
    const {monaco} = globalThis;
    const {theme = 'vs', ...options} = await load(`${prefix}/edit.json`);
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
    if (isString(el))
        return document.querySelector(el);
    
    return el;
}
