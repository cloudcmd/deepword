import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import {restafary} from 'restafary';
import restbox from 'restbox';
import socketFile from 'socket-file';
import {Router} from 'express';
import currify from 'currify';
import resolvePath from './resolve-path.js';
import editFn from './edit.js';

const {assign} = Object;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isUndefined = (a) => typeof a === 'undefined';
const DIR_ROOT = `${__dirname}/..`;
const deepwordMiddleware = currify(_deepwordMiddleware);
const optionsFn = currify(configFn);
const restboxFn = currify(_restboxFn);
const restafaryFn = currify(_restafaryFn);

const isFn = (a) => typeof a === 'function';
const maybe = (fn) => {
    if (isFn(fn))
        return fn();
    
    return fn;
};

const isDev = process.env.NODE_ENV === 'development';

const cut = currify((prefix, req, res, next) => {
    req.url = req.url.replace(prefix, '');
    next();
});

export function deepword(options) {
    options = options || {};
    
    const router = Router();
    const {
        prefix = '/deepword',
        dropbox,
        dropboxToken,
        root,
    } = options;
    
    router
        .route(`${prefix}/*path`)
        .all(cut(prefix))
        .get(deepwordMiddleware(prefix))
        .get(optionsFn(options))
        .get(monaco)
        .get(editFn)
        .get(restboxFn({
            root,
            dropbox,
            dropboxToken,
        }))
        .get(restafaryFn(root))
        .get(staticFn)
        .put(restboxFn({
            root,
            dropbox,
            dropboxToken,
        }))
        .put(restafaryFn(root));
    
    return router;
}

export const listen = (socket, options) => {
    options = options || {};
    
    const {
        root = '/',
        auth,
        prefixSocket = '/deepword',
    } = options;
    
    return socketFile(socket, {
        root: maybe(root),
        auth,
        prefix: prefixSocket,
    });
};

assign(deepword, {
    listen,
});

function checkOption(isOption) {
    if (isFn(isOption))
        return isOption();
    
    if (isUndefined(isOption))
        return true;
    
    return isOption;
}

function _deepwordMiddleware(prefix, req, res, next) {
    const regExp = /^\/deepword\.js(\.map)?$/;
    
    if (regExp.test(req.url))
        req.url = '/dist' + req.url;
    
    if (isDev)
        req.url = req.url.replace(/^\/dist\//, '/dist-dev/');
    
    next();
}

function configFn(o, req, res, next) {
    const online = checkOption(o.online);
    const diff = checkOption(o.diff);
    const zip = checkOption(o.zip);
    
    if (req.url.indexOf('/options.json'))
        return next();
    
    res
        .type('json')
        .send({
            diff,
            zip,
            online,
        });
}

function _restboxFn({root, dropbox, dropboxToken}, req, res, next) {
    if (!dropbox)
        return next();
    
    const {url} = req;
    const prefix = '/api/v1';
    const indexOf = url.indexOf.bind(url);
    const not = (fn) => (a) => !fn(a);
    
    const is = [`/api/v1`].some(not(indexOf));
    
    if (!is)
        return next();
    
    const middle = restbox({
        prefix,
        token: dropboxToken,
        root: maybe(root),
    });
    
    middle(req, res, next);
}

function _restafaryFn(root, req, res, next) {
    const {url} = req;
    const api = '/api/v1/fs';
    
    if (url.indexOf(api))
        return next();
    
    const restafaryFunc = restafary({
        prefix: api,
        root: maybe(root),
    });
    
    restafaryFunc(req, res, next);
}

function monaco(req, res, next) {
    if (req.url.indexOf('/monaco'))
        return next();
    
    const sendFile = res.sendFile.bind(res);
    
    const replace = (path) => req.url.replace('/monaco', path);
    const sendError = (error) => res
        .status(404)
        .send(error);
    
    resolvePath('monaco-editor')
        .then(replace)
        .then(sendFile)
        .catch(sendError);
}

function staticFn(req, res) {
    const file = path.normalize(DIR_ROOT + req.url);
    res.sendFile(file);
}
