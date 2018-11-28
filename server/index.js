'use strict';

const DIR_ROOT = __dirname + '/..';
const path = require('path');

const restafary = require('restafary');
const restbox = require('restbox');
const socketFile = require('socket-file');
const {Router} = require('express');
const currify = require('currify');
const storage = require('fullstore');

const resolvePath = require('./resolve-path');
const editFn = require('./edit');

const rootStorage = storage();
const optionsStorage = storage();

const deepword = currify(_deepword);
const optionsFn = currify(configFn);
const restboxFn = currify(_restboxFn);

const isDev = process.env.NODE_ENV === 'development';

const cut = currify((prefix, req, res, next) => {
    req.url = req.url.replace(prefix, '');
    next();
});

module.exports = (options) => {
    options = options || {};
    optionsStorage(options);
    
    const prefix = options.prefix || '/deepword';
    const router = Router();
    
    const {
        dropbox,
        dropboxToken,
    } = options;
    
    router.route(prefix + '/*')
        .all(cut(prefix))
        .get(deepword(prefix))
        .get(optionsFn(options))
        .get(monaco)
        .get(editFn)
        .get(restboxFn({prefix, dropbox, dropboxToken}))
        .get(restafaryFn)
        .get(staticFn)
        .put(restboxFn({prefix, dropbox, dropboxToken}))
        .put(restafaryFn);
    
    return router;
};

module.exports.listen = (socket, options) => {
    options = options || {};
    
    const {
        root = '/',
        auth,
        prefixSocket = '/deepword',
    } = options;
    
    rootStorage(root);
    
    return socketFile(socket, {
        root,
        auth,
        prefix: prefixSocket,
    });
};

function checkOption(isOption) {
    if (typeof isOption === 'function')
        return isOption();
    
    if (typeof isOption === 'undefined')
        return true;
    
    return isOption;
}

function _deepword(prefix, req, res, next) {
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
    
    res .type('json')
        .send({
            diff,
            zip,
            online,
        });
}

function _restboxFn({dropbox, dropboxToken}, req, res, next) {
    if (!dropbox)
        return next();
    
    const {url} = req;
    const api = '/api/v1';
    const indexOf = url.indexOf.bind(url);
    const not = (fn) => (a) => !fn(a);
    const is = [
        `/api/v1`,
    ].some(not(indexOf));
    
    if (!is)
        return next();
    
    const middle = restbox({
        prefix: api,
        token: dropboxToken,
        root: rootStorage()
    });
    
    middle(req, res, next);
}

function restafaryFn(req, res, next) {
    const {url} = req;
    const api = '/api/v1/fs';
    
    if (url.indexOf(api))
        return next();
    
    const restafaryFunc = restafary({
        prefix: api,
        root: rootStorage()
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

